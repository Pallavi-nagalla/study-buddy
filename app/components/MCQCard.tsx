"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface Props {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  index: number;
  total: number;
  onAnswer: (correct: boolean) => void;
}

export default function MCQCard({
  question,
  options,
  correctAnswer,
  explanation,
  index,
  total,
  onAnswer,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
  };

  const handleNext = () => {
    if (selected === null) return;
    onAnswer(selected === correctAnswer);
  };

  const isCorrect = selected === correctAnswer;

  const getOptionStyle = (i: number) => {
    if (selected === null)
      return "border-gray-700 hover:border-blue-500/50 cursor-pointer";
    if (i === correctAnswer) return "border-green-500 bg-green-500/10";
    if (i === selected && i !== correctAnswer)
      return "border-red-500 bg-red-500/10";
    return "border-gray-700 opacity-40";
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Question {index + 1} of {total}
        </span>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
        <p className="text-white font-medium mb-6">{question}</p>
        <div className="space-y-3">
          {options.map((option, i) => (
            <div
              key={i}
              onClick={() => handleSelect(i)}
              className={`border rounded-xl px-4 py-3 flex items-center justify-between transition ${getOptionStyle(i)}`}
            >
              <span className="text-sm text-gray-200">{option}</span>
              {selected !== null && i === correctAnswer && (
                <CheckCircle2
                  size={18}
                  className="text-green-400 shrink-0 ml-2"
                />
              )}
              {selected !== null && i === selected && i !== correctAnswer && (
                <XCircle size={18} className="text-red-400 shrink-0 ml-2" />
              )}
            </div>
          ))}
        </div>

        {selected !== null && (
          <div
            className={`mt-5 rounded-xl p-4 border ${isCorrect ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}
          >
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <CheckCircle2 size={16} className="text-green-400" />
              ) : (
                <XCircle size={16} className="text-red-400" />
              )}
              <p
                className={`text-sm font-semibold ${isCorrect ? "text-green-400" : "text-red-400"}`}
              >
                {isCorrect
                  ? "Correct!"
                  : `Wrong! Correct answer: ${options[correctAnswer]}`}
              </p>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              {explanation}
            </p>
          </div>
        )}
      </div>

      {selected !== null && (
        <button
          onClick={handleNext}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3 font-medium transition text-sm"
        >
          Next Question →
        </button>
      )}
    </div>
  );
}
