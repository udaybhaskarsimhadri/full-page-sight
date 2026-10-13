import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Panel, PageHeader, Progress, Pill, Table } from "@/components/devpulse/ui";
import { projects } from "@/lib/devpulse-data";

export const Route = createFileRoute("/app/projects")({ component: Page });

function Page() {
  return (
    <>
      <PageHeader title="Projects" sub="Portfolio overview, ownership and delivery health." action={<Button onClick={() => toast.success("Project draft created", { description: "Untitled project added to your portfolio." })}><Plus /> New project</Button>} />
      <div className="mb-4 grid gap-4 md:grid-cols-3">
        {projects.slice(0, 3).map((p) => (
          <div key={p.name} className="card-lux lift p-6">
            <div className="flex items-center justify-between"><h3 className="text-card">{p.name}</h3><Pill strong={p.health !== "Healthy"}>{p.health}</Pill></div>
            <p className="mt-1 text-sm text-muted-foreground">Lead {p.lead} · {p.team} engineers</p>
            <div className="mt-6"><Progress v={p.progress} /></div>
            <div className="mt-2 flex justify-between text-label text-muted-foreground"><span>{p.progress}% complete</span><span>Due {p.due}</span></div>
          </div>
        ))}
      </div>
      <Panel title="All projects">
        <Table head={["Project", "Lead", "Sprint", "Team", "Budget", "Progress", "Health"]}
          rows={projects.map((p) => [p.name, p.lead, p.sprint, p.team, p.budget, <div className="w-28"><Progress v={p.progress} /></div>, <Pill strong={p.health !== "Healthy"}>{p.health}</Pill>])} />
      </Panel>
    </>
  );
}
