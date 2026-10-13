import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Panel, PageHeader, Pill, Stat, Table } from "@/components/devpulse/ui";

export const Route = createFileRoute("/app/requirements")({ component: Page });

type Req = { id: string; t: string; pr: string; status: string; linked: number };
const seed: Req[] = [
  { id: "REQ-104", t: "PCI-DSS compliant card vaulting", pr: "Must", status: "Approved", linked: 12 },
  { id: "REQ-109", t: "Offline-first mobile checkout", pr: "Must", status: "In review", linked: 8 },
  { id: "REQ-112", t: "Multi-region failover < 30s", pr: "Should", status: "Approved", linked: 5 },
  { id: "REQ-118", t: "SAML SSO for enterprise tenants", pr: "Must", status: "Implemented", linked: 14 },
  { id: "REQ-121", t: "Self-serve data export", pr: "Could", status: "Draft", linked: 0 },
];

function Page() {
  const [list, setList] = useState(seed);
  const [t, setT] = useState("");
  const add = (e: FormEvent) => {
    e.preventDefault();
    if (!t.trim()) { toast.error("Describe the requirement first."); return; }
    setList((l) => [{ id: `REQ-${122 + l.length - seed.length}`, t: t.trim(), pr: "Should", status: "Draft", linked: 0 }, ...l]);
    setT(""); toast.success("Requirement added");
  };
  return (
    <>
      <PageHeader title="Requirements" sub="Traceable requirements linked to tasks, tests and code." action={<Button asChild variant="outline"><Link to="/app/ai" search={{ tool: "requirements" }}><Sparkles /> Generate with AI</Link></Button>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total" value={String(list.length)} /><Stat label="Approved" value={String(list.filter((r) => r.status === "Approved").length)} />
        <Stat label="Traceability" value="94%" delta="linked to tests" /><Stat label="Change requests" value="3" delta="this sprint" />
      </div>
      <form onSubmit={add} className="card-lux mt-4 flex flex-col gap-3 p-4 sm:flex-row">
        <input value={t} onChange={(e) => setT(e.target.value)} placeholder="New requirement…" className="h-12 flex-1 rounded-2xl border border-line bg-surface-2 px-4 text-sm outline-none focus:border-foreground/30" />
        <Button size="lg" type="submit"><Plus /> Add requirement</Button>
      </form>
      <Panel title="Requirement register" className="mt-4">
        <Table head={["ID", "Requirement", "Priority", "Status", "Linked items"]}
          rows={list.map((r) => [<span className="text-muted-foreground">{r.id}</span>, r.t, <Pill strong={r.pr === "Must"}>{r.pr}</Pill>, r.status, r.linked])} />
      </Panel>
    </>
  );
}
