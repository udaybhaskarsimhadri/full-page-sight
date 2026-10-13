import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Pill } from "@/components/devpulse/ui";
import { stack } from "@/lib/devpulse-data";

export const Route = createFileRoute("/app/stack")({ component: Page });

function Page() {
  const [repo, setRepo] = useState("github.com/acme/atlas-payments");
  const [scanning, setScanning] = useState(false);
  const [shown, setShown] = useState(true);
  const scan = () => { setScanning(true); setShown(false); setTimeout(() => { setScanning(false); setShown(true); }, 1400); };
  return (
    <>
      <PageHeader title="Technology Stack Analyzer" sub="Detect languages, frameworks, databases and infrastructure automatically." />
      <div className="card-lux flex flex-col gap-3 p-4 sm:flex-row">
        <input value={repo} onChange={(e) => setRepo(e.target.value)} className="h-12 flex-1 rounded-2xl border border-line bg-surface-2 px-4 text-sm outline-none focus:border-foreground/30" />
        <Button size="lg" onClick={scan} disabled={scanning}><ScanLine /> {scanning ? "Analyzing…" : "Analyze repository"}</Button>
      </div>
      {shown && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stack.map((s, i) => (
            <div key={s.cat} className="card-lux lift fade-up p-6" style={{ animationDelay: `${i * 0.06}s` }}>
              <h3 className="text-card">{s.cat}</h3>
              <div className="mt-4 flex flex-wrap gap-2">{s.items.map((x) => <Pill key={x}>{x}</Pill>)}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
