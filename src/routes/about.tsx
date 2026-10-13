import { createFileRoute } from "@tanstack/react-router";
import { MarketingShell, PageHero } from "@/components/devpulse/brand";

const items = [
  { t: 'Founded 2023', d: 'By engineers from leading infrastructure and AI labs.' },
  { t: '2,400+ teams', d: 'From seed-stage startups to Fortune 100.' },
  { t: 'Remote-first', d: 'A global team across 14 countries.' },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — DevPulse" },
      { name: "description", content: 'We believe great software comes from teams that can see clearly. DevPulse gives them that clarity.' },
      { property: "og:title", content: "About — DevPulse" },
      { property: "og:description", content: 'We believe great software comes from teams that can see clearly. DevPulse gives them that clarity.' },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <MarketingShell>
      <PageHero eyebrow="About" title={'Engineering, understood.'} sub={'We believe great software comes from teams that can see clearly. DevPulse gives them that clarity.'} />
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
