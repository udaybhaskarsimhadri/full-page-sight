// Server-only AI service layer. Swap provider/model here without touching the app.
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";

const RUN_ID = "X-Lovable-AIG-Run-ID";

export const AI_CONFIG = {
  baseURL: "https://ai.gateway.lovable.dev/v1",
  model: "openai/gpt-6-astra",
};

function runIdFetch(initial?: string | null) {
  let runId = initial?.trim() || undefined;
  return {
    getRunId: () => runId,
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(RUN_ID)) headers.set(RUN_ID, runId);
      const res = await fetch(input, { ...init, headers });
      runId ??= res.headers.get(RUN_ID)?.trim() || undefined;
      return res;
    },
  };
}

export class AIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function streamAI(request: Request, instructions: string, messages: ModelMessage[]) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new AIError(500, "AI is not configured on the server.");
  const rf = runIdFetch(request.headers.get(RUN_ID));
  const provider = createOpenAI({
    baseURL: AI_CONFIG.baseURL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: rf.fetch,
  });
  const result = streamText({
    model: provider.responses(AI_CONFIG.model),
    instructions,
    messages,
    abortSignal: request.signal,
    maxRetries: 0,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  // Plain text stream; errors are surfaced as a trailing marker the client parses.
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const part of result.fullStream) {
          if (part.type === "text-delta") controller.enqueue(encoder.encode(part.text));
          if (part.type === "error") throw part.error;
        }
      } catch (err) {
        if (!request.signal.aborted) {
          const e = err as { statusCode?: number; message?: string };
          const msg = friendly(e.statusCode, e.message);
          controller.enqueue(encoder.encode(`\n\u0000ERROR:${e.statusCode ?? 500}:${msg}`));
          console.error("AI stream error", e.statusCode, e.message);
        }
      } finally {
        controller.close();
      }
    },
  });
  const headers = new Headers({ "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache, no-transform" });
  const id = rf.getRunId();
  if (id) headers.set(RUN_ID, id);
  return new Response(body, { headers });
}

export function friendly(status?: number, fallback?: string) {
  if (status === 429) return "Too many requests right now. Please wait a moment and try again.";
  if (status === 402) return "AI credits are exhausted for this workspace. Add credits to continue.";
  if (status === 403) return fallback || "This AI request was not permitted.";
  if (status === 400) return "The request couldn't be processed. Try shortening your input.";
  return "The AI service is temporarily unavailable. Please retry.";
}
