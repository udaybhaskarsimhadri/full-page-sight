import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/lib/auth";
import { AuthCard } from "@/components/devpulse/auth-card";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: "Sign in — DevPulse" },
    { name: "description", content: "Sign in to your DevPulse workspace." },
    { property: "og:title", content: "Sign in — DevPulse" },
    { property: "og:description", content: "Sign in to your DevPulse workspace." },
  ] }),
  ssr: false,
  beforeLoad: async () => {
    if (await getSession()) throw redirect({ to: "/app" });
  },
  component: () => <AuthCard mode="login" />,
});
