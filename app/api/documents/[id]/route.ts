import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    const flashcards = await prisma.flashcard.findMany({
      where: { documentId: id },
    });

    const mcqs = await prisma.mCQ.findMany({
      where: { documentId: id },
    });

    return NextResponse.json({ document, flashcards, mcqs });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 },
    );
  }
}
