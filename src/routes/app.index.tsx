import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { GripVertical, Sparkles } from "lucide-react";
import { Panel, Stat, PageHeader, Progress, Pill } from "@/components/devpulse/ui";
import { VelocityChart, BurndownChart, CommitsChart, LanguagesChart } from "@/components/devpulse/charts";
import { projects, bugs, tests, repos, activity } from "@/lib/devpulse-data";
import { ROLE_LABEL, type Role } from "@/lib/roles";

export const Route = createFileRoute("/app/")({ component: Dashboard });

const widgets: Record<string, { title: string; wide?: boolean; body: ReactNode }> = {
  attention: { title: "Projects requiring attention", body: (
    <div className="space-y-3 text-sm">{projects.filter((p) => p.health !== "Healthy").map((p) => (
      <Link key={p.name} to="/app/projects" className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 transition hover:border-foreground/20">
        <div><div>{p.name}</div><div className="text-label text-muted-foreground">Lead {p.lead} · due {p.due}</div></div><Pill strong>{p.health}</Pill></Link>))}</div>) },
  activity: { title: "Recent team activity", body: (
    <ul className="space-y-3 text-sm">{activity.map((a) => (
      <li key={a.what} className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" /><div><span className="font-medium">{a.who}</span> <span className="text-muted-foreground">{a.what}</span><div className="text-label text-dim">{a.when}</div></div></li>))}</ul>) },
  velocity: { title: "Sprint progress", body: <VelocityChart /> },
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
  commits: { title: "Repository activity", body: <CommitsChart /> },
  langs: { title: "Technology mix", body: <LanguagesChart /> },
  bugs: { title: "Bug dashboard", body: (
    <div className="space-y-3 text-sm">{bugs.slice(0, 4).map((b) => (
      <div key={b.id} className="flex items-center justify-between gap-3"><span className="truncate">{b.t}</span><Pill strong={b.sev === "Critical"}>{b.sev}</Pill></div>))}</div>) },
  tests: { title: "Testing dashboard", body: (
    <div className="space-y-4">{tests.map((t) => (
      <div key={t.suite}><div className="mb-1.5 flex justify-between text-sm"><span>{t.suite}</span><span className="text-muted-foreground">{t.cov}% cov</span></div><Progress v={t.cov} /></div>))}</div>) },
};

const ROLE_WIDGETS: Record<Role, string[]> = {
  manager: Object.keys(widgets),
  developer: ["velocity", "burndown", "commits", "langs", "bugs", "activity", "ai"],
  tester: ["tests", "bugs", "health", "attention", "activity", "ai"],
};
const ROLE_SUB: Record<Role, string> = {
  manager: "Here's what's happening across your engineering org.",
  developer: "Your sprint, code activity and assigned bugs.",
  tester: "Test coverage, failing suites and open defects.",
};

function Dashboard() {
  const { session } = Route.useRouteContext();
  const role = session.role;
  const passed = tests.reduce((a, t) => a + t.pass, 0);
  const failed = tests.reduce((a, t) => a + t.fail, 0);
  const [order, setOrder] = useState(ROLE_WIDGETS[role]);
  const [drag, setDrag] = useState<string | null>(null);
  const drop = (target: string) => {
    if (!drag || drag === target) return;
    const next = order.filter((k) => k !== drag);
    next.splice(next.indexOf(target), 0, drag);
    setOrder(next);
  };
  const openBugs = bugs.filter((b) => b.status !== "Verified").length;
  const passRate = `${(100 * passed / (passed + failed)).toFixed(1)}%`;
  return (
    <>
      <PageHeader title={`Welcome back, ${session.name.split(" ")[0]}`} sub={`${ROLE_LABEL[role]} dashboard · ${ROLE_SUB[role]}`} action={<Pill>Sample data</Pill>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {role === "manager" && <>
          <Stat label="Total projects" value={String(projects.length)} delta={`${projects.filter((p) => p.health !== "Healthy").length} need attention`} />
          <Stat label="Active repositories" value={String(repos.length)} delta={`${repos.reduce((a, r) => a + r.prs, 0)} open PRs`} />
          <Stat label="Open tasks" value="1,204" delta="312 in progress" />
          <Stat label="Open bugs" value={String(openBugs)} delta={`${bugs.filter((b) => b.sev === "Critical").length} critical`} />
          <Stat label="Testing pass rate" value={passRate} delta={`${failed} failing tests`} />
        </>}
        {role === "developer" && <>
          <Stat label="My open tasks" value="14" delta="5 in progress" />
          <Stat label="Open PRs" value={String(repos.reduce((a, r) => a + r.prs, 0))} delta="3 awaiting review" />
          <Stat label="Commits this week" value="47" delta="+12% vs last week" />
          <Stat label="Assigned bugs" value={String(openBugs)} delta={`${bugs.filter((b) => b.sev === "Critical").length} critical`} />
          <Stat label="Sprint 24" value="68%" delta="4 days left" />
        </>}
        {role === "tester" && <>
          <Stat label="Pass rate" value={passRate} delta={`${failed} failing tests`} />
          <Stat label="Test suites" value={String(tests.length)} />
          <Stat label="Open defects" value={String(openBugs)} delta={`${bugs.filter((b) => b.sev === "Critical").length} critical`} />
          <Stat label="Avg coverage" value={`${Math.round(tests.reduce((a, t) => a + t.cov, 0) / tests.length)}%`} />
          <Stat label="Ready to verify" value={String(bugs.filter((b) => b.status !== "Verified" && b.status !== "Open").length)} />
        </>}
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
