import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/devpulse/ui";
import { ChatPanel } from "@/components/devpulse/ai-chat";
import { AITool } from "@/components/devpulse/ai-tool";
import { AI_TOOLS, isMode, type AIMode } from "@/lib/ai/prompts";
import { cn } from "@/lib/utils";

type Search = { tool?: AIMode | undefined; q?: string | undefined };

export const Route = createFileRoute("/app/ai")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    tool: isMode(s["tool"]) ? s["tool"] : undefined,
    q: typeof s["q"] === "string" ? s["q"].slice(0, 4000) : undefined,
  }),
  component: Page,
});

function Page() {
  const { tool = "chat", q } = Route.useSearch();
  return (
    <>
      <PageHeader title="AI Assistant" sub="Your engineering copilot, grounded in live workspace data." />
      <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
        {(Object.keys(AI_TOOLS) as AIMode[]).map((k) => (
          <Link key={k} to="/app/ai" search={{ tool: k }}
            className={cn("whitespace-nowrap rounded-xl border px-3.5 py-2 text-sm transition",
              k === tool ? "border-foreground bg-foreground text-background" : "border-line text-muted-foreground hover:text-foreground")}>
            {AI_TOOLS[k].label}
          </Link>
        ))}
      </div>
      {tool === "chat" ? (
        <div className="card-lux h-[620px] overflow-hidden p-0"><ChatPanel /></div>
      ) : (
        <AITool key={`${tool}:${q ?? ""}`} mode={tool} initial={q ?? ""} autoRun={!!q} />
      )}
    </>
  );
}
