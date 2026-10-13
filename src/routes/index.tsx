import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Play, Kanban, Bug, FlaskConical, Code2, Sparkles, Layers, FileText, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingShell, Eyebrow } from "@/components/devpulse/brand";
import { Panel, Stat } from "@/components/devpulse/ui";
import { VelocityChart, CommitsChart } from "@/components/devpulse/charts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DevPulse — AI Software Engineering Intelligence" },
      { name: "description", content: "One AI platform to manage projects, analyze code, predict risk and automate documentation." },
      { property: "og:title", content: "DevPulse — Software Engineering Intelligence, Reimagined" },
      { property: "og:description", content: "Manage projects, analyze code, predict risks and accelerate delivery with AI." },
    ],
  }),
  component: Index,
});

const features = [
  { i: Kanban, t: "Project Management", d: "Portfolios, milestones and dependencies in one calm surface." },
  { i: Layers, t: "Agile Sprint Planning", d: "Capacity-aware sprints that plan themselves from your backlog." },
  { i: Bug, t: "Bug Intelligence", d: "Auto-triage, dedupe and root-cause linking to commits." },
  { i: FlaskConical, t: "Test Management", d: "Coverage, flakiness and release readiness at a glance." },
  { i: Code2, t: "Code Analytics", d: "Complexity, churn and quality trends across every repo." },
  { i: ShieldAlert, t: "Risk Prediction", d: "Forecast slips weeks before they happen." },
  { i: FileText, t: "Auto Documentation", d: "Living docs generated from code, tickets and decisions." },
  { i: Sparkles, t: "AI Copilot", d: "Ask anything about your engineering org. Get answers." },
];

function Particles() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: 28 }).map((_, i) => (
        <span key={i} className="twinkle absolute h-0.5 w-0.5 rounded-full bg-foreground"
          style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 90}%`, animationDelay: `${(i % 7) * 0.4}s` }} />
      ))}
      <svg className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="none" viewBox="0 0 1200 700">
        <g stroke="var(--dim)" fill="none" strokeWidth="1">
          <path className="dash-flow" d="M100 520 C 300 400, 400 600, 600 460 S 900 300, 1100 420" />
          <path className="dash-flow" d="M120 180 C 320 260, 480 120, 640 220 S 960 160, 1080 240" />
        </g>
        {[[100, 520], [600, 460], [1100, 420], [120, 180], [640, 220], [1080, 240]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="var(--foreground)" className="twinkle" style={{ animationDelay: `${i * 0.5}s` }} />
        ))}
      </svg>
    </div>
  );
}

function Index() {
  return (
    <MarketingShell>
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0" />
        <Particles />
        <div className="glass float-slow absolute left-[4%] top-[58%] hidden w-56 rounded-3xl p-4 lg:block">
          <div className="text-label text-muted-foreground">Sprint velocity</div>
          <div className="mt-1 text-2xl font-semibold">98.2%</div>
        </div>
        <div className="glass float-slower absolute right-[5%] top-[22%] hidden w-60 rounded-3xl p-4 lg:block">
          <div className="text-label text-muted-foreground">Risk forecast</div>
          <div className="mt-1 text-sm">Orion Mobile · +2.3d slip</div>
          <div className="mt-3 h-1 rounded-full bg-secondary"><div className="h-1 w-2/3 rounded-full bg-foreground" /></div>
        </div>
        <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-28 text-center md:pt-36">
          <div className="fade-up"><Eyebrow>Introducing DevPulse Intelligence 2.0</Eyebrow></div>
          <h1 className="text-hero text-shine fade-up mt-8" style={{ animationDelay: ".1s" }}>
            Software Engineering Intelligence, Reimagined.
          </h1>
          <p className="fade-up mx-auto mt-7 max-w-2xl text-base text-muted-foreground md:text-lg" style={{ animationDelay: ".2s" }}>
            One intelligent platform that manages projects, analyzes code, predicts risks, automates documentation, and accelerates software development using AI.
          </p>
          <div className="fade-up mt-10 flex flex-wrap justify-center gap-3" style={{ animationDelay: ".3s" }}>
            <Button asChild size="lg"><Link to="/signup">Start Free <ArrowRight /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/app"><Play /> Watch Demo</Link></Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-28">
        <div className="glass fade-up rounded-[28px] p-3" style={{ animationDelay: ".4s" }}>
          <div className="rounded-3xl bg-background/70 p-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Stat label="Active projects" value="24" delta="+3 this quarter" />
              <Stat label="Sprint completion" value="96%" delta="+4.1% vs last" />
              <Stat label="Open critical bugs" value="2" delta="−5 this week" />
              <Stat label="Test coverage" value="87.4%" delta="+1.2%" />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Panel title="Velocity — planned vs done"><VelocityChart /></Panel>
              <Panel title="Commit activity — 30 days"><CommitsChart /></Panel>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="mb-14 max-w-2xl">
          <h2 className="text-section">Everything engineering leaders need. Nothing they don't.</h2>
          <p className="mt-4 text-muted-foreground">Eight deeply integrated modules, one AI that understands all of them.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ i: I, t, d }) => (
            <div key={t} className="card-lux lift group p-7">
              <div className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-secondary/50 transition-colors group-hover:bg-foreground group-hover:text-background">
                <I className="h-5 w-5" />
              </div>
              <h3 className="text-card mt-6">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-32 text-center">
        <div className="card-lux relative overflow-hidden px-8 py-20">
          <div className="grid-bg absolute inset-0 opacity-60" />
          <h2 className="text-section relative">Ship with certainty.</h2>
          <p className="relative mx-auto mt-4 max-w-lg text-muted-foreground">Join the engineering teams that see risk before it becomes reality.</p>
          <Button asChild size="lg" className="relative mt-8"><Link to="/signup">Get Started <ArrowRight /></Link></Button>
        </div>
      </section>
    </MarketingShell>
  );
}
