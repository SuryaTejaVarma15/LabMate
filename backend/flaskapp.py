# backend/app.py
from flask import Flask, request, jsonify
import os
import fitz  # PyMuPDF
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/")
def home():
    return jsonify({"message": "LabMate backend running"})


# ---------- UPLOAD ----------
@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    return jsonify({
        "message": "File uploaded successfully",
        "filename": file.filename
    })


# ---------- ASK ----------
@app.route("/ask", methods=["POST"])
def ask_question():
    data = request.get_json()

    if not data or "filename" not in data or "question" not in data:
        return jsonify({"error": "Invalid request"}), 400

    filename = data["filename"]
    question = data["question"]

    file_path = os.path.join(UPLOAD_FOLDER, filename)

    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    text = ""
    try:
        with fitz.open(file_path) as pdf:
            for page in pdf:
                text += page.get_text()
    except Exception as e:
        return jsonify({"error": f"Failed to read PDF: {str(e)}"}), 500

    # Just a placeholder answer for now
    answer = f"❓ Question: {question}\n\n📄 Extracted (first 500 chars):\n{text[:500]}..."

    return jsonify({"answer": answer})


if __name__ == "__main__":
    app.run(debug=True)
