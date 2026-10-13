import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel, PageHeader, Stat, Table } from "@/components/devpulse/ui";
import { CommitsChart, LanguagesChart } from "@/components/devpulse/charts";
import { languages } from "@/lib/devpulse-data";

export const Route = createFileRoute("/app/code")({ component: Page });

function Page() {
  return (
    <>
      <PageHeader title="Code Analytics" sub="Quality, complexity and activity across 48 repositories." action={<Button asChild variant="outline"><Link to="/app/ai" search={{ tool: "review" }}><Sparkles /> Review code</Link></Button>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Lines of code" value="2.41M" /><Stat label="Avg complexity" value="6.2" delta="−0.4 this month" />
        <Stat label="Tech debt" value="312h" /><Stat label="PR cycle time" value="14.2h" />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Commits — 30 days" className="lg:col-span-2"><CommitsChart h={260} /></Panel>
        <Panel title="Languages"><LanguagesChart h={180} />
          <Table head={["Language", "Share"]} rows={languages.map((l) => [l.name, `${l.v}%`])} />
        </Panel>
      </div>
    </>
  );
}
