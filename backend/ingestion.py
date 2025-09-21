# backend/ingestion.py
import os
import fitz  # PyMuPDF
import base64

def ingest_pdf(pdf_path, output_dir="extracted", chunk_size=1000, chunk_overlap=200):
    """
    Extract text and images from PDF and split into hybrid chunks.
    Text is split into overlapping chunks. Images are separate chunks.
    Returns a dict with text_chunks and images.
    """
    os.makedirs(output_dir, exist_ok=True)

    doc = fitz.open(pdf_path)
    text_chunks = []
    images = []

    for page_num, page in enumerate(doc):
        # ---- Extract text ----
        text = page.get_text("text")
        if text.strip():
            # Split text into overlapping chunks
            start = 0
            while start < len(text):
                end = start + chunk_size
                chunk_text = text[start:end]
                text_chunks.append({
                    "page": page_num + 1,
                    "content": chunk_text
                })
                start += chunk_size - chunk_overlap

        # ---- Extract images ----
        for img_index, img in enumerate(page.get_images(full=True)):
            xref = img[0]
            pix = fitz.Pixmap(doc, xref)
            img_filename = os.path.join(output_dir, f"page{page_num+1}_img{img_index+1}.png")
            
            if pix.n - pix.alpha < 4:  # GRAY or RGB
                pix.save(img_filename)
            else:  # CMYK -> RGB
                pix = fitz.Pixmap(fitz.csRGB, pix)
                pix.save(img_filename)
            
            # Encode image as base64 for vector store storage
            with open(img_filename, "rb") as f:
                b64_data = base64.b64encode(f.read()).decode("utf-8")
            images.append({
                "page": page_num + 1,
                "image_file": img_filename,
                "b64": b64_data
            })

    doc.close()

    return {
        "text_chunks": text_chunks,
        "images": images
    }
