import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5 font-semibold tracking-tight", className)}>
      <span className="relative grid h-7 w-7 place-items-center rounded-lg bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M2 12h4l3-8 6 16 3-8h4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      DevPulse
    </Link>
  );
}

const nav = [
  { to: "/features", label: "Features" },
  { to: "/pricing", label: "Pricing" },
  { to: "/docs", label: "Documentation" },
  { to: "/about", label: "About" },
] as const;

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/login">Login</Link></Button>
          <Button asChild size="sm"><Link to="/signup">Get Started</Link></Button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-12 text-sm text-muted-foreground md:flex-row md:items-center">
        <Logo className="text-foreground" />
        <div className="flex gap-6">
          {nav.map((n) => <Link key={n.to} to={n.to} className="hover:text-foreground">{n.label}</Link>)}
        </div>
        <span>© 2026 DevPulse Inc.</span>
      </div>
    </footer>
  );
}

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteNav />
      {children}
      <SiteFooter />
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-label text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-foreground twinkle" />
      {children}
    </span>
  );
}

export function PageHero({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <section className="relative overflow-hidden">
      <div className="grid-bg absolute inset-0" />
      <div className="relative mx-auto max-w-4xl px-6 pb-16 pt-24 text-center fade-up">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-hero text-shine mt-6">{title}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">{sub}</p>
      </div>
    </section>
  );
}
