// UI-only role preference. NOT authorization — real permissions must be enforced by the backend (Phase 2).
export type Role = "manager" | "developer" | "tester";
export const ROLE_LABEL: Record<Role, string> = { manager: "Project Manager", developer: "Developer", tester: "Tester" };
const KEY = "dp_role";
export const getRole = (): Role => {
  const r = typeof window === "undefined" ? null : window.localStorage.getItem(KEY);
  return r === "developer" || r === "tester" ? r : "manager";
};
export const setRole = (r: Role) => window.localStorage.setItem(KEY, r);
