import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  LayoutGrid, FolderKanban, ClipboardList, Timer, ListTodo, Bug, FlaskConical, BarChart3, Layers, Code2,
  FileBarChart, Sparkles, Settings, UserRound, Search, Bell, LogOut,
} from "lucide-react";
import { Logo } from "@/components/devpulse/brand";
import { Assistant } from "@/components/devpulse/assistant";
import { getSession, logout } from "@/lib/auth";

export const Route = createFileRoute("/app")({
  ssr: false,
  beforeLoad: ({ location }) => {
    const session = getSession();
    if (!session) throw redirect({ to: "/login", search: { redirect: location.href } });
    return { session };
  },
  pendingComponent: AuthLoading,
  head: () => ({ meta: [
    { title: "Dashboard — DevPulse" },
    { name: "description", content: "Your DevPulse engineering command center." },
    { property: "og:title", content: "Dashboard — DevPulse" },
    { property: "og:description", content: "Your DevPulse engineering command center." },
  ] }),
  component: AppLayout,
});

function AuthLoading() {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex flex-col items-center gap-4 fade-up">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-secondary border-t-foreground" />
        <span className="text-label text-muted-foreground">Verifying session…</span>
      </div>
    </div>
  );
}

const items = [
  { to: "/app", l: "Dashboard", i: LayoutGrid },
  { to: "/app/projects", l: "Projects", i: FolderKanban },
  { to: "/app/requirements", l: "Requirements", i: ClipboardList },
  { to: "/app/sprints", l: "Sprint", i: Timer },
  { to: "/app/tasks", l: "Tasks", i: ListTodo },
  { to: "/app/bugs", l: "Bugs", i: Bug },
  { to: "/app/testing", l: "Testing", i: FlaskConical },
  { to: "/app/analytics", l: "Analytics", i: BarChart3 },
  { to: "/app/code", l: "Code Analytics", i: Code2 },
  { to: "/app/stack", l: "Tech Stack", i: Layers },
  { to: "/app/reports", l: "Reports", i: FileBarChart },
  { to: "/app/ai", l: "AI Assistant", i: Sparkles },
  { to: "/app/settings", l: "Settings", i: Settings },
  { to: "/app/profile", l: "Profile", i: UserRound },
] as const;

const notifications = [
  "BUG-221 escalated to Critical",
  "Sprint 24 review scheduled for Friday",
  "Orion Mobile risk forecast updated",
];

function AppLayout() {
  const { session } = Route.useRouteContext();
  const navigate = useNavigate();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [bell, setBell] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const initials = session.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const hit = items.find((i) => i.l.toLowerCase().includes(q.trim().toLowerCase()));
    if (q.trim() && hit) { navigate({ to: hit.to }); setQ(""); }
    else toast("No matching page", { description: "Try Projects, Bugs, Sprint or Reports." });
  };

  const signOut = async () => {
    logout();
    await router.invalidate();
    navigate({ to: "/login", replace: true });
  };

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-line bg-sidebar p-4 lg:flex">
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
        <button onClick={signOut} className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground">
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-line bg-background/70 px-6 backdrop-blur-xl">
          <form onSubmit={search} className="flex h-10 max-w-md flex-1 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            <input ref={searchRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Jump to a page…" className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground" />
            <kbd className="text-label text-dim">⌘K</kbd>
          </form>
          <div className="relative ml-auto flex items-center gap-3">
            <button aria-label="Notifications" onClick={() => setBell((b) => !b)} className="relative grid h-10 w-10 place-items-center rounded-xl border border-line text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" /><span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-foreground" />
            </button>
            {bell && (
              <div className="glass fade-up absolute right-12 top-12 w-72 rounded-[20px] p-3">
                {notifications.map((n) => <div key={n} className="rounded-xl px-3 py-2.5 text-sm hover:bg-secondary/50">{n}</div>)}
              </div>
            )}
            <Link to="/app/profile" aria-label="Profile" className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">{initials}</Link>
            <button aria-label="Log out" onClick={signOut} className="grid h-10 w-10 place-items-center rounded-xl border border-line text-muted-foreground hover:text-foreground lg:hidden"><LogOut className="h-4 w-4" /></button>
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
