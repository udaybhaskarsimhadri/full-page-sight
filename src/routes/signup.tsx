import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/devpulse/auth-card";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [
    { title: "Create account — DevPulse" },
    { name: "description", content: "Create your DevPulse workspace for free." },
    { property: "og:title", content: "Create account — DevPulse" },
    { property: "og:description", content: "Create your DevPulse workspace for free." },
  ] }),
  component: () => <AuthCard mode="signup" />,
});
