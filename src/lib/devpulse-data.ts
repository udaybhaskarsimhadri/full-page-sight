export const velocity = [
  { s: "S18", planned: 42, done: 38 }, { s: "S19", planned: 45, done: 44 },
  { s: "S20", planned: 48, done: 41 }, { s: "S21", planned: 50, done: 49 },
  { s: "S22", planned: 52, done: 51 }, { s: "S23", planned: 55, done: 53 },
  { s: "S24", planned: 58, done: 57 },
];
export const burndown = Array.from({ length: 14 }, (_, i) => ({
  d: `D${i + 1}`, ideal: Math.round(80 - (80 / 13) * i), actual: Math.max(0, Math.round(80 - (80 / 13) * i + Math.sin(i) * 7 + (i < 7 ? 4 : -2))),
}));
export const commits = Array.from({ length: 30 }, (_, i) => ({ d: i + 1, c: Math.round(40 + Math.sin(i / 2.5) * 18 + (i % 7) * 3) }));

export const projects = [
  { name: "Atlas Payments", lead: "M. Chen", progress: 78, health: "Healthy", sprint: "S24", team: 12, budget: "$420k", due: "Dec 12" },
  { name: "Orion Mobile", lead: "S. Patel", progress: 54, health: "At risk", sprint: "S11", team: 8, budget: "$260k", due: "Jan 30" },
  { name: "Nova Data Lake", lead: "A. Ruiz", progress: 91, health: "Healthy", sprint: "S31", team: 15, budget: "$610k", due: "Nov 02" },
  { name: "Helix Auth v3", lead: "J. Kim", progress: 33, health: "Watch", sprint: "S04", team: 6, budget: "$140k", due: "Feb 18" },
  { name: "Vega Search", lead: "L. Okafor", progress: 66, health: "Healthy", sprint: "S16", team: 9, budget: "$310k", due: "Dec 28" },
];

export const tasks = {
  Backlog: [
    { id: "DP-412", t: "Rate limiter for public API", p: "Medium", a: "JK" },
    { id: "DP-418", t: "Audit log export to S3", p: "Low", a: "AR" },
  ],
  "In Progress": [
    { id: "DP-389", t: "Migrate ledger to event sourcing", p: "High", a: "MC" },
    { id: "DP-401", t: "Offline sync for mobile", p: "High", a: "SP" },
    { id: "DP-405", t: "SSO SCIM provisioning", p: "Medium", a: "JK" },
  ],
  Review: [{ id: "DP-377", t: "Query planner cache", p: "Medium", a: "LO" }],
  Done: [
    { id: "DP-360", t: "Webhook retries w/ backoff", p: "High", a: "MC" },
    { id: "DP-366", t: "Dark-launch flags", p: "Low", a: "AR" },
  ],
} as const;

export const bugs = [
  { id: "BUG-221", t: "Race condition in settlement worker", sev: "Critical", status: "Open", env: "prod", age: "2h" },
  { id: "BUG-218", t: "Token refresh loop on Safari", sev: "High", status: "Triaged", env: "prod", age: "1d" },
  { id: "BUG-214", t: "Pagination skips last record", sev: "Medium", status: "In fix", env: "staging", age: "3d" },
  { id: "BUG-209", t: "Tooltip overflow on small screens", sev: "Low", status: "Open", env: "prod", age: "5d" },
  { id: "BUG-201", t: "Memory leak in ingest pipeline", sev: "High", status: "Verified", env: "staging", age: "6d" },
];

export const tests = [
  { suite: "Payments · unit", pass: 1284, fail: 3, cov: 92 },
  { suite: "Auth · integration", pass: 312, fail: 0, cov: 88 },
  { suite: "Mobile · e2e", pass: 146, fail: 7, cov: 71 },
  { suite: "Search · contract", pass: 98, fail: 1, cov: 84 },
];

export const stack = [
  { cat: "Frontend", items: ["React 19", "TypeScript 5.6", "Tailwind 4", "Vite 7"] },
  { cat: "Backend", items: ["Go 1.23", "Node 22", "gRPC", "GraphQL"] },
  { cat: "Data", items: ["PostgreSQL 16", "Redis 7", "ClickHouse", "Kafka"] },
  { cat: "Infra", items: ["Kubernetes", "Terraform", "AWS", "Cloudflare"] },
  { cat: "Quality", items: ["Vitest", "Playwright", "SonarQube", "k6"] },
  { cat: "AI", items: ["PyTorch", "vLLM", "LangGraph", "pgvector"] },
];

export const languages = [
  { name: "TypeScript", v: 44 }, { name: "Go", v: 27 }, { name: "Python", v: 15 }, { name: "SQL", v: 8 }, { name: "Other", v: 6 },
];

