import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { useLocation } from "@tanstack/react-router";
import { ChatPanel } from "./ai-chat";

export function Assistant() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  if (pathname === "/app/ai") return null;
  return (
    <>
      {open && (
        <div className="glass fade-up fixed bottom-24 right-6 z-50 flex h-[560px] max-h-[calc(100vh-8rem)] w-[min(420px,calc(100vw-3rem))] flex-col overflow-hidden rounded-[20px]">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <div className="flex items-center gap-2 text-sm font-medium"><Sparkles className="h-4 w-4" /> Pulse AI</div>
            <button aria-label="Close assistant" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
          <div className="min-h-0 flex-1"><ChatPanel compact /></div>
        </div>
      )}
      <button onClick={() => setOpen((o) => !o)} aria-label="Open AI assistant"
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-foreground text-background shadow-2xl transition hover:scale-105">
        <Sparkles className="h-5 w-5" />
      </button>
    </>
  );
}
