import { useState, type FormEvent } from "react";
import { Sparkles, X, ArrowUp } from "lucide-react";
import { aiRecs } from "@/lib/devpulse-data";

type Msg = { r: "u" | "a"; t: string };

function reply(q: string) {
  const s = q.toLowerCase();
  if (s.includes("bug")) return "2 critical bugs are open. BUG-221 (settlement race) correlates with commit a91f2e — I recommend rolling back batching.";
  if (s.includes("sprint") || s.includes("velocity")) return "Sprint 24 is at 57/58 points. Velocity has been ≥95% for 4 sprints; you can safely pull 6 points.";
  if (s.includes("risk")) return "Highest risk: Orion Mobile, forecast to slip 2.3 days due to offline-sync complexity.";
  return aiRecs[Math.floor(Math.random() * aiRecs.length)];
}

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ r: "a", t: "Hi — I'm Pulse. Ask me about sprints, risk, bugs or code health." }]);
  const [v, setV] = useState("");
  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!v.trim()) return;
    const q = v; setV("");
    setMsgs((m) => [...m, { r: "u", t: q }]);
    setTimeout(() => setMsgs((m) => [...m, { r: "a", t: reply(q) }]), 500);
  };
  return (
    <>
      {open && (
        <div className="glass fade-up fixed bottom-24 right-6 z-50 flex h-[480px] w-[min(380px,calc(100vw-3rem))] flex-col rounded-[20px]">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div className="flex items-center gap-2 text-sm font-medium"><Sparkles className="h-4 w-4" /> Pulse AI</div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-5 text-sm">
            {msgs.map((m, i) => (
              <div key={i} className={m.r === "u" ? "ml-auto max-w-[85%] rounded-2xl bg-foreground px-4 py-2.5 text-background" : "max-w-[85%] rounded-2xl border border-line bg-secondary/50 px-4 py-2.5"}>{m.t}</div>
            ))}
          </div>
          <form onSubmit={send} className="flex gap-2 border-t border-line p-3">
            <input value={v} onChange={(e) => setV(e.target.value)} placeholder="Ask anything…" className="h-10 flex-1 rounded-xl bg-surface-2 px-3 text-sm outline-none" />
            <button className="grid h-10 w-10 place-items-center rounded-xl bg-foreground text-background"><ArrowUp className="h-4 w-4" /></button>
          </form>
        </div>
      )}
      <button onClick={() => setOpen((o) => !o)} aria-label="Open AI assistant"
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-foreground text-background shadow-2xl transition hover:scale-105">
        <Sparkles className="h-5 w-5" />
      </button>
    </>
  );
}
