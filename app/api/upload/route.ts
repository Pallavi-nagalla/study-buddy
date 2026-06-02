import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import pdf from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;
    const title = formData.get("title") as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: "Missing file or userId" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await pdf(buffer);

    // Strip null bytes and non-UTF8 characters
    const content = parsed.text
      .replace(/\x00/g, "")
      .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      .trim();

    if (!content) {
      return NextResponse.json(
        { error: "Could not extract text from PDF" },
        { status: 400 },
      );
    }

    const document = await prisma.document.create({
      data: {
        userId,
        title: title || file.name.replace(".pdf", ""),
        content,
      },
    });

    return NextResponse.json({ document });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
