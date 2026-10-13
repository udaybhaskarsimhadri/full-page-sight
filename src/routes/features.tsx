import { createFileRoute } from "@tanstack/react-router";
import { MarketingShell, PageHero } from "@/components/devpulse/brand";

const items = [
  { t: 'Projects & Portfolios', d: 'Milestones, dependencies, budgets and health in real time.' },
  { t: 'Requirements', d: 'Traceable requirements linked to tasks, tests and code.' },
  { t: 'Sprints', d: 'Capacity-aware planning, burndown and velocity forecasting.' },
  { t: 'Bugs', d: 'AI triage, severity prediction and commit correlation.' },
  { t: 'Tests', d: 'Coverage, flakiness detection, release readiness.' },
  { t: 'Code Analytics', d: 'Complexity, churn, ownership and hotspots.' },
  { t: 'Tech Stack Analyzer', d: 'Detects languages, frameworks and infra automatically.' },
  { t: 'Reports', d: 'Executive-ready PDF and CSV in one click.' },
];

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — DevPulse" },
      { name: "description", content: 'From requirements to release, DevPulse connects every artifact your teams create and turns them into decisions.' },
      { property: "og:title", content: "Features — DevPulse" },
      { property: "og:description", content: 'From requirements to release, DevPulse connects every artifact your teams create and turns them into decisions.' },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <MarketingShell>
      <PageHero eyebrow="Features" title={'Every module, one intelligence.'} sub={'From requirements to release, DevPulse connects every artifact your teams create and turns them into decisions.'} />
      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-32 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div key={it.t} className="card-lux lift p-8">
            <h3 className="text-card">{it.t}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{it.d}</p>
          </div>
        ))}
      </section>
    </MarketingShell>
  );
}
