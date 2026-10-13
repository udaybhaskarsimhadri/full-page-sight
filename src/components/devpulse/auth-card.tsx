import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "./brand";
import { DEMO, login, signup } from "@/lib/auth";

const field = "h-12 w-full rounded-2xl border border-line bg-surface-2 px-4 text-sm outline-none transition placeholder:text-dim focus:border-foreground/30";

export function AuthCard({ mode }: { mode: "login" | "signup" }) {
  const nav = useNavigate();
  const isLogin = mode === "login";
  const [name, setName] = useState("");
  const [email, setEmail] = useState(isLogin ? DEMO.email : "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    setTimeout(() => {
      try {
        if (isLogin) login(email, password);
        else signup(name, email, password);
        nav({ to: "/app", replace: true });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setBusy(false);
      }
    }, 350);
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-6">
      <div className="grid-bg absolute inset-0" />
      <div className="glass fade-up relative w-full max-w-md rounded-[20px] p-10">
        <Logo />
        <h1 className="mt-8 text-2xl font-semibold tracking-tight">{isLogin ? "Welcome back" : "Create your workspace"}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{isLogin ? "Sign in to your DevPulse account." : "Start free. No credit card required."}</p>
        <form onSubmit={submit} className="mt-8 space-y-3" noValidate>
          {!isLogin && <input className={field} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />}
          <input className={field} type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <input className={field} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={isLogin ? "current-password" : "new-password"} />
          {error && <p role="alert" className="rounded-xl border border-line bg-secondary/60 px-4 py-2.5 text-sm">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy ? "Please wait…" : isLogin ? "Sign in" : "Create account"}</Button>
        </form>
        {isLogin && <p className="mt-4 text-center text-label text-muted-foreground">Demo: {DEMO.email} / {DEMO.password}</p>}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isLogin ? "New to DevPulse? " : "Already have an account? "}
          <Link to={isLogin ? "/signup" : "/login"} className="text-foreground hover:underline">{isLogin ? "Create account" : "Sign in"}</Link>
        </p>
      </div>
    </div>
  );
}
