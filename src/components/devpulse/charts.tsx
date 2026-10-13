import {
  Area, AreaChart, Bar, BarChart, Line, LineChart, Pie, PieChart, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { burndown, commits, velocity, languages } from "@/lib/devpulse-data";

const axis = { stroke: "var(--muted-foreground)", fontSize: 11, tickLine: false, axisLine: false };
const tip = {
  contentStyle: { background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 12, fontSize: 12 },
  labelStyle: { color: "var(--muted-foreground)" },
  cursor: { fill: "oklch(1 0 0 / 4%)" },
};

export function VelocityChart({ h = 220 }: { h?: number }) {
  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart data={velocity} barGap={4}>
        <CartesianGrid stroke="var(--line)" vertical={false} />
        <XAxis dataKey="s" {...axis} />
        <YAxis {...axis} width={28} />
        <Tooltip {...tip} />
        <Bar dataKey="planned" fill="var(--chart-4)" radius={[6, 6, 0, 0]} />
        <Bar dataKey="done" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function BurndownChart({ h = 220 }: { h?: number }) {
  return (
    <ResponsiveContainer width="100%" height={h}>
      <LineChart data={burndown}>
        <CartesianGrid stroke="var(--line)" vertical={false} />
        <XAxis dataKey="d" {...axis} />
        <YAxis {...axis} width={28} />
        <Tooltip {...tip} />
        <Line dataKey="ideal" stroke="var(--chart-4)" strokeDasharray="4 4" dot={false} />
        <Line dataKey="actual" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CommitsChart({ h = 220 }: { h?: number }) {
  return (
    <ResponsiveContainer width="100%" height={h}>
      <AreaChart data={commits}>
        <defs>
          <linearGradient id="ca" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--line)" vertical={false} />
        <XAxis dataKey="d" {...axis} />
        <YAxis {...axis} width={28} />
        <Tooltip {...tip} />
        <Area dataKey="c" stroke="var(--chart-1)" strokeWidth={1.5} fill="url(#ca)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const shades = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
export function LanguagesChart({ h = 220 }: { h?: number }) {
  return (
    <ResponsiveContainer width="100%" height={h}>
      <PieChart>
        <Tooltip {...tip} />
        <Pie data={languages} dataKey="v" nameKey="name" innerRadius="60%" outerRadius="90%" stroke="var(--background)" strokeWidth={3}>
          {languages.map((_, i) => <Cell key={i} fill={shades[i]} />)}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
