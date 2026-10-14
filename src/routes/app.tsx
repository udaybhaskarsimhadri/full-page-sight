import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Search, Bell, ChevronDown } from "lucide-react";
import { teams } from "@/lib/devpulse-data";
import { ROLE_LABEL, canAccess } from "@/lib/roles";
import { AppSidebar, navPages } from "@/components/devpulse/app-sidebar";
import { Assistant } from "@/components/devpulse/assistant";
import { AIChatProvider } from "@/components/devpulse/ai-chat";
import { getSession, logout } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const session = await getSession();
    if (!session) throw redirect({ to: "/login" });
    if (!canAccess(session.role, location.pathname)) throw redirect({ to: "/app" });
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
  const [collapsed, setCollapsed] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [role, setRoleState] = useState<Role>("manager");
  const [team, setTeam] = useState<string>(teams[0].id);
  const [menu, setMenu] = useState<"team" | "user" | null>(null);
  useEffect(() => { setRoleState(getRole()); const t = window.localStorage.getItem("dp_team"); if (t && teams.some((x) => x.id === t)) setTeam(t); }, []);
  const pickRole = (r: Role) => { setRole(r); setRoleState(r); setMenu(null); toast(`Viewing as ${ROLE_LABEL[r]}`, { description: "UI preview only — permissions are not enforced yet." }); };
  const pickTeam = (id: string) => { setTeam(id); window.localStorage.setItem("dp_team", id); setMenu(null); };
  const teamName = teams.find((t) => t.id === team)?.name ?? teams[0].name;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const saved = window.localStorage.getItem("dp_sidebar");
    setNarrow(mq.matches);
    setCollapsed(mq.matches || saved === "collapsed");
    const onChange = () => { setNarrow(mq.matches); if (mq.matches) setCollapsed(true); };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => setCollapsed((c) => {
    const next = !c;
    if (!narrow) window.localStorage.setItem("dp_sidebar", next ? "collapsed" : "expanded");
    return next;
  });
  const initials = session.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const search = (e: FormEvent) => {
    e.preventDefault();
    const hit = navPages.find((i) => i.l.toLowerCase().includes(q.trim().toLowerCase()));
    if (q.trim() && hit) { navigate({ to: hit.to, ...(hit.tool ? { search: { tool: hit.tool } } : {}) }); setQ(""); }
    else toast("No matching page", { description: "Try Projects, Bugs, Sprint or Reports." });
  };

  const signOut = async () => {
    logout();
    await router.invalidate();
    navigate({ to: "/login", replace: true });
  };

  return (
    <AIChatProvider>
    <div className="min-h-screen">
      <AppSidebar collapsed={collapsed} onToggle={toggle} onLogout={signOut} role={role} />
      {narrow && !collapsed && <button aria-label="Close sidebar" onClick={toggle} className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm fade-up" />}
      <div className="min-w-0 transition-[margin] duration-300 ease-[cubic-bezier(.2,.8,.2,1)]" style={{ marginLeft: narrow || collapsed ? 80 : 280 }}>
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-line bg-background/70 px-6 backdrop-blur-xl">
          <div className="relative">
            <button onClick={() => setMenu((m) => (m === "team" ? null : "team"))} className="flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm">
              <span className="grid h-5 w-5 place-items-center rounded-md bg-foreground text-[10px] font-bold text-background">{teamName[0]}</span>
              <span className="hidden max-w-36 truncate sm:inline">{teamName}</span><ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            {menu === "team" && (
              <div className="glass fade-up absolute left-0 top-12 z-50 w-60 rounded-[20px] p-2">
                <div className="px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-dim">Teams</div>
                {teams.map((t) => (
                  <button key={t.id} onClick={() => pickTeam(t.id)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-secondary/50 ${t.id === team ? "text-foreground" : "text-muted-foreground"}`}>
                    {t.name}<span className="text-label text-dim">{t.members.length}</span>
                  </button>
                ))}
                <Link to="/app/teams" onClick={() => setMenu(null)} className="mt-1 block rounded-xl border-t border-line px-3 py-2 text-sm text-muted-foreground hover:text-foreground">Manage teams</Link>
              </div>
            )}
          </div>
          <form onSubmit={search} className="flex h-10 max-w-md flex-1 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            <input ref={searchRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Jump to a page…" className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground" />
            <kbd className="text-label text-dim">⌘K</kbd>
          </form>
          <div className="relative ml-auto flex items-center gap-3">
            <button aria-label="Notifications" onClick={() => { setBell((b) => !b); setMenu(null); }} className="relative grid h-10 w-10 place-items-center rounded-xl border border-line text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" /><span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-foreground" />
            </button>
            {bell && (
              <div className="glass fade-up absolute right-12 top-12 w-72 rounded-[20px] p-3">
                {notifications.map((n) => <div key={n} className="rounded-xl px-3 py-2.5 text-sm hover:bg-secondary/50">{n}</div>)}
              </div>
            )}
            <span className="hidden rounded-full border border-line px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground md:inline">Sample data</span>
            <button aria-label="Account menu" onClick={() => setMenu((m) => (m === "user" ? null : "user"))} className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">{initials}</button>
            {menu === "user" && (
              <div className="glass fade-up absolute right-0 top-12 z-50 w-64 rounded-[20px] p-2">
                <div className="px-3 py-2"><div className="text-sm font-medium">{session.name}</div><div className="text-label text-muted-foreground">{session.email}</div></div>
                <div className="px-3 pb-1 pt-2 text-[11px] uppercase tracking-[0.14em] text-dim">View as (UI preview)</div>
                {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                  <button key={r} onClick={() => pickRole(r)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-secondary/50 ${r === role ? "text-foreground" : "text-muted-foreground"}`}>
                    {ROLE_LABEL[r]}{r === role && <span className="h-1.5 w-1.5 rounded-full bg-foreground" />}
                  </button>
                ))}
                <div className="my-1 h-px bg-line" />
                <Link to="/app/profile" onClick={() => setMenu(null)} className="block rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground">Profile</Link>
                <button onClick={signOut} className="w-full rounded-xl px-3 py-2 text-left text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground">Log out</button>
              </div>
            )}
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-6 md:p-10"><Outlet /></main>
      </div>
      <Assistant />
    </div>
    </AIChatProvider>
  );
}
