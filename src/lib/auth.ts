// Real accounts via Lovable Cloud auth (hashed passwords, signed JWT sessions persisted across refresh).
// Users sign in with username + password; the username maps to an internal, never-mailed address.
import { supabase } from "@/integrations/supabase/client";
import type { Role } from "@/lib/roles";

export type Session = { id: string; username: string; name: string; role: Role };

const USERNAME = /^[a-z0-9_.-]{3,32}$/;
export const normalizeUsername = (u: string) => u.trim().toLowerCase();
export const usernameToEmail = (u: string) => `${normalizeUsername(u)}@users.devpulse.app`;

export function validateSignup(username: string, password: string, role: string) {
  if (!USERNAME.test(normalizeUsername(username))) throw new Error("Username must be 3–32 characters: letters, numbers, . _ -");
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");
  if (!["manager", "developer", "tester"].includes(role)) throw new Error("Choose a role.");
}

export async function getSession(): Promise<Session | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("username, display_name").eq("id", user.id).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", user.id),
  ]);
  const role = (roles?.[0]?.role ?? "developer") as Role;
  const username = profile?.username ?? user.email?.split("@")[0] ?? "user";
  return { id: user.id, username, name: profile?.display_name ?? username, role };
}

export async function login(username: string, password: string) {
  if (!username.trim() || !password) throw new Error("Enter your username and password.");
  const { error } = await supabase.auth.signInWithPassword({ email: usernameToEmail(username), password });
  if (error) throw new Error("Invalid username or password.");
}

export async function signup(name: string, username: string, password: string, role: Role) {
  validateSignup(username, password, role);
  const u = normalizeUsername(username);
  const { data, error } = await supabase.auth.signUp({
    email: usernameToEmail(u),
    password,
    options: { data: { username: u, display_name: name.trim() || u, role } },
  });
  if (error) throw new Error(/registered|exists/i.test(error.message) ? "That username is taken." : error.message);
  if (!data.session) throw new Error("Account created — please sign in.");
}

export async function updateName(id: string, name: string) {
  const { error } = await supabase.from("profiles").update({ display_name: name }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function logout() {
  await supabase.auth.signOut();
}
