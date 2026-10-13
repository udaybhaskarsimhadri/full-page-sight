import { createFileRoute } from "@tanstack/react-router";
import { MarketingShell, PageHero } from "@/components/devpulse/brand";

const items = [
  { t: 'Starter — $0', d: 'Up to 5 engineers, 2 projects, core analytics.' },
  { t: 'Team — $24 / seat', d: 'Unlimited projects, AI copilot, sprint forecasting.' },
  { t: 'Enterprise — Custom', d: 'SSO, SCIM, audit logs, dedicated infrastructure, SLA.' },
];

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — DevPulse" },
      { name: "description", content: 'Start free. Scale when your organization does.' },
      { property: "og:title", content: "Pricing — DevPulse" },
      { property: "og:description", content: 'Start free. Scale when your organization does.' },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <MarketingShell>
      <PageHero eyebrow="Pricing" title={'Simple pricing. Serious leverage.'} sub={'Start free. Scale when your organization does.'} />
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
