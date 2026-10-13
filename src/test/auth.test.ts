import { beforeEach, describe, expect, it } from "vitest";
import { DEMO, getSession, login, logout, signup } from "@/lib/auth";

describe("auth", () => {
  beforeEach(() => localStorage.clear());

  it("rejects a wrong password", () => {
    expect(() => login(DEMO.email, "nope")).toThrow("Invalid email or password.");
    expect(getSession()).toBeNull();
  });

  it("persists the session after login (survives refresh)", () => {
    login(DEMO.email, DEMO.password);
    expect(getSession()?.email).toBe(DEMO.email);
  });

  it("logout clears the session", () => {
    login(DEMO.email, DEMO.password);
    logout();
    expect(getSession()).toBeNull();
  });

  it("signup requires 8+ char password and then allows login", () => {
    expect(() => signup("A", "a@b.co", "short")).toThrow();
    signup("A", "a@b.co", "longenough");
    logout();
    expect(login("a@b.co", "longenough").email).toBe("a@b.co");
  });
});
