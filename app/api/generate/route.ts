import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateFlashcards, generateMCQs } from "@/lib/ollama";

export async function POST(req: NextRequest) {
  try {
    const { documentId } = await req.json();

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    const [flashcardsData, mcqsData] = await Promise.all([
      generateFlashcards(document.content),
      generateMCQs(document.content),
    ]);

    await prisma.flashcard.deleteMany({ where: { documentId } });
    await prisma.mCQ.deleteMany({ where: { documentId } });

    await prisma.flashcard.createMany({
      data: flashcardsData.map((f) => ({
        documentId,
        question: f.question,
        answer: f.answer,
        difficulty: f.difficulty,
      })),
    });

    await prisma.mCQ.createMany({
      data: mcqsData.map((m) => ({
        documentId,
        question: m.question,
        options: m.options,
        correctAnswer: m.correctAnswer,
        explanation: m.explanation,
      })),
    });

    const flashcards = await prisma.flashcard.findMany({
      where: { documentId },
    });
    const mcqs = await prisma.mCQ.findMany({ where: { documentId } });

    return NextResponse.json({ flashcards, mcqs });
  } catch {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
