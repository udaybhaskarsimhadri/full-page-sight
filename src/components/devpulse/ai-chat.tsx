import { createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowUp, Paperclip, RotateCcw, Square, Trash2, X, FileText } from "lucide-react";
import { toast } from "sonner";
import { runAI, readFiles, type ChatMsg } from "@/lib/ai/client";
import { Markdown } from "./markdown";
import { cn } from "@/lib/utils";

type ChatState = {
  msgs: ChatMsg[];
  busy: boolean;
  send: (text: string, files?: File[]) => Promise<void>;
  retry: () => void;
  stop: () => void;
  clear: () => void;
};

const Ctx = createContext<ChatState | null>(null);
const WELCOME: ChatMsg = { role: "assistant", content: "Hi — I'm **Pulse**, your DevPulse copilot. I can see your projects, sprints, bugs and tests. Ask me anything, or attach code, ZIPs, documents or screenshots." };

export function AIChatProvider({ children }: { children: ReactNode }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([WELCOME]);
  const [busy, setBusy] = useState(false);
  const ctrl = useRef<AbortController | null>(null);
  const busyRef = useRef(false);

  const generate = useCallback(async (history: ChatMsg[]) => {
    if (busyRef.current) return;
    busyRef.current = true; setBusy(true);
    const ac = new AbortController(); ctrl.current = ac;
    setMsgs([...history, { role: "assistant", content: "" }]);
    const update = (content: string, error = false) =>
      setMsgs((m) => [...m.slice(0, -1), { role: "assistant", content, error }]);
    try {
      await runAI("chat", history.filter((m) => m !== WELCOME), (t) => update(t), ac.signal);
    } catch (e) {
      if (ac.signal.aborted) {
        setMsgs((m) => { const last = m.at(-1); return last && !last.content ? m.slice(0, -1) : m; });
      } else {
        const msg = e instanceof Error ? e.message : "AI request failed.";
        update(msg, true);
        toast.error(msg);
      }
    } finally {
      busyRef.current = false; setBusy(false); ctrl.current = null;
    }
  }, []);

  const send = useCallback(async (text: string, files: File[] = []) => {
    if (busyRef.current) return;
    let content = text.trim();
    let images: string[] = [];
    let names: string[] = [];
    if (files.length) {
      try { const r = await readFiles(files); content += r.text; images = r.images; names = r.names; }
      catch (e) { toast.error(e instanceof Error ? e.message : "Couldn't read file."); return; }
    }
    if (!content && !images.length) return;
    if (!content) content = "Analyze the attached image(s).";
    setMsgs((cur) => { void generate([...cur.filter((m) => !m.error), { role: "user", content, images, files: names }]); return cur; });
  }, [generate]);

  const retry = useCallback(() => {
    setMsgs((cur) => {
      const trimmed = cur.at(-1)?.role === "assistant" && cur.length > 1 ? cur.slice(0, -1) : cur;
      if (trimmed.at(-1)?.role === "user") void generate(trimmed);
      return cur;
    });
  }, [generate]);

  const stop = useCallback(() => ctrl.current?.abort(), []);
  const clear = useCallback(() => { ctrl.current?.abort(); setMsgs([WELCOME]); toast("New conversation started"); }, []);

  return <Ctx.Provider value={{ msgs, busy, send, retry, stop, clear }}>{children}</Ctx.Provider>;
}

export function useAIChat() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAIChat must be used inside AIChatProvider");
  return c;
}

export function ChatPanel({ compact }: { compact?: boolean }) {
  const { msgs, busy, send, retry, stop, clear } = useAIChat();
  const [v, setV] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const scroller = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" }); }, [msgs]);
  useEffect(() => { if (!busy) input.current?.focus(); }, [busy]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (busy || (!v.trim() && !files.length)) return;
    void send(v, files); setV(""); setFiles([]);
  };
  const last = msgs.at(-1);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-end gap-1 border-b border-line px-3 py-2">
        <button onClick={clear} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-label text-muted-foreground hover:bg-secondary/60 hover:text-foreground"><Trash2 className="h-3.5 w-3.5" /> New chat</button>
      </div>
      <div ref={scroller} className={cn("flex-1 space-y-3 overflow-y-auto text-sm", compact ? "p-4" : "p-6")}>
        {msgs.map((m, i) => (
          <div key={i} className={m.role === "user" ? "ml-auto max-w-[85%] rounded-2xl bg-foreground px-4 py-2.5 text-background" : cn("max-w-[92%]", m.error && "rounded-2xl border border-line bg-secondary/50 px-4 py-2.5")}>
            {m.role === "user" ? (
              <>
                {m.files?.length ? <div className="mb-1.5 flex flex-wrap gap-1">{m.files.map((f) => <span key={f} className="flex items-center gap-1 rounded-md bg-background/15 px-1.5 py-0.5 text-[11px]"><FileText className="h-3 w-3" />{f}</span>)}</div> : null}
                <div className="whitespace-pre-wrap">{m.content.split("\n\n### ")[0]}</div>
              </>
            ) : m.content ? (
              <>
                <Markdown>{m.content}</Markdown>
                {m.error && <button onClick={retry} className="mt-2 flex items-center gap-1.5 text-label underline"><RotateCcw className="h-3.5 w-3.5" /> Retry</button>}
              </>
            ) : (
              <div className="flex items-center gap-1.5 py-2" aria-label="Pulse is typing">
                {[0, 1, 2].map((d) => <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${d * 0.15}s` }} />)}
              </div>
            )}
          </div>
        ))}
        {busy && last?.content ? <div className="h-0.5 w-24 overflow-hidden rounded-full bg-secondary"><div className="h-full w-1/2 animate-pulse bg-foreground" /></div> : null}
      </div>
      {files.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-line px-3 pt-2">
          {files.map((f, i) => (
            <span key={i} className="flex items-center gap-1 rounded-lg border border-line bg-secondary/50 px-2 py-1 text-[12px]">
              {f.name}<button aria-label={`Remove ${f.name}`} onClick={() => setFiles((fs) => fs.filter((_, j) => j !== i))}><X className="h-3 w-3" /></button>
            </span>
          ))}
        </div>
      )}
      <form onSubmit={submit} className="flex items-end gap-2 border-t border-line p-3">
        <input ref={fileRef} type="file" multiple hidden onChange={(e) => { setFiles((f) => [...f, ...Array.from(e.target.files ?? [])].slice(0, 6)); e.target.value = ""; }} />
        <button type="button" aria-label="Attach files" onClick={() => fileRef.current?.click()} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line text-muted-foreground hover:text-foreground"><Paperclip className="h-4 w-4" /></button>
        <textarea ref={input} value={v} rows={1} onChange={(e) => setV(e.target.value)} maxLength={20000}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
          placeholder="Ask Pulse…" className="max-h-40 min-h-10 flex-1 resize-none rounded-xl bg-surface-2 px-3 py-2.5 text-sm outline-none" />
        {busy ? (
          <button type="button" onClick={stop} aria-label="Stop" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-foreground text-background"><Square className="h-3.5 w-3.5" /></button>
        ) : (
          <button aria-label="Send" disabled={!v.trim() && !files.length} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-foreground text-background disabled:opacity-40"><ArrowUp className="h-4 w-4" /></button>
        )}
      </form>
    </div>
  );
}
