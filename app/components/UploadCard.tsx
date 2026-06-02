"use client";

import { useState } from "react";
import { Upload, Loader2, Sparkles } from "lucide-react";

interface Props {
  userId: string;
  onSuccess: () => void;
}

export default function UploadCard({ userId, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("title", title || file.name.replace(".pdf", ""));

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok) {
      setError(uploadData.error || "Upload failed");
      setUploading(false);
      return;
    }

    setUploading(false);
    setGenerating(true);

    const genRes = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId: uploadData.document.id }),
    });

    if (!genRes.ok) {
      setError("AI generation failed. Is Ollama running?");
      setGenerating(false);
      return;
    }

    setGenerating(false);
    setFile(null);
    setTitle("");
    onSuccess();
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Upload size={18} className="text-blue-400" />
        Upload Study Material
      </h2>
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}
      <div className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document title (optional)"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition text-sm"
        />
        <label className="block w-full border-2 border-dashed border-gray-700 hover:border-blue-500/50 rounded-lg p-6 text-center cursor-pointer transition">
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file ? (
            <span className="text-blue-400 text-sm">{file.name}</span>
          ) : (
            <span className="text-gray-500 text-sm">Click to select a PDF</span>
          )}
        </label>
        <button
          onClick={handleUpload}
          disabled={!file || uploading || generating}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg py-2.5 font-medium transition flex items-center justify-center gap-2 text-sm"
        >
          {uploading && <Loader2 size={16} className="animate-spin" />}
          {generating && <Sparkles size={16} className="animate-pulse" />}
          {uploading
            ? "Uploading..."
            : generating
              ? "Generating with AI..."
              : "Upload & Generate"}
        </button>
      </div>
    </div>
  );
}
