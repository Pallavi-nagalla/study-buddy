import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { documentId, userId, score, total, mode, answers } =
      await req.json();

    const session = await prisma.session.create({
      data: {
        documentId,
        userId,
        score,
        total,
        mode,
        answers: {
          create: answers.map(
            (a: { questionId: string; correct: boolean }) => ({
              questionId: a.questionId,
              correct: a.correct,
            }),
          ),
        },
      },
    });

    return NextResponse.json({ session });
  } catch {
    return NextResponse.json(
      { error: "Failed to save session" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get("documentId");
    const userId = searchParams.get("userId");

    if (!documentId || !userId) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const sessions = await prisma.session.findMany({
      where: { documentId, userId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ sessions });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 },
    );
  }
}
