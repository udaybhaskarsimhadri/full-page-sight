import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Panel, PageHeader, Stat } from "@/components/devpulse/ui";
import { updateName } from "@/lib/auth";
import { ROLE_LABEL } from "@/lib/roles";

export const Route = createFileRoute("/app/profile")({ component: Page });

const field = "h-11 w-full rounded-2xl border border-line bg-surface-2 px-4 text-sm outline-none focus:border-foreground/30";

function Page() {
  const { session } = Route.useRouteContext();
  const router = useRouter();
  const [name, setName] = useState(session.name);
  const save = async () => {
    if (!name.trim()) { toast.error("Name can't be empty."); return; }
    try { await updateName(session.id, name.trim()); await router.invalidate(); toast.success("Profile updated"); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Could not save."); }
  };
  return (
    <>
      <PageHeader title="Profile" sub="Your personal account details." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Account" className="lg:col-span-2">
          <div className="space-y-3">
            <input className={field} value={name} onChange={(e) => setName(e.target.value)} aria-label="Full name" />
            <input className={field} value={`@${session.username}`} readOnly aria-label="Username" />
            <Button onClick={save}>Save profile</Button>
          </div>
        </Panel>
        <div className="space-y-4">
          <Stat label="Role" value={ROLE_LABEL[session.role]} />
          <Stat label="Teams" value="4" delta="Payments, Mobile, Data, Identity" />
        </div>
      </div>
    </>
  );
}
