import axios from "axios";
const api = axios.create({ baseURL: "", timeout: 60000 });

export async function uploadPDF(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await api.post("/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function askQuestion(filename, question) {
  const res = await api.post("/ask", { filename, question });
  return res.data;
}

export default api;
