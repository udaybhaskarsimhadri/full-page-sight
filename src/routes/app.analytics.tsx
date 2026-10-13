import { createFileRoute } from "@tanstack/react-router";
import { Panel, PageHeader, Stat, Table, Progress } from "@/components/devpulse/ui";
import { VelocityChart, CommitsChart, BurndownChart, LanguagesChart } from "@/components/devpulse/charts";

export const Route = createFileRoute("/app/analytics")({ component: Page });

const teams = [
  { t: "Payments", cycle: "11.2h", deploys: 64, cfr: "2.1%", score: 92 },
  { t: "Mobile", cycle: "18.9h", deploys: 31, cfr: "4.8%", score: 74 },
  { t: "Data Platform", cycle: "9.4h", deploys: 88, cfr: "1.6%", score: 95 },
  { t: "Identity", cycle: "14.1h", deploys: 42, cfr: "3.0%", score: 83 },
];

function Page() {
  return (
    <>
      <PageHeader title="Engineering Analytics" sub="DORA metrics, throughput and delivery trends." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Deploy frequency" value="7.4/day" delta="+12% QoQ" /><Stat label="Lead time" value="13.6h" delta="−9% QoQ" />
        <Stat label="Change failure rate" value="2.7%" /><Stat label="MTTR" value="42m" delta="elite tier" />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Panel title="Velocity"><VelocityChart /></Panel>
        <Panel title="Commit throughput"><CommitsChart /></Panel>
        <Panel title="Burndown"><BurndownChart /></Panel>
        <Panel title="Language distribution"><LanguagesChart /></Panel>
      </div>
      <Panel title="Team performance" className="mt-4">
        <Table head={["Team", "Cycle time", "Deploys / mo", "Failure rate", "Health"]}
          rows={teams.map((r) => [r.t, r.cycle, r.deploys, r.cfr, <div className="flex items-center gap-3"><div className="w-28"><Progress v={r.score} /></div>{r.score}</div>])} />
      </Panel>
    </>
  );
}
