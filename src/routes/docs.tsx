import { createFileRoute } from "@tanstack/react-router";
import { MarketingShell, PageHero } from "@/components/devpulse/brand";

const items = [
  { t: 'Quickstart', d: 'Connect your first repository in under five minutes.' },
  { t: 'Integrations', d: 'GitHub, GitLab, Jira, Linear, Slack, PagerDuty.' },
  { t: 'REST & GraphQL API', d: 'Programmatic access to every metric.' },
  { t: 'Webhooks', d: 'Real-time events for sprints, bugs and deploys.' },
  { t: 'Security', d: 'SOC 2 Type II, encryption, data residency.' },
  { t: 'AI Models', d: 'How DevPulse reasons about your codebase.' },
];

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Documentation — DevPulse" },
      { name: "description", content: 'Guides, API references and integrations to connect your entire engineering stack.' },
      { property: "og:title", content: "Documentation — DevPulse" },
      { property: "og:description", content: 'Guides, API references and integrations to connect your entire engineering stack.' },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <MarketingShell>
      <PageHero eyebrow="Documentation" title={'Build on DevPulse.'} sub={'Guides, API references and integrations to connect your entire engineering stack.'} />
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
