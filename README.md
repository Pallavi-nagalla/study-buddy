Study Buddy

An AI-powered study assistant that transforms your PDF notes into interactive flashcards and MCQ quizzes — all running locally with Ollama. Track your scores over sessions and monitor your progress with visual charts.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-38bdf8?style=flat-square&logo=tailwindcss)
![Ollama](https://img.shields.io/badge/Ollama-llama3.2-orange?style=flat-square)
![Prisma](https://img.shields.io/badge/Prisma-v5-2D3748?style=flat-square&logo=prisma)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)

## ✨ Features

- Upload any PDF and extract its content automatically
- AI generates 8 flashcards and 5 MCQs from your notes using local LLM
- Interactive flashcard mode with flip animation and difficulty tags
- MCQ quiz mode with instant feedback, correct answer reveal, and explanation
- Session tracking — every study attempt is saved with score and mode
- Score progress chart (Recharts) per document over all sessions
- Regenerate questions anytime with a single click
- 100% local AI — no cloud API, no cost, full privacy via Ollama

## 🛠️ Tech Stack

| Layer       | Technology                                        |
| ----------- | ------------------------------------------------- |
| Frontend    | Next.js 14, React 18, TypeScript, Tailwind CSS v3 |
| Animation   | Framer Motion                                     |
| Charts      | Recharts                                          |
| Icons       | Lucide React                                      |
| AI          | Ollama (llama3.2) — fully local                   |
| PDF Parsing | pdf-parse                                         |
| Database    | PostgreSQL via Supabase                           |
| ORM         | Prisma v5                                         |
| Auth        | Supabase Auth                                     |

## 🗂️ Project Structure

```
study-buddy/
├── app/
│   ├── (auth)/login/         # Login page
│   ├── (auth)/signup/        # Signup page
│   ├── dashboard/            # Document list + upload
│   ├── document/[id]/        # Study page (flashcards + MCQs)
│   ├── api/upload/           # PDF upload + text extraction
│   ├── api/generate/         # Ollama flashcard/MCQ generation
│   ├── api/sessions/         # Session save + fetch
│   └── api/documents/        # Document CRUD
├── components/
│   ├── FlashCard.tsx         # Flip card with difficulty badge
│   ├── MCQCard.tsx           # MCQ with feedback + explanation
│   ├── ScoreChart.tsx        # Recharts line chart
│   ├── UploadCard.tsx        # PDF upload UI
│   ├── DocumentCard.tsx      # Document list item
│   └── Navbar.tsx            # Top nav with logout
├── lib/
│   ├── ollama.ts             # Ollama API + JSON repair
│   ├── prisma.ts             # Prisma client singleton
│   └── supabase.ts           # Supabase browser client
└── prisma/schema.prisma      # DB schema
```

## ⚙️ Setup

### Prerequisites

- Node.js 18+
- [Ollama](https://ollama.com) installed
- Supabase account

### 1. Clone the repo

```bash
git clone https://github.com/Prabodh-dev/study-buddy.git
cd study-buddy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Pull the AI model

```bash
ollama pull llama3.2
```

### 4. Configure environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OLLAMA_BASE_URL=http://localhost:11434
```

Create `.env` (for Prisma CLI):

```env
DATABASE_URL=your_supabase_transaction_pooler_url
DIRECT_URL=your_supabase_direct_url
```

### 5. Push database schema

```bash
npx prisma generate
npx prisma db push
```

### 6. Start Ollama

```powershell
# Windows
$env:OLLAMA_ORIGINS="*"; ollama serve
```

```bash
# Mac/Linux
OLLAMA_ORIGINS="*" ollama serve
```

### 7. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔄 How It Works

```
Upload PDF → Extract Text (pdf-parse)
         → Send to Ollama (llama3.2)
         → Generate Flashcards + MCQs (JSON)
         → Save to PostgreSQL (Prisma + Supabase)
         → Study → Save Session Score
         → View Progress Chart
```

## 📊 Database Schema

- `Document` — stores uploaded PDF title and extracted text
- `Flashcard` — question, answer, difficulty per document
- `MCQ` — question, 4 options, correct answer index, explanation
- `Session` — score, total, mode (flashcard/mcq), timestamp
- `SessionAnswer` — per-question correct/wrong record per session

## 🚀 Usage

1. Sign up and log in
2. Upload a PDF study material
3. Wait for AI to generate questions (~15-30 seconds)
4. Choose Flashcard or MCQ mode
5. Study and submit — score is saved automatically
6. Track improvement via the score chart on the document page
7. Click Regenerate anytime for fresh questions
