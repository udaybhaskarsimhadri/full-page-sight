import { createFileRoute } from "@tanstack/react-router";
import { Panel, PageHeader, Stat } from "@/components/devpulse/ui";
import { VelocityChart, BurndownChart } from "@/components/devpulse/charts";

export const Route = createFileRoute("/app/sprints")({ component: Page });

function Page() {
  return (
    <>
      <PageHeader title="Agile & Sprints" sub="Sprint 24 · Oct 6 – Oct 19" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Committed" value="58 pts" />
        <Stat label="Completed" value="57 pts" delta="98% of commitment" />
        <Stat label="Avg velocity" value="49.4" delta="last 6 sprints" />
        <Stat label="Carry-over risk" value="Low" delta="AI forecast" />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Panel title="Burndown"><BurndownChart h={280} /></Panel>
        <Panel title="Velocity history"><VelocityChart h={280} /></Panel>
      </div>
    </>
  );
}
