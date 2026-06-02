"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import UploadCard from "@/app/components/UploadCard";
import DocumentCard from "@/app/components/DocumentCard";
import { Loader2 } from "lucide-react";

interface Document {
  id: string;
  title: string;
  createdAt: string;
  _count: { flashcards: number; mcqs: number };
}

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.id);
      fetchDocuments(user.id);
    };
    init();
  }, []);

  const fetchDocuments = async (uid: string) => {
    setLoading(true);
    const res = await fetch(`/api/documents?userId=${uid}`);
    const data = await res.json();
    setDocuments(data.documents || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">My Study Materials</h1>
          <p className="text-gray-500 text-sm mt-1">
            Upload PDFs and let AI generate flashcards and MCQs
          </p>
        </div>

        <div className="mb-8">
          {userId && (
            <UploadCard
              userId={userId}
              onSuccess={() => fetchDocuments(userId)}
            />
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-gray-500" size={24} />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 text-gray-600 text-sm">
            No documents yet. Upload a PDF to get started!
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                id={doc.id}
                title={doc.title}
                createdAt={doc.createdAt}
                flashcardCount={doc._count.flashcards}
                mcqCount={doc._count.mcqs}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
