import { createFileRoute, Link } from "@tanstack/react-router";
import { Panel, PageHeader, Pill, Stat, Table } from "@/components/devpulse/ui";
import { bugs } from "@/lib/devpulse-data";

export const Route = createFileRoute("/app/bugs")({ component: Page });

function Page() {
  return (
    <>
      <PageHeader title="Bug Tracking" sub="AI-triaged defects across all environments." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Open" value="38" /><Stat label="Critical" value="2" />
        <Stat label="MTTR" value="9.4h" delta="−22% vs last month" /><Stat label="Escaped defects" value="0.8%" />
      </div>
      <Panel title="Recent bugs" className="mt-4">
        <Table head={["ID", "Title", "Severity", "Status", "Env", "Age", ""]}
          rows={bugs.map((b) => [<span className="text-muted-foreground">{b.id}</span>, b.t, <Pill strong={b.sev === "Critical"}>{b.sev}</Pill>, b.status, b.env, b.age, <Link to="/app/ai" search={{ tool: "bug", q: `${b.id}: ${b.t} (severity ${b.sev}, env ${b.env}, status ${b.status})` }} className="text-label underline">Analyze with AI</Link>])} />
      </Panel>
    </>
  );
}
