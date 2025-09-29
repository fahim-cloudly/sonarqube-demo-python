// frontend/src/lib/api.ts
export interface SourceItem {
  title: string;
  url: string;
  type: "journal" | "trial" | "guideline";
}

export async function askQuestion(question: string) {
  const res = await fetch("http://localhost:8000/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) throw new Error("Failed to fetch answer");

  const data: { answer: string; sources: SourceItem[] } = await res.json();
  return data;
}
