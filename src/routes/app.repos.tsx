import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { GitBranch, GitPullRequest, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader, Pill, Stat } from "@/components/devpulse/ui";
import { repos } from "@/lib/devpulse-data";

export const Route = createFileRoute("/app/repos")({ component: Page });

function Page() {
  const [q, setQ] = useState("");
  const list = useMemo(() => repos.filter((r) => `${r.name} ${r.project} ${r.lang}`.toLowerCase().includes(q.toLowerCase())), [q]);
  return (
    <>
      <PageHeader title="GitHub Repositories" sub="Repositories linked to your team's projects."
        action={<Button variant="outline" onClick={() => toast("GitHub connection arrives in Phase 2", { description: "Repositories shown are sample data." })}><Plus /> Connect GitHub</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Active repositories" value={String(repos.length)} />
        <Stat label="Open pull requests" value={String(repos.reduce((a, r) => a + r.prs, 0))} />
        <Stat label="CI passing" value={`${repos.filter((r) => r.ci === "passing").length}/${repos.length}`} />
        <Stat label="Failing builds" value={String(repos.filter((r) => r.ci === "failing").length)} />
      </div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter repositories…" aria-label="Filter repositories"
        className="mt-4 h-11 w-full rounded-2xl border border-line bg-surface px-4 text-sm outline-none focus:border-foreground/30" />
      {list.length === 0 ? (
        <div className="card-lux mt-4 p-10 text-center text-sm text-muted-foreground">No repositories match “{q}”.</div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((r) => (
            <div key={r.name} className="card-lux lift p-6">
              <div className="flex items-start justify-between gap-3"><h3 className="truncate font-medium">{r.name}</h3><Pill strong={r.ci === "failing"}>CI {r.ci}</Pill></div>
              <p className="mt-1 text-sm text-muted-foreground">{r.project} · {r.lang}</p>
              <div className="mt-5 flex flex-wrap gap-4 text-label text-muted-foreground">
                <span className="flex items-center gap-1"><GitBranch className="h-3.5 w-3.5" />{r.branch}</span>
                <span className="flex items-center gap-1"><GitPullRequest className="h-3.5 w-3.5" />{r.prs} PRs</span>
                <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5" />{r.stars}</span>
                <span>Last commit {r.lastCommit}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
