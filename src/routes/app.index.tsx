import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { GripVertical, Sparkles } from "lucide-react";
import { Panel, Stat, PageHeader, Progress, Pill } from "@/components/devpulse/ui";
import { VelocityChart, BurndownChart, CommitsChart, LanguagesChart } from "@/components/devpulse/charts";
import { projects, bugs, tests } from "@/lib/devpulse-data";

export const Route = createFileRoute("/app/")({ component: Dashboard });

const widgets: Record<string, { title: string; wide?: boolean; body: ReactNode }> = {
  velocity: { title: "Sprint velocity", body: <VelocityChart /> },
  burndown: { title: "Sprint 24 burndown", body: <BurndownChart /> },
  ai: { title: "AI copilot", body: (
    <div className="space-y-2">{[
      { tool: "health", q: "Explain the health of every active project, ranked by risk.", l: "Explain project health" },
      { tool: "advisor", q: "Give me the top portfolio-wide recommendations for this week.", l: "Get recommendations" },
      { tool: "bug", q: "Analyze the open Critical and High bugs and prioritize fixes.", l: "Triage critical bugs" },
      { tool: "sprint", q: "Plan the next sprint for Orion Mobile based on current backlog and velocity.", l: "Plan next sprint" },
    ].map((a) => (
      <Link key={a.l} to="/app/ai" search={{ tool: a.tool as "health", q: a.q }} className="flex items-center gap-3 rounded-xl border border-line px-4 py-2.5 text-sm transition hover:border-foreground/20 hover:bg-secondary/40">
        <Sparkles className="h-4 w-4 shrink-0" />{a.l}</Link>))}</div>) },
  health: { title: "Project health", body: (
    <div className="space-y-4">{projects.map((p) => (
      <div key={p.name}><div className="mb-1.5 flex justify-between text-sm"><span>{p.name}</span><span className="text-muted-foreground">{p.progress}%</span></div><Progress v={p.progress} /></div>))}</div>) },
  commits: { title: "Code activity", body: <CommitsChart /> },
  langs: { title: "Technology mix", body: <LanguagesChart /> },
  bugs: { title: "Bug dashboard", body: (
    <div className="space-y-3 text-sm">{bugs.slice(0, 4).map((b) => (
      <div key={b.id} className="flex items-center justify-between gap-3"><span className="truncate">{b.t}</span><Pill strong={b.sev === "Critical"}>{b.sev}</Pill></div>))}</div>) },
  tests: { title: "Testing dashboard", body: (
    <div className="space-y-4">{tests.map((t) => (
      <div key={t.suite}><div className="mb-1.5 flex justify-between text-sm"><span>{t.suite}</span><span className="text-muted-foreground">{t.cov}% cov</span></div><Progress v={t.cov} /></div>))}</div>) },
};

function Dashboard() {
  const { session } = Route.useRouteContext();
  const [order, setOrder] = useState(Object.keys(widgets));
  const [drag, setDrag] = useState<string | null>(null);
  const drop = (target: string) => {
    if (!drag || drag === target) return;
    const next = order.filter((k) => k !== drag);
    next.splice(next.indexOf(target), 0, drag);
    setOrder(next);
  };
  return (
    <>
      <PageHeader title={`Welcome back, ${session.name.split(" ")[0]}`} sub="Here's what's happening across your engineering org." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Active projects" value="24" delta="5 shipping this month" />
        <Stat label="Engineers" value="186" delta="across 14 teams" />
        <Stat label="Open tasks" value="1,204" delta="312 in progress" />
        <Stat label="Monthly cost" value="$1.74M" delta="4% under budget" />
      </div>
      <p className="mt-8 mb-3 text-label text-muted-foreground">Drag widgets to rearrange</p>
      <div className="grid gap-4 md:grid-cols-2">
        {order.map((k) => (
          <div key={k} draggable onDragStart={() => setDrag(k)} onDragEnd={() => setDrag(null)}
            onDragOver={(e) => e.preventDefault()} onDrop={() => drop(k)}
            className={drag === k ? "opacity-40 transition" : "transition"}>
            <Panel title={widgets[k]!.title} action={<GripVertical className="h-4 w-4 cursor-grab text-dim" />} className="h-full">
              {widgets[k]!.body}
            </Panel>
          </div>
        ))}
      </div>
    </>
  );
}
