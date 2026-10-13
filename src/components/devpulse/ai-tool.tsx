import { useEffect, useRef, useState } from "react";
import { Copy, Paperclip, RotateCcw, Sparkles, Square, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AI_TOOLS, type AIMode } from "@/lib/ai/prompts";
import { readFiles, runAI } from "@/lib/ai/client";
import { Markdown } from "./markdown";

/** Generic single-shot AI tool: input + optional files -> streamed Markdown output. */
export function AITool({ mode, initial = "", autoRun = false }: { mode: AIMode; initial?: string; autoRun?: boolean }) {
  const tool = AI_TOOLS[mode];
  const [input, setInput] = useState(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [out, setOut] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const ctrl = useRef<AbortController | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const ran = useRef(false);

  const run = async () => {
    if (busy) return;
    let content = input.trim();
    let images: string[] = [];
    try { if (files.length) { const r = await readFiles(files); content += r.text; images = r.images; } }
    catch (e) { toast.error(e instanceof Error ? e.message : "Couldn't read file."); return; }
    if (!content && !images.length) { toast.error("Add some input first."); return; }
    setBusy(true); setErr(null); setOut("");
    const ac = new AbortController(); ctrl.current = ac;
    try {
      await runAI(mode, [{ role: "user", content: content || "Analyze the attached image(s).", images }], setOut, ac.signal, true);
      toast.success(`${tool.label} complete`);
    } catch (e) {
      if (!ac.signal.aborted) { const m = e instanceof Error ? e.message : "AI request failed."; setErr(m); toast.error(m); }
    } finally { setBusy(false); }
  };

  useEffect(() => {
    if (autoRun && initial && !ran.current) { ran.current = true; void run(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="card-lux p-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={tool.placeholder} rows={5} maxLength={40000}
          className="w-full resize-y rounded-2xl border border-line bg-surface-2 p-4 text-sm outline-none focus:border-foreground/30" />
        {files.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">{files.map((f, i) => (
            <span key={i} className="flex items-center gap-1 rounded-lg border border-line bg-secondary/50 px-2 py-1 text-[12px]">{f.name}
              <button aria-label={`Remove ${f.name}`} onClick={() => setFiles((fs) => fs.filter((_, j) => j !== i))}><X className="h-3 w-3" /></button></span>))}</div>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input ref={fileRef} type="file" multiple hidden onChange={(e) => { setFiles((f) => [...f, ...Array.from(e.target.files ?? [])].slice(0, 6)); e.target.value = ""; }} />
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}><Paperclip /> Attach</Button>
          <div className="ml-auto flex gap-2">
            {busy ? <Button size="sm" variant="outline" onClick={() => ctrl.current?.abort()}><Square /> Stop</Button> : null}
            <Button size="sm" onClick={run} disabled={busy}><Sparkles /> {busy ? "Generating…" : `Run ${tool.label}`}</Button>
          </div>
        </div>
      </div>
      {(out || busy || err) && (
        <div className="card-lux p-6">
          {busy && <div className="mb-4 h-0.5 w-full overflow-hidden rounded-full bg-secondary"><div className="h-full w-1/3 animate-pulse bg-foreground" /></div>}
          {out ? <Markdown>{out}</Markdown> : busy ? <p className="text-sm text-muted-foreground">Analyzing your workspace…</p> : null}
          {err && (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-line bg-secondary/50 px-4 py-2.5 text-sm">
              {err}<Button size="sm" variant="outline" onClick={run}><RotateCcw /> Retry</Button>
            </div>
          )}
          {out && !busy && <Button size="sm" variant="ghost" className="mt-4" onClick={() => { void navigator.clipboard.writeText(out); toast.success("Copied to clipboard"); }}><Copy /> Copy</Button>}
        </div>
      )}
    </div>
  );
}
