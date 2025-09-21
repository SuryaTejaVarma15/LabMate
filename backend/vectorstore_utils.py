# backend/vectorstore_utils.py

import os
from dotenv import load_dotenv

# Embeddings
from langchain_openai import OpenAIEmbeddings   # modern OpenAI embeddings
from langchain_community.embeddings import GPT4AllEmbeddings  # fallback local embeddings

# Vectorstore
from langchain_chroma import Chroma  # modern Chroma vectorstore

# ---------------------------
# Load environment variables
# ---------------------------
load_dotenv()  # Make sure you have a .env file with keys

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")  # Read key from .env
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_BASE_URL = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.2-90b-vision-preview")

# ---------------------------
# Embeddings initialization
# ---------------------------
def get_embeddings():
    """
    Returns an embeddings object:
    - OpenAIEmbeddings if OPENAI_API_KEY is present
    - GPT4AllEmbeddings (local, free) if no OpenAI key
    """
    if OPENAI_API_KEY:
        print("[INFO] Using OpenAIEmbeddings")
        return OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
    else:
        print("[INFO] Using local GPT4AllEmbeddings")
        return GPT4AllEmbeddings(model_name="ggml-model-q4_0.bin")  # Ensure this file exists locally

# ---------------------------
# Chroma vectorstore initialization
# ---------------------------
def get_vectorstore(persist_directory="vectorstore", embedding_model=None):
    """
    Returns a Chroma vectorstore instance.
    Stores text + optional base64 images with metadata.
    """
    if embedding_model is None:
        embedding_model = get_embeddings()

    vectordb = Chroma(
        persist_directory=persist_directory,
        embedding_function=embedding_model,
        collection_name="labmate_docs"
        # removed anonymized_telemetry
    )
    return vectordb


# ---------------------------
# Store documents to vectorstore
# ---------------------------
def store_in_chroma(docs, persist_directory="vectorstore"):
    """
    docs: list of dicts, each with keys:
      - 'text': string
      - 'metadata': dict (optional)
      - 'images': list of base64 strings (optional)
    """
    if not docs:
        print("[WARNING] No documents to store.")
        return

    vectordb = get_vectorstore(persist_directory=persist_directory)

    for doc in docs:
        text = doc.get("text", "")
        metadata = doc.get("metadata", {})
        images = doc.get("images", [])

        # Combine text + base64 images if present
        combined_text = text
        if images:
            combined_text += "\n" + "\n".join(images)

        vectordb.add_texts([combined_text], metadatas=[metadata])

    vectordb.persist()
    print(f"[INFO] Stored {len(docs)} documents to vectorstore at '{persist_directory}'")
