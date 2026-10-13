import { createFileRoute } from "@tanstack/react-router";
import type { ModelMessage } from "ai";
import { AI_TOOLS, isMode } from "@/lib/ai/prompts";
import { AIError, streamAI } from "@/lib/ai/gateway.server";
import * as data from "@/lib/devpulse-data";

type InMsg = { role: "user" | "assistant"; content: string; images?: string[] };
const MAX_CHARS = 120_000;

function context() {
  const { projects, tasks, bugs, tests, stack, velocity, languages } = data;
  return JSON.stringify({ projects, tasks, bugs, tests, stack, velocity, languages });
}

function bad(status: number, error: string) {
  return Response.json({ error }, { status });
}

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { mode?: unknown; messages?: unknown };
        try { body = await request.json(); } catch { return bad(400, "Invalid JSON body."); }
        if (!isMode(body.mode)) return bad(400, "Unknown AI tool.");
        if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > 60) return bad(400, "Invalid conversation.");
        const msgs = body.messages as InMsg[];
        let total = 0;
        for (const m of msgs) {
          if ((m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") return bad(400, "Invalid message.");
          total += m.content.length;
          if (m.images && (!Array.isArray(m.images) || m.images.length > 4 || m.images.some((i) => typeof i !== "string" || !i.startsWith("data:image/")))) return bad(400, "Invalid image.");
        }
        if (total > MAX_CHARS) return bad(413, "Input is too large. Remove some files or text.");
        if (!msgs.at(-1)?.content.trim() && !msgs.at(-1)?.images?.length) return bad(400, "Message is empty.");

        const messages: ModelMessage[] = msgs.map((m) =>
          m.role === "user" && m.images?.length
            ? { role: "user", content: [{ type: "text", text: m.content }, ...m.images.map((img) => ({ type: "image" as const, image: img }))] }
            : { role: m.role, content: m.content },
        );
        const instructions = `${AI_TOOLS[body.mode].prompt}

Format answers in GitHub-flavored Markdown; use fenced code blocks with language tags.
Today: ${new Date().toISOString().slice(0, 10)}.
Current DevPulse workspace context (JSON):
${context()}`;
        try {
          return streamAI(request, instructions, messages);
        } catch (e) {
          if (e instanceof AIError) return bad(e.status, e.message);
          return bad(500, "AI request failed.");
        }
      },
    },
  },
});
