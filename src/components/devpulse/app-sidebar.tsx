import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  LayoutGrid, FolderKanban, ClipboardList, Timer, ListTodo, Bug, FlaskConical, BarChart3, Layers, Code2,
  FileBarChart, Sparkles, Settings, UserRound, LogOut, FileCode2, CalendarRange, Lightbulb, SearchCode,
  ShieldCheck, TestTubeDiagonal, BookOpenText, NotebookPen, PanelLeftClose, PanelLeftOpen, Users, GitBranch,
  type LucideIcon,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { AIMode } from "@/lib/ai/prompts";
import type { Role } from "@/lib/roles";
import { cn } from "@/lib/utils";

type Item = { l: string; i: LucideIcon; to: string; tool?: AIMode; roles?: Role[] };
const M: Role[] = ["manager"], MD: Role[] = ["manager", "developer"], MT: Role[] = ["manager", "tester"];
const sections: { h: string; items: Item[] }[] = [
  { h: "Main", items: [{ l: "Dashboard", i: LayoutGrid, to: "/app" }] },
  { h: "Project Management", items: [
    { l: "Projects", i: FolderKanban, to: "/app/projects" },
    { l: "Teams", i: Users, to: "/app/teams" },
    { l: "GitHub Repositories", i: GitBranch, to: "/app/repos" },
    { l: "Requirements", i: ClipboardList, to: "/app/requirements", roles: MT },
    { l: "Sprint Management", i: Timer, to: "/app/sprints", roles: MD },
    { l: "Tasks", i: ListTodo, to: "/app/tasks" },
    { l: "Bug Tracking", i: Bug, to: "/app/bugs" },
    { l: "Test Management", i: FlaskConical, to: "/app/testing", roles: MT },
  ] },
  { h: "Analytics", items: [
    { l: "Project Analytics", i: BarChart3, to: "/app/analytics", roles: MT },
    { l: "Code Analytics", i: Code2, to: "/app/code", roles: MD },
    { l: "Technology Stack Analyzer", i: Layers, to: "/app/stack", roles: MD },
    { l: "Reports", i: FileBarChart, to: "/app/reports", roles: MT },
  ] },
  { h: "AI Tools", items: [
    { l: "AI Assistant", i: Sparkles, to: "/app/ai", tool: "chat" },
    { l: "AI Requirement Generator", i: FileCode2, to: "/app/ai", tool: "requirements", roles: MT },
    { l: "AI Sprint Planner", i: CalendarRange, to: "/app/ai", tool: "sprint", roles: MD },
    { l: "AI Project Advisor", i: Lightbulb, to: "/app/ai", tool: "advisor", roles: M },
    { l: "AI Bug Assistant", i: SearchCode, to: "/app/ai", tool: "bug" },
    { l: "AI Code Reviewer", i: ShieldCheck, to: "/app/ai", tool: "review", roles: MD },
    { l: "AI Test Case Generator", i: TestTubeDiagonal, to: "/app/ai", tool: "tests", roles: MT },
    { l: "AI Documentation Generator", i: BookOpenText, to: "/app/ai", tool: "docs" },
    { l: "AI Meeting Summarizer", i: NotebookPen, to: "/app/ai", tool: "meeting", roles: M },
  ] },
  { h: "Account", items: [
    { l: "Profile", i: UserRound, to: "/app/profile" },
    { l: "Settings", i: Settings, to: "/app/settings" },
  ] },
];

/** Flat list of page destinations, used by the header's jump-to search. */
export const navPages = sections.flatMap((s) => s.items);

const rowCls = (active: boolean, collapsed: boolean) => cn(
  "group/item relative flex h-10 items-center gap-3 rounded-xl text-sm transition-all duration-200",
  collapsed ? "justify-center px-0" : "px-3",
  active ? "bg-sidebar-accent text-foreground shadow-[inset_0_0_0_1px_var(--line)]" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
);

function Tip({ show, label, children }: { show: boolean; label: string; children: ReactNode }) {
  if (!show) return <>{children}</>;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={12}>{label}</TooltipContent>
    </Tooltip>
  );
}

export function AppSidebar({ collapsed, onToggle, onLogout, role }: { collapsed: boolean; onToggle: () => void; onLogout: () => void; role: Role }) {
  const loc = useRouterState({ select: (s) => s.location });
  const currentTool = (loc.search as { tool?: string }).tool ?? "chat";
  const isActive = (it: Item) => it.tool ? loc.pathname === "/app/ai" && currentTool === it.tool : loc.pathname === it.to || (loc.pathname === `${it.to}/` );

  return (
    <TooltipProvider delayDuration={150}>
      <aside
        style={{ width: collapsed ? 80 : 280 }}
        className="fixed inset-y-0 left-0 z-50 flex flex-col border-r border-line bg-sidebar/90 backdrop-blur-xl transition-[width] duration-300 ease-[cubic-bezier(.2,.8,.2,1)]"
      >
        <div className={cn("flex h-16 shrink-0 items-center border-b border-line", collapsed ? "justify-center" : "justify-between px-5")}>
          <Link to="/app" className="flex items-center gap-2.5 font-semibold tracking-tight" aria-label="DevPulse home">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M2 12h4l3-8 6 16 3-8h4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {!collapsed && <span className="fade-up">DevPulse</span>}
          </Link>
          {!collapsed && (
            <button onClick={onToggle} aria-label="Collapse sidebar" className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground">
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 [scrollbar-width:thin]">
          {collapsed && (
            <Tip show label="Expand sidebar">
              <button onClick={onToggle} aria-label="Expand sidebar" className={cn(rowCls(false, true), "mb-3 w-full")}>
                <PanelLeftOpen className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </button>
            </Tip>
          )}
          {sections.map((sec) => ({ ...sec, items: sec.items.filter((it) => !it.roles || it.roles.includes(role)) })).map((s) => (
            <div key={s.h} className="mb-5">
              {collapsed ? <div className="mx-auto mb-2 h-px w-6 bg-line" /> : (
                <div className="mb-2 px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-dim">{s.h}</div>
              )}
              <div className="space-y-0.5">
                {s.items.map((it) => {
                  const active = isActive(it);
                  const I = it.i;
                  return (
                    <Tip key={it.l} show={collapsed} label={it.l}>
                      <Link
                        to={it.to}
                        {...(it.tool ? { search: { tool: it.tool } } : {})}
                        activeOptions={{ exact: true, includeSearch: false }}
                        aria-label={collapsed ? it.l : undefined}
                        aria-current={active ? "page" : undefined}
                        className={rowCls(active, collapsed)}
                      >
                        {active && <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-foreground" />}
                        <I className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover/item:scale-110" strokeWidth={1.75} />
                        {!collapsed && <span className="truncate">{it.l}</span>}
                      </Link>
                    </Tip>
                  );
                })}
                {s.h === "Account" && (
                  <Tip show={collapsed} label="Logout">
                    <button onClick={onLogout} aria-label="Logout" className={cn(rowCls(false, collapsed), "w-full")}>
                      <LogOut className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover/item:scale-110" strokeWidth={1.75} />
                      {!collapsed && <span>Logout</span>}
                    </button>
                  </Tip>
                )}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </TooltipProvider>
  );
}
