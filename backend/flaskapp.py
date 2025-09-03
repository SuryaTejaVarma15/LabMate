from flask import Flask, request, jsonify   # Import Flask tools
import os                                   # For file paths
import fitz                                 # PyMuPDF for PDF text extraction

# Initialize app
app = Flask(__name__)

# Uploads folder
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Root route
@app.route("/")
def home():
    return jsonify({"message": "LabMate backend running"})

# Upload route
@app.route("/upload", methods=["POST"])
def upload_file():
    print("DEBUG - Upload request received")   # Debug log

    if "file" not in request.files:
        print("DEBUG - No file part in request")  # Debug log
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    print("DEBUG - File received:", file.filename)  # Debug log

    if file.filename == "":
        print("DEBUG - No filename provided")  # Debug log
        return jsonify({"error": "No selected file"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    print("DEBUG - File saved at:", file_path)  # Debug log

    return jsonify({"message": "File uploaded successfully", "path": file_path})

# Ask route
@app.route("/ask", methods=["POST"])
def ask_question():
    print("DEBUG - Ask request received")   # Debug log
    print("DEBUG - Headers:", request.headers)  # Debug log
    print("DEBUG - Raw data:", request.data)    # Debug log

    data = request.get_json()
    print("DEBUG - Parsed JSON:", data)     # Debug log

    if not data or "filename" not in data or "question" not in data:
        print("DEBUG - Invalid request JSON")   # Debug log
        return jsonify({"error": "Invalid request"}), 400

    filename = data["filename"]
    question = data["question"]
    print("DEBUG - Filename:", filename)    # Debug log
    print("DEBUG - Question:", question)    # Debug log

    file_path = os.path.join(UPLOAD_FOLDER, filename)
    print("DEBUG - Checking file path:", file_path)  # Debug log

    if not os.path.exists(file_path):
        print("DEBUG - File not found in uploads folder")  # Debug log
        return jsonify({"error": "File not found"}), 404

    # Extract text from PDF
    text = ""
    print("DEBUG - Starting PDF extraction")  # Debug log
    with fitz.open(file_path) as pdf:
        for page_num, page in enumerate(pdf, start=1):
            page_text = page.get_text()
            print(f"DEBUG - Extracted text length from page {page_num}: {len(page_text)}")  # Debug log
            text += page_text

    print("DEBUG - Total extracted text length:", len(text))  # Debug log

    # Simple answer (later AI Q/A can replace this)
    answer = f"Question: {question}\n\nExtracted Content:\n{text[:500]}..."
    print("DEBUG - Final answer prepared")  # Debug log

    return jsonify({"answer": answer})

# Run app
if __name__ == "__main__":
    print("DEBUG - Starting Flask server...")  # Debug log
    app.run(debug=True)
