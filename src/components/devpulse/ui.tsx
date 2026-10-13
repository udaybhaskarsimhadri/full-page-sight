import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("card-lux p-6", className)}>
      {title && (
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function Stat({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div className="card-lux lift p-6">
      <div className="text-label text-muted-foreground">{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
      {delta && <div className="mt-2 text-label text-muted-foreground">{delta}</div>}
    </div>
  );
}

export function Pill({ children, strong }: { children: ReactNode; strong?: boolean }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[12px]",
      strong ? "border-foreground bg-foreground text-background" : "border-line bg-secondary/50 text-muted-foreground")}>
      {children}
    </span>
  );
}

export function Progress({ v }: { v: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div className="h-full rounded-full bg-foreground transition-all duration-700" style={{ width: `${v}%` }} />
    </div>
  );
}

export function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 fade-up">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {sub && <p className="mt-1.5 text-muted-foreground">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line text-left text-label text-muted-foreground">
            {head.map((h) => <th key={h} className="pb-3 pr-4 font-normal">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-line/50 transition-colors last:border-0 hover:bg-secondary/30">
              {r.map((c, j) => <td key={j} className="py-3.5 pr-4">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
