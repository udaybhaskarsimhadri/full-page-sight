import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { LayoutGrid, FolderKanban, Timer, ListTodo, Bug, FlaskConical, Layers, Code2, FileBarChart, Settings, Search, Bell } from "lucide-react";
import { Logo } from "@/components/devpulse/brand";
import { Assistant } from "@/components/devpulse/assistant";

export const Route = createFileRoute("/app")({
  head: () => ({ meta: [
    { title: "Dashboard — DevPulse" },
    { name: "description", content: "Your DevPulse engineering command center." },
    { property: "og:title", content: "Dashboard — DevPulse" },
    { property: "og:description", content: "Your DevPulse engineering command center." },
  ] }),
  component: AppLayout,
});

const items = [
  { to: "/app", l: "Dashboard", i: LayoutGrid },
  { to: "/app/projects", l: "Projects", i: FolderKanban },
  { to: "/app/sprints", l: "Sprints", i: Timer },
  { to: "/app/tasks", l: "Tasks", i: ListTodo },
  { to: "/app/bugs", l: "Bugs", i: Bug },
  { to: "/app/testing", l: "Testing", i: FlaskConical },
  { to: "/app/stack", l: "Tech Stack", i: Layers },
  { to: "/app/code", l: "Code Analytics", i: Code2 },
  { to: "/app/reports", l: "Reports", i: FileBarChart },
  { to: "/app/settings", l: "Settings", i: Settings },
] as const;

function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-sidebar p-4 lg:flex">
        <div className="px-2 py-3"><Logo /></div>
        <nav className="mt-6 space-y-0.5">
          {items.map(({ to, l, i: I }) => (
            <Link key={to} to={to} activeOptions={{ exact: to === "/app" }}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground"
              activeProps={{ className: "bg-sidebar-accent text-foreground" }}>
              <I className="h-4 w-4" /> {l}
            </Link>
          ))}
        </nav>
        <div className="card-lux mt-auto p-4 text-sm">
          <div className="font-medium">Enterprise trial</div>
          <div className="mt-1 text-label text-muted-foreground">12 days remaining</div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-line bg-background/70 px-6 backdrop-blur-xl">
          <div className="flex h-10 flex-1 max-w-md items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm text-muted-foreground">
            <Search className="h-4 w-4" /> Search projects, tasks, commits… <kbd className="ml-auto text-label text-dim">⌘K</kbd>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="grid h-10 w-10 place-items-center rounded-xl border border-line text-muted-foreground hover:text-foreground"><Bell className="h-4 w-4" /></button>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">UB</div>
          </div>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-line px-4 py-2 lg:hidden">
          {items.map(({ to, l }) => (
            <Link key={to} to={to} activeOptions={{ exact: to === "/app" }} className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm text-muted-foreground" activeProps={{ className: "bg-secondary text-foreground" }}>{l}</Link>
          ))}
        </nav>
        <main className="mx-auto max-w-7xl p-6 md:p-10"><Outlet /></main>
      </div>
      <Assistant />
    </div>
  );
}
