import { Link, useNavigate } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "./brand";

const field = "h-12 w-full rounded-2xl border border-line bg-surface-2 px-4 text-sm outline-none transition placeholder:text-dim focus:border-foreground/30";

export function AuthCard({ mode }: { mode: "login" | "signup" }) {
  const nav = useNavigate();
  const submit = (e: FormEvent) => { e.preventDefault(); nav({ to: "/app" }); };
  const isLogin = mode === "login";
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-6">
      <div className="grid-bg absolute inset-0" />
      <div className="glass fade-up relative w-full max-w-md rounded-[20px] p-10">
        <Logo />
        <h1 className="mt-8 text-2xl font-semibold tracking-tight">{isLogin ? "Welcome back" : "Create your workspace"}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{isLogin ? "Sign in to your DevPulse account." : "Start free. No credit card required."}</p>
        <form onSubmit={submit} className="mt-8 space-y-3">
          {!isLogin && <input className={field} placeholder="Full name" required />}
          <input className={field} type="email" placeholder="you@company.com" required />
          <input className={field} type="password" placeholder="Password" required />
          <Button type="submit" size="lg" className="w-full">{isLogin ? "Sign in" : "Create account"}</Button>
          <Button type="button" variant="outline" size="lg" className="w-full" onClick={() => nav({ to: "/app" })}>Continue with SSO</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isLogin ? "New to DevPulse? " : "Already have an account? "}
          <Link to={isLogin ? "/signup" : "/login"} className="text-foreground hover:underline">{isLogin ? "Create account" : "Sign in"}</Link>
        </p>
      </div>
    </div>
  );
}
