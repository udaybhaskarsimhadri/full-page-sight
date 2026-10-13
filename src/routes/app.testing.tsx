import { createFileRoute } from "@tanstack/react-router";
import { Panel, PageHeader, Progress, Stat, Table } from "@/components/devpulse/ui";
import { tests } from "@/lib/devpulse-data";

export const Route = createFileRoute("/app/testing")({ component: Page });

function Page() {
  return (
    <>
      <PageHeader title="Test Management" sub="Coverage, pass rate and release readiness." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total tests" value="1,851" /><Stat label="Pass rate" value="99.4%" />
        <Stat label="Coverage" value="87.4%" /><Stat label="Flaky tests" value="11" delta="4 cause 70% of failures" />
      </div>
      <Panel title="Suites" className="mt-4">
        <Table head={["Suite", "Passed", "Failed", "Coverage"]}
          rows={tests.map((t) => [t.suite, t.pass, t.fail, <div className="flex items-center gap-3"><div className="w-32"><Progress v={t.cov} /></div>{t.cov}%</div>])} />
      </Panel>
    </>
  );
}
