import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Panel, PageHeader } from "@/components/devpulse/ui";

export const Route = createFileRoute("/app/settings")({ component: Page });

const field = "h-11 w-full rounded-2xl border border-line bg-surface-2 px-4 text-sm outline-none focus:border-foreground/30";
const toggles = ["Email digest", "Slack alerts for critical bugs", "AI risk forecasts", "Weekly executive report"];

function Page() {
  return (
    <>
      <PageHeader title="Settings" sub="Manage your profile, workspace and notifications." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Workspace">
          <div className="space-y-3"><input className={field} defaultValue="Acme Engineering" aria-label="Workspace name" /><input className={field} defaultValue="Asia/Kolkata" aria-label="Timezone" />
            <Button onClick={() => toast.success("Settings saved")}>Save changes</Button></div>
        </Panel>
        <Panel title="Notifications">
          <div className="space-y-4">{toggles.map((t, i) => (
            <label key={t} className="flex cursor-pointer items-center justify-between text-sm">{t}
              <input type="checkbox" defaultChecked={i < 3} onChange={(e) => toast(`${t} ${e.target.checked ? "enabled" : "disabled"}`)} className="peer sr-only" />
              <span className="relative h-6 w-11 rounded-full bg-secondary transition after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-muted-foreground after:transition peer-checked:bg-foreground peer-checked:after:translate-x-5 peer-checked:after:bg-background" />
            </label>))}</div>
        </Panel>
      </div>
    </>
  );
}
