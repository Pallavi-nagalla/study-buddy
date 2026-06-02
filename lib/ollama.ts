import { jsonrepair } from "jsonrepair";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";

async function ollamaGenerate(prompt: string): Promise<string> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      prompt,
      stream: false,
    }),
  });

  const text = await response.text();
  const lines = text.trim().split("\n");
  let fullResponse = "";

  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.response !== undefined) {
        fullResponse += parsed.response;
      }
    } catch {}
  }

  return fullResponse;
}

function extractAndRepairJSON(raw: string): unknown[] {
  const match = raw.match(/\[[\s\S]*\]/);
  const jsonStr = match ? match[0] : raw;
  const repaired = jsonrepair(jsonStr);
  return JSON.parse(repaired);
}

export async function generateFlashcards(
  text: string,
): Promise<Array<{ question: string; answer: string; difficulty: string }>> {
  const prompt = `Generate 8 flashcards from this text as a JSON array.
Each item has: question, answer, difficulty ("easy","medium","hard").
Return ONLY the JSON array, nothing else.
Text: ${text.slice(0, 2500)}
JSON:`;

  const raw = await ollamaGenerate(prompt);
  return extractAndRepairJSON(raw) as Array<{
    question: string;
    answer: string;
    difficulty: string;
  }>;
}

export async function generateMCQs(text: string): Promise<
  Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>
> {
  const prompt = `Generate 5 multiple choice questions from this text as a JSON array.
Each item has: question, options (array of 4 strings), correctAnswer (0-3), explanation.
Return ONLY the JSON array, nothing else.
Text: ${text.slice(0, 2500)}
JSON:`;

  const raw = await ollamaGenerate(prompt);
  return extractAndRepairJSON(raw) as Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
}
