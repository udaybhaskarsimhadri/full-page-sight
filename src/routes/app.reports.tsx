import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/devpulse/ui";
import { projects } from "@/lib/devpulse-data";

export const Route = createFileRoute("/app/reports")({ component: Page });

const reports = ["Executive summary", "Sprint report", "Quality & testing", "Bug analysis", "Cost & budget", "Team performance"];

function csv() {
  const rows = [["Project", "Lead", "Progress", "Health", "Budget"], ...projects.map((p) => [p.name, p.lead, `${p.progress}%`, p.health, p.budget])];
  const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "devpulse-report.csv"; a.click(); URL.revokeObjectURL(a.href);
}

function Page() {
  return (
    <>
      <PageHeader title="Reports" sub="Generate and export executive-ready reports." action={<Button asChild variant="outline"><Link to="/app/ai" search={{ tool: "docs", q: "Write the Sprint 24 release notes and an executive status report." }}><Sparkles /> Generate with AI</Link></Button>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <div key={r} className="card-lux lift p-6">
            <h3 className="text-card">{r}</h3>
            <p className="mt-2 text-sm text-muted-foreground">Last generated today · auto-updated weekly</p>
            <div className="mt-6 flex gap-2">
              <Button size="sm" onClick={csv}><Download /> CSV</Button>
              <Button size="sm" variant="outline" onClick={() => window.print()}>PDF</Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
