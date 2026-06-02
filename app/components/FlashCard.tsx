"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  question: string;
  answer: string;
  difficulty: string;
  index: number;
  total: number;
  onKnew: () => void;
  onDidntKnow: () => void;
}

const difficultyColor: Record<string, string> = {
  easy: "text-green-400 bg-green-400/10",
  medium: "text-yellow-400 bg-yellow-400/10",
  hard: "text-red-400 bg-red-400/10",
};

export default function FlashCard({
  question,
  answer,
  difficulty,
  index,
  total,
  onKnew,
  onDidntKnow,
}: Props) {
  const [flipped, setFlipped] = useState(false);

  const handleKnew = () => {
    setFlipped(false);
    setTimeout(() => onKnew(), 300);
  };

  const handleDidntKnow = () => {
    setFlipped(false);
    setTimeout(() => onDidntKnow(), 300);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between w-full">
        <span className="text-sm text-gray-500">
          Card {index + 1} of {total}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            difficultyColor[difficulty] || difficultyColor.medium
          }`}
        >
          {difficulty}
        </span>
      </div>

      <div
        className="w-full cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => !flipped && setFlipped(true)}
      >
        <motion.div
          key={index}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-full"
        >
          <div
            style={{ backfaceVisibility: "hidden" }}
            className="bg-gray-900 border border-gray-700 rounded-2xl p-8 min-h-[200px] flex flex-col items-center justify-center text-center"
          >
            <p className="text-xs text-gray-500 mb-3 uppercase tracking-widest">
              Question
            </p>
            <p className="text-lg text-white font-medium">{question}</p>
            <p className="text-xs text-gray-600 mt-4">Click to reveal</p>
          </div>

          <div
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
            }}
            className="bg-blue-900/30 border border-blue-500/30 rounded-2xl p-8 min-h-[200px] flex flex-col items-center justify-center text-center"
          >
            <p className="text-xs text-blue-400 mb-3 uppercase tracking-widest">
              Answer
            </p>
            <p className="text-lg text-white font-medium">{answer}</p>
          </div>
        </motion.div>
      </div>

      {flipped && (
        <div className="flex gap-4 w-full">
          <button
            onClick={handleDidntKnow}
            className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl py-3 font-medium transition text-sm"
          >
            Didn't Know
          </button>
          <button
            onClick={handleKnew}
            className="flex-1 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 rounded-xl py-3 font-medium transition text-sm"
          >
            Knew It
          </button>
        </div>
      )}
    </div>
  );
}
