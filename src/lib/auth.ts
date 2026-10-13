// Client-side demo auth: users + session token persisted in localStorage.
export type Session = { email: string; name: string; token: string; expiresAt: number };
type User = { email: string; name: string; password: string };

const USERS = "dp_users";
const SESSION = "dp_session";
const TTL = 7 * 24 * 60 * 60 * 1000;
export const DEMO = { email: "demo@devpulse.ai", password: "devpulse123", name: "Uday Bhaskar" };

const store = () => (typeof window === "undefined" ? null : window.localStorage);

function users(): User[] {
  try {
    const list = JSON.parse(store()?.getItem(USERS) ?? "[]") as User[];
    return list.some((u) => u.email === DEMO.email) ? list : [DEMO, ...list];
  } catch {
    return [DEMO];
  }
}

function issue(u: User): Session {
  const token = btoa(`${u.email}:${Date.now()}:${Math.random().toString(36).slice(2)}`);
  const s = { email: u.email, name: u.name, token, expiresAt: Date.now() + TTL };
  store()?.setItem(SESSION, JSON.stringify(s));
  return s;
}

export function getSession(): Session | null {
  try {
    const s = JSON.parse(store()?.getItem(SESSION) ?? "null") as Session | null;
    if (!s || s.expiresAt < Date.now()) return null;
    return s;
  } catch {
    return null;
  }
}

export function login(email: string, password: string): Session {
  const e = email.trim().toLowerCase();
  if (!e || !password) throw new Error("Enter your email and password.");
  const u = users().find((x) => x.email === e);
  if (!u || u.password !== password) throw new Error("Invalid email or password.");
  return issue(u);
}

export function signup(name: string, email: string, password: string): Session {
  const e = email.trim().toLowerCase();
  if (!name.trim()) throw new Error("Enter your name.");
  if (!/^\S+@\S+\.\S+$/.test(e)) throw new Error("Enter a valid email address.");
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");
  const list = users();
  if (list.some((u) => u.email === e)) throw new Error("An account with this email already exists.");
  const u = { email: e, name: name.trim(), password };
  store()?.setItem(USERS, JSON.stringify([...list, u]));
  return issue(u);
}

export function updateName(name: string) {
  const s = getSession();
  if (!s) return;
  store()?.setItem(SESSION, JSON.stringify({ ...s, name }));
  store()?.setItem(USERS, JSON.stringify(users().map((u) => (u.email === s.email ? { ...u, name } : u))));
}

export function logout() {
  store()?.removeItem(SESSION);
}
