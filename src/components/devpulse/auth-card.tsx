import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "./brand";
import { login, signup } from "@/lib/auth";
import { ROLE_LABEL, type Role } from "@/lib/roles";

const field = "h-12 w-full rounded-2xl border border-line bg-surface-2 px-4 text-sm outline-none transition placeholder:text-dim focus:border-foreground/30";

export function AuthCard({ mode }: { mode: "login" | "signup" }) {
  const nav = useNavigate();
  const router = useRouter();
  const isLogin = mode === "login";
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("developer");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (isLogin) await login(username, password);
      else await signup(name, username, password, role);
      await router.invalidate();
      nav({ to: "/app", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-6">
      <div className="grid-bg absolute inset-0" />
      <div className="glass fade-up relative w-full max-w-md rounded-[20px] p-10">
        <Logo />
        <h1 className="mt-8 text-2xl font-semibold tracking-tight">{isLogin ? "Welcome back" : "Create your workspace"}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{isLogin ? "Sign in with your username." : "Start free. No credit card required."}</p>
        <form onSubmit={submit} className="mt-8 space-y-3" noValidate>
          {!isLogin && <input className={field} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />}
          <input className={field} placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoCapitalize="none" />
          <input className={field} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={isLogin ? "current-password" : "new-password"} />
          {!isLogin && (
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Role">
              {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                <button key={r} type="button" role="radio" aria-checked={role === r} onClick={() => setRole(r)}
                  className={`h-11 rounded-2xl border text-xs transition ${role === r ? "border-foreground bg-foreground text-background" : "border-line text-muted-foreground hover:text-foreground"}`}>
                  {ROLE_LABEL[r]}
                </button>
              ))}
            </div>
          )}
          {error && <p role="alert" className="rounded-xl border border-line bg-secondary/60 px-4 py-2.5 text-sm">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy ? "Please wait…" : isLogin ? "Sign in" : "Create account"}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isLogin ? "New to DevPulse? " : "Already have an account? "}
          <Link to={isLogin ? "/signup" : "/login"} className="text-foreground hover:underline">{isLogin ? "Create account" : "Sign in"}</Link>
        </p>
      </div>
    </div>
  );
}
