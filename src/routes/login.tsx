import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/devpulse/auth-card";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: "Sign in — DevPulse" },
    { name: "description", content: "Sign in to your DevPulse workspace." },
    { property: "og:title", content: "Sign in — DevPulse" },
    { property: "og:description", content: "Sign in to your DevPulse workspace." },
  ] }),
  component: () => <AuthCard mode="login" />,
});
