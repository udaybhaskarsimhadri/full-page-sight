import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/lib/auth";
import { AuthCard } from "@/components/devpulse/auth-card";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [
    { title: "Create account — DevPulse" },
    { name: "description", content: "Create your DevPulse workspace for free." },
    { property: "og:title", content: "Create account — DevPulse" },
    { property: "og:description", content: "Create your DevPulse workspace for free." },
  ] }),
  ssr: false,
  beforeLoad: async () => {
    if (await getSession()) throw redirect({ to: "/app" });
  },
  component: () => <AuthCard mode="signup" />,
});
