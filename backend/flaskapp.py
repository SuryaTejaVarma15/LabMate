# backend/flaskapp.py
import os
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from ingestion import ingest_pdf  # your existing PDF ingestion function
from vectorstore_utils import store_in_chroma, get_embeddings  # vectorstore helper
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import GPT4AllEmbeddings
from langchain.embeddings import OpenAIEmbeddings
from langchain.schema import Document

# ---------------------------
# Flask app setup
# ---------------------------
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
EXTRACTED_FOLDER = "extracted"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(EXTRACTED_FOLDER, exist_ok=True)

# ---------------------------
# Helper: call Groq Chat API
# ---------------------------
def call_groq_chat(prompt: str, max_tokens=512, temperature=0.0):
    groq_base = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
    groq_key = os.getenv("GROQ_API_KEY")
    model = os.getenv("GROQ_MODEL", "llama-3.2-90b-vision-preview")

    if not groq_key:
        raise RuntimeError("GROQ_API_KEY not set in environment")

    url = f"{groq_base}/chat/completions"
    headers = {
        "Authorization": f"Bearer {groq_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You are a helpful assistant specialized in answering questions from lab manuals."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": max_tokens,
        "temperature": temperature
    }

    resp = requests.post(url, headers=headers, json=payload, timeout=60)
    resp.raise_for_status()
    data = resp.json()
    try:
        return data["choices"][0]["message"]["content"]
    except Exception:
        return json.dumps(data)

# ---------------------------
# Home route
# ---------------------------
@app.route("/")
def home():
    return jsonify({"message": "LabMate backend running"})

# ---------------------------
# Upload + Ingest + Store in Chroma
# ---------------------------
@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Save uploaded PDF
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # Step 1: Ingest PDF (extract text + images)
    ingestion_result = ingest_pdf(
        file_path,
        output_dir=os.path.join(EXTRACTED_FOLDER, f"{file.filename}_assets")
    )

    # Step 2: Store in Chroma vectorstore
    store_in_chroma(file.filename, ingestion_result)

    return jsonify({
        "message": "File uploaded, ingested, and stored in Chroma successfully",
        "filename": file.filename,
        "text_chunks": len(ingestion_result.get("text_chunks", [])),
        "images": len(ingestion_result.get("images", []))
    })

# ---------------------------
# Ask a question endpoint
# ---------------------------
@app.route("/ask", methods=["POST"])
def ask_question():
    data = request.get_json(force=True)
    filename = data.get("filename")
    question = data.get("question")

    if not filename or not question:
        return jsonify({"error": "filename and question are required"}), 400

    persist_dir = os.path.join("vectorstore", filename)
    if not os.path.exists(persist_dir):
        return jsonify({"error": "Vectorstore not found. Re-upload and ingest PDF."}), 404

    # Choose embeddings consistent with storage
    embedding_fn = get_embeddings()

    # Load Chroma vectorstore
    vectorstore = Chroma(
        collection_name="labmate_rag",
        embedding_function=embedding_fn,
        persist_directory=persist_dir
    )

    # Retrieve top-k similar documents
    retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 5})
    docs = retriever.get_relevant_documents(question)  # returns list of Document objects
    retrieved_texts = []
    images_base64 = []

    for d in docs:
        md = getattr(d, "metadata", {}) or {}
        if md.get("type") == "image":
            images_base64.append(d.page_content)
        else:
            retrieved_texts.append(d.page_content)

    # Build Groq prompt
    context = "\n\n---\n\n".join(retrieved_texts)
    prompt = f"""Use ONLY the following context to answer the question. If the answer is not in the context, say you don't know.

Context:
{context}

Question:
{question}
"""
    if images_base64:
        prompt += "\n\n(Note: there is an image in the context provided as base64.)"

    # Call Groq Chat API
    try:
        answer = call_groq_chat(prompt)
    except Exception as e:
        return jsonify({"error": f"Model call failed: {str(e)}"}), 500

    return jsonify({
        "question": question,
        "answer": answer,
        "retrieved_chunks": len(retrieved_texts),
        "images_found": len(images_base64)
    })

# ---------------------------
# Run Flask
# ---------------------------
if __name__ == "__main__":
    app.run(debug=True)
