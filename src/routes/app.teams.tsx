import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Copy, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel, Pill, Table } from "@/components/devpulse/ui";
import { teams } from "@/lib/devpulse-data";
import { ROLE_LABEL, type Role } from "@/lib/roles";

export const Route = createFileRoute("/app/teams")({ component: Page });

const field = "h-11 rounded-2xl border border-line bg-surface-2 px-4 text-sm outline-none focus:border-foreground/30";

function Page() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("developer");
  const [team, setTeam] = useState<string>(teams[0].id);
  const [err, setErr] = useState<string | null>(null);

  const invite = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { setErr("Enter a valid email address."); return; }
    setErr(null);
    const link = `${window.location.origin}/signup?invite=${team}-${role}-preview`;
    void navigator.clipboard?.writeText(link);
    toast.success("Preview invite link copied", { description: "Sending invites needs the backend (Phase 2)." });
    setEmail("");
  };

  return (
    <>
      <PageHeader title="Teams" sub="Every member sees all projects and repositories of their team." />
      <form onSubmit={invite} noValidate className="card-lux mb-4 flex flex-col gap-3 p-4 md:flex-row">
        <input className={`${field} flex-1`} type="email" placeholder="teammate@company.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Invite email" />
        <select className={field} value={team} onChange={(e) => setTeam(e.target.value)} aria-label="Team">{teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
        <select className={field} value={role} onChange={(e) => setRole(e.target.value as Role)} aria-label="Role">{(Object.keys(ROLE_LABEL) as Role[]).map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}</select>
        <Button size="lg" type="submit"><UserPlus /> Create invite link</Button>
      </form>
      {err && <p role="alert" className="-mt-2 mb-4 text-sm text-muted-foreground">{err}</p>}
      <div className="grid gap-4 lg:grid-cols-3">
        {teams.map((t) => (
          <Panel key={t.id} title={t.name} action={<button aria-label={`Copy ${t.name} invite link`} onClick={() => { void navigator.clipboard?.writeText(`${window.location.origin}/signup?invite=${t.id}`); toast.success("Team link copied"); }} className="text-muted-foreground hover:text-foreground"><Copy className="h-4 w-4" /></button>}>
            <div className="mb-4 flex flex-wrap gap-1.5">{t.projects.map((p) => <Pill key={p}>{p}</Pill>)}</div>
            <Table head={["Member", "Role"]} rows={t.members.map((m) => [<div><div>{m.name}</div><div className="text-label text-muted-foreground">{m.email}</div></div>, <Pill strong={m.role === "manager"}>{ROLE_LABEL[m.role]}</Pill>])} />
          </Panel>
        ))}
      </div>
    </>
  );
}
