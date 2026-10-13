import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Pill } from "@/components/devpulse/ui";
import { tasks as initial } from "@/lib/devpulse-data";

export const Route = createFileRoute("/app/tasks")({ component: Page });

type Task = { id: string; t: string; p: string; a: string };

function Page() {
  const [cols, setCols] = useState<Record<string, Task[]>>(() => Object.fromEntries(Object.entries(initial).map(([k, v]) => [k, [...v]])));
  const [drag, setDrag] = useState<{ id: string; from: string } | null>(null);
  const drop = (to: string) => {
    if (!drag || drag.from === to) return;
    setCols((c) => {
      const task = c[drag.from].find((x) => x.id === drag.id)!;
      return { ...c, [drag.from]: c[drag.from].filter((x) => x.id !== drag.id), [to]: [...c[to], task] };
    });
  };
  return (
    <>
      <PageHeader title="Tasks" sub="Drag cards between columns to update status." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(cols).map(([col, list]) => (
          <div key={col} onDragOver={(e) => e.preventDefault()} onDrop={() => drop(col)} className="card-lux min-h-80 p-4">
            <div className="mb-4 flex items-center justify-between px-1 text-sm"><span className="font-medium">{col}</span><span className="text-muted-foreground">{list.length}</span></div>
            <div className="space-y-3">
              {list.map((t) => (
                <div key={t.id} draggable onDragStart={() => setDrag({ id: t.id, from: col })}
                  className="cursor-grab rounded-2xl border border-line bg-surface-2 p-4 transition hover:-translate-y-0.5 hover:border-foreground/20">
                  <div className="text-label text-muted-foreground">{t.id}</div>
                  <div className="mt-1 text-sm">{t.t}</div>
                  <div className="mt-3 flex items-center justify-between"><Pill strong={t.p === "High"}>{t.p}</Pill>
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-secondary text-[11px]">{t.a}</span></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
