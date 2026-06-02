"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/app/components/Navbar";
import FlashCard from "@/app/components/FlashCard";
import MCQCard from "@/app/components/MCQCard";
import ScoreChart from "@/app/components/ScoreChart";
import { Loader2, RefreshCw, Layers, HelpCircle } from "lucide-react";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: string;
}

interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Session {
  score: number;
  total: number;
  createdAt: string;
  mode: string;
}

type Mode = "select" | "flashcard" | "mcq" | "done";

export default function DocumentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [userId, setUserId] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [mcqs, setMCQs] = useState<MCQ[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [documentTitle, setDocumentTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [mode, setMode] = useState<Mode>("select");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<
    Array<{ questionId: string; correct: boolean }>
  >([]);

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
      fetchData(user.id);
    };
    init();
  }, []);

  const fetchData = async (uid: string) => {
    setLoading(true);
    const [docRes, sessRes] = await Promise.all([
      fetch(`/api/documents/${id}`),
      fetch(`/api/sessions?documentId=${id}&userId=${uid}`),
    ]);
    const docData = await docRes.json();
    const sessData = await sessRes.json();

    setDocumentTitle(docData.document?.title || "");
    setFlashcards(docData.flashcards || []);
    setMCQs(docData.mcqs || []);
    setSessions(sessData.sessions || []);
    setLoading(false);
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId: id }),
    });
    if (userId) await fetchData(userId);
    setRegenerating(false);
  };

  const startMode = (m: "flashcard" | "mcq") => {
    setMode(m);
    setCurrentIndex(0);
    setAnswers([]);
  };

  const handleFlashcardAnswer = async (knew: boolean) => {
    const card = flashcards[currentIndex];
    const newAnswers = [...answers, { questionId: card.id, correct: knew }];
    setAnswers(newAnswers);

    if (currentIndex + 1 >= flashcards.length) {
      const score = newAnswers.filter((a) => a.correct).length;
      await saveSession(score, flashcards.length, "flashcard", newAnswers);
      setMode("done");
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleMCQAnswer = async (correct: boolean) => {
    const mcq = mcqs[currentIndex];
    const newAnswers = [...answers, { questionId: mcq.id, correct }];
    setAnswers(newAnswers);

    if (currentIndex + 1 >= mcqs.length) {
      const score = newAnswers.filter((a) => a.correct).length;
      await saveSession(score, mcqs.length, "mcq", newAnswers);
      setMode("done");
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const saveSession = async (
    score: number,
    total: number,
    sessionMode: string,
    sessionAnswers: Array<{ questionId: string; correct: boolean }>,
  ) => {
    await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        documentId: id,
        userId,
        score,
        total,
        mode: sessionMode,
        answers: sessionAnswers,
      }),
    });
    if (userId) {
      const res = await fetch(
        `/api/sessions?documentId=${id}&userId=${userId}`,
      );
      const data = await res.json();
      setSessions(data.sessions || []);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-500" size={24} />
      </div>
    );
  }

  const lastScore =
    answers.length > 0
      ? Math.round(
          (answers.filter((a) => a.correct).length / answers.length) * 100,
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => {
                if (mode !== "select") setMode("select");
                else router.push("/dashboard");
              }}
              className="text-xs text-gray-500 hover:text-white transition mb-1"
            >
              ← {mode !== "select" ? "Back to study modes" : "Dashboard"}
            </button>
            <h1 className="text-xl font-bold text-white">{documentTitle}</h1>
          </div>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-2 transition"
          >
            <RefreshCw
              size={14}
              className={regenerating ? "animate-spin" : ""}
            />
            Regenerate
          </button>
        </div>

        {mode === "select" && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => startMode("flashcard")}
                disabled={flashcards.length === 0}
                className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-blue-500/50 rounded-xl p-6 text-left transition disabled:opacity-40"
              >
                <Layers className="text-blue-400 mb-3" size={24} />
                <h3 className="font-semibold text-white">Flashcards</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {flashcards.length} cards — flip and test yourself
                </p>
              </button>
              <button
                onClick={() => startMode("mcq")}
                disabled={mcqs.length === 0}
                className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-purple-500/50 rounded-xl p-6 text-left transition disabled:opacity-40"
              >
                <HelpCircle className="text-purple-400 mb-3" size={24} />
                <h3 className="font-semibold text-white">MCQ Quiz</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {mcqs.length} questions — multiple choice
                </p>
              </button>
            </div>

            <ScoreChart sessions={sessions} />
          </div>
        )}

        {mode === "flashcard" && (
          <FlashCard
            question={flashcards[currentIndex].question}
            answer={flashcards[currentIndex].answer}
            difficulty={flashcards[currentIndex].difficulty}
            index={currentIndex}
            total={flashcards.length}
            onKnew={() => handleFlashcardAnswer(true)}
            onDidntKnow={() => handleFlashcardAnswer(false)}
          />
        )}

        {mode === "mcq" && (
          <MCQCard
            key={currentIndex}
            question={mcqs[currentIndex].question}
            options={mcqs[currentIndex].options}
            correctAnswer={mcqs[currentIndex].correctAnswer}
            explanation={mcqs[currentIndex].explanation}
            index={currentIndex}
            total={mcqs.length}
            onAnswer={handleMCQAnswer}
          />
        )}

        {mode === "done" && (
          <div className="text-center py-16 space-y-4">
            <div className="text-6xl font-bold text-blue-400">{lastScore}%</div>
            <p className="text-white font-semibold text-lg">
              Session Complete!
            </p>
            <p className="text-gray-500 text-sm">
              {answers.filter((a) => a.correct).length} / {answers.length}{" "}
              correct
            </p>
            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={() => setMode("select")}
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6 py-3 font-medium transition text-sm"
              >
                Study Again
              </button>
            </div>
            <ScoreChart sessions={sessions} />
          </div>
        )}
      </div>
    </div>
  );
}
