import JSZip from "jszip";
import type { AIMode } from "./prompts";

export type ChatMsg = { role: "user" | "assistant"; content: string; images?: string[]; files?: string[]; error?: boolean };

const cache = new Map<string, string>();

/** Streams an AI response. Calls onDelta with the full text so far. Throws Error with a friendly message. */
export async function runAI(mode: AIMode, messages: ChatMsg[], onDelta: (text: string) => void, signal?: AbortSignal, useCache = false) {
  const payload = messages.filter((m) => !m.error).map(({ role, content, images }) => ({ role, content, images }));
  const key = useCache ? JSON.stringify([mode, payload]) : "";
  if (key && cache.has(key)) { const t = cache.get(key)!; onDelta(t); return t; }

  const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode, messages: payload }), signal });
  if (!res.ok || !res.body) {
    const j = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(j?.error ?? `Request failed (${res.status}).`);
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    text += dec.decode(value, { stream: true });
    const errAt = text.indexOf("\u0000ERROR:");
    if (errAt >= 0) {
      const msg = text.slice(errAt + 7).replace(/^\d+:/, "");
      onDelta(text.slice(0, errAt).trimEnd());
      throw new Error(msg || "AI request failed.");
    }
    onDelta(text);
  }
  if (!text.trim()) throw new Error("The AI returned an empty response. Please retry.");
  if (key) cache.set(key, text);
  return text;
}

const TEXT_EXT = /\.(ts|tsx|js|jsx|mjs|cjs|py|go|rs|java|kt|rb|php|cs|cpp|c|h|swift|sql|json|ya?ml|toml|md|txt|csv|html|css|scss|sh|env\.example|xml|gradle|dockerfile)$/i;
const MAX_FILE = 60_000;

/** Reads uploaded files into prompt text + image data URLs. ZIPs are expanded (text files only). */
export async function readFiles(files: File[]): Promise<{ text: string; images: string[]; names: string[] }> {
  let text = "";
  const images: string[] = [];
  const names: string[] = [];
  for (const f of files) {
    names.push(f.name);
    if (f.type.startsWith("image/")) {
      if (f.size > 4_000_000) throw new Error(`${f.name} is larger than 4 MB.`);
      images.push(await new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = rej; r.readAsDataURL(f); }));
    } else if (/\.zip$/i.test(f.name)) {
      const zip = await JSZip.loadAsync(f);
      const entries = Object.values(zip.files).filter((e) => !e.dir && TEXT_EXT.test(e.name) && !/node_modules|\.git\//.test(e.name));
      text += `\n\n### ZIP ${f.name} (${entries.length} source files)\n`;
      let budget = MAX_FILE;
      for (const e of entries) {
        if (budget <= 0) { text += "\n…(truncated)\n"; break; }
        const c = (await e.async("string")).slice(0, budget);
        budget -= c.length;
        text += `\n#### ${e.name}\n\`\`\`\n${c}\n\`\`\`\n`;
      }
    } else {
      const c = (await f.text()).slice(0, MAX_FILE);
      text += `\n\n### File: ${f.name}\n\`\`\`\n${c}\n\`\`\`\n`;
    }
  }
  return { text, images, names };
}
