export interface RagResponse {
  domain: string;
  task: string;
  answer: string;
  sections: {
    summary: string | null;
    evidence: string | null;
    recommendation: string | null;
    warning: string | null;
  };
  evidence: {
    document: string;
    chunk_id: string;
    tags: string[];
    insight_ko: string;
    score: number;
  }[];
  cross_domain_used: boolean;
}

export const fetchYIEInsight = async (
  question: string,
  context: { totalCaffeine: number; avgCaffeine: number },
): Promise<RagResponse | null> => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch('http://localhost:8000/rag/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: 'coffee',
        task: 'insight',
        question,
        context,
      }),
      signal: controller.signal,
    });

    if (!response.ok) return null;
    return await response.json() as RagResponse;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
};
