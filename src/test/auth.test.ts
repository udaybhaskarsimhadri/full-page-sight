import { describe, expect, it } from "vitest";
import { usernameToEmail, validateSignup } from "@/lib/auth";
import { canAccess } from "@/lib/roles";

describe("auth rules", () => {
  it("rejects passwords under 8 characters", () => {
    expect(() => validateSignup("alice", "short", "developer")).toThrow();
    expect(() => validateSignup("alice", "longenough", "developer")).not.toThrow();
  });
  it("usernames are case-insensitive", () => {
    expect(usernameToEmail(" Alice ")).toBe(usernameToEmail("alice"));
  });
  it("only the three roles are allowed", () => {
    expect(() => validateSignup("alice", "longenough", "admin")).toThrow();
  });
});

describe("role access", () => {
  it("developers cannot open test management", () => expect(canAccess("developer", "/app/testing")).toBe(false));
  it("testers cannot open sprints", () => expect(canAccess("tester", "/app/sprints")).toBe(false));
  it("managers can open everything", () => expect(canAccess("manager", "/app/teams")).toBe(true));
});
