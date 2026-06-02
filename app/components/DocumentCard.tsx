"use client";

import { useRouter } from "next/navigation";
import { FileText, ChevronRight } from "lucide-react";

interface Props {
  id: string;
  title: string;
  createdAt: string;
  flashcardCount: number;
  mcqCount: number;
}

export default function DocumentCard({
  id,
  title,
  createdAt,
  flashcardCount,
  mcqCount,
}: Props) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/document/${id}`)}
      className="bg-gray-900 border border-gray-800 hover:border-blue-500/50 rounded-xl p-5 cursor-pointer transition group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/10 p-2 rounded-lg">
            <FileText className="text-blue-400" size={20} />
          </div>
          <div>
            <h3 className="font-medium text-white group-hover:text-blue-400 transition">
              {title}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <ChevronRight
          className="text-gray-600 group-hover:text-blue-400 transition"
          size={20}
        />
      </div>
      <div className="flex gap-4 mt-4">
        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-md">
          {flashcardCount} flashcards
        </span>
        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-md">
          {mcqCount} MCQs
        </span>
      </div>
    </div>
  );
}
