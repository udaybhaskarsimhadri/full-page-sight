import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowUp, Sparkles } from "lucide-react";
import { PageHeader, Panel } from "@/components/devpulse/ui";
import { aiRecs } from "@/lib/devpulse-data";
import { assistantReply } from "@/components/devpulse/assistant";

export const Route = createFileRoute("/app/ai")({ component: Page });

const prompts = ["What's our biggest delivery risk?", "Summarize open critical bugs", "How is sprint velocity trending?", "Generate release notes for Sprint 24"];
type Msg = { r: "u" | "a"; t: string };

function Page() {
  const [msgs, setMsgs] = useState<Msg[]>([{ r: "a", t: "Hello — I'm Pulse, your engineering copilot. Ask about projects, risk, bugs or code health." }]);
  const [v, setV] = useState("");
  const ask = (q: string) => {
    if (!q.trim()) return;
    setMsgs((m) => [...m, { r: "u", t: q }]);
    setTimeout(() => setMsgs((m) => [...m, { r: "a", t: assistantReply(q) }]), 500);
  };
  const submit = (e: FormEvent) => { e.preventDefault(); ask(v); setV(""); };
  return (
    <>
      <PageHeader title="AI Assistant" sub="Ask anything about your engineering organization." />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card-lux flex h-[560px] flex-col lg:col-span-2">
          <div className="flex-1 space-y-3 overflow-y-auto p-6 text-sm">
            {msgs.map((m, i) => (
              <div key={i} className={m.r === "u" ? "ml-auto max-w-[80%] rounded-2xl bg-foreground px-4 py-2.5 text-background" : "max-w-[80%] rounded-2xl border border-line bg-secondary/50 px-4 py-2.5"}>{m.t}</div>
            ))}
          </div>
          <form onSubmit={submit} className="flex gap-2 border-t border-line p-4">
            <input value={v} onChange={(e) => setV(e.target.value)} placeholder="Ask Pulse…" className="h-11 flex-1 rounded-xl bg-surface-2 px-4 text-sm outline-none" />
            <button aria-label="Send" className="grid h-11 w-11 place-items-center rounded-xl bg-foreground text-background"><ArrowUp className="h-4 w-4" /></button>
          </form>
        </div>
        <div className="space-y-4">
          <Panel title="Suggested prompts">
            <div className="space-y-2">{prompts.map((p) => (
              <button key={p} onClick={() => ask(p)} className="w-full rounded-xl border border-line px-4 py-2.5 text-left text-sm transition hover:border-foreground/20 hover:bg-secondary/40">{p}</button>))}</div>
          </Panel>
          <Panel title="Live insights">
            <ul className="space-y-3 text-sm">{aiRecs.slice(0, 3).map((r) => <li key={r} className="flex gap-3"><Sparkles className="mt-0.5 h-4 w-4 shrink-0" />{r}</li>)}</ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
