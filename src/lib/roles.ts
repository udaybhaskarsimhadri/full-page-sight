// Role comes from the user's account (user_roles table). Page access is checked per route in /app's beforeLoad.
export type Role = "manager" | "developer" | "tester";
export const ROLE_LABEL: Record<Role, string> = { manager: "Project Manager", developer: "Developer", tester: "Tester" };

const M: Role[] = ["manager"], MD: Role[] = ["manager", "developer"], MT: Role[] = ["manager", "tester"];
export const PAGE_ROLES: Record<string, Role[]> = {
  "/app/requirements": MT,
  "/app/sprints": MD,
  "/app/testing": MT,
  "/app/analytics": MT,
  "/app/code": MD,
  "/app/stack": MD,
  "/app/reports": MT,
  "/app/teams": M,
};

export const canAccess = (role: Role, path: string) => {
  const p = path.replace(/\/$/, "");
  return !PAGE_ROLES[p] || PAGE_ROLES[p]!.includes(role);
};
