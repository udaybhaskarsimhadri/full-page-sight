// Shared AI modes (safe for client + server). Each tool maps to a system prompt.
export const AI_TOOLS = {
  chat: { label: "Chat", placeholder: "Ask anything about your projects…", prompt: "You are Pulse, the DevPulse engineering copilot. Answer concisely and reference the project context when relevant." },
  requirements: { label: "Requirement Generator", placeholder: "Describe the feature or product…", prompt: "Generate: Functional Requirements, Non-Functional Requirements, User Stories (As a… I want… so that…), Acceptance Criteria (Given/When/Then), and SRS sections. Use clear Markdown headings and numbered IDs." },
  sprint: { label: "Sprint Planner", placeholder: "Describe the sprint scope, team and constraints…", prompt: "Produce a sprint plan: Sprint Goals, Sprint Tasks table (task, owner, story points), Sprint Duration, Team Allocation and capacity check. Use real team/project names from context." },
  advisor: { label: "Project Advisor", placeholder: "Which project should I analyze? (e.g. Orion Mobile)", prompt: "Analyze the project data and recommend timeline improvements, resource optimization, risk mitigation and workload balancing. Be specific and quantitative." },
  bug: { label: "Bug Assistant", placeholder: "Paste a bug report, stack trace or logs…", prompt: "Analyze the bug report. Output: Root Cause hypothesis, Severity, Priority, Possible Fixes (with code where useful) and Debugging Suggestions." },
  review: { label: "Code Reviewer", placeholder: "Paste code or attach files…", prompt: "Review the code for Security Issues, Code Smells, Performance Problems, Best Practices, Refactoring Suggestions (with code), and give a Maintainability Score out of 10 with justification." },
  tests: { label: "Test Case Generator", placeholder: "Paste code or describe the feature to test…", prompt: "Generate Unit Tests, Integration Tests, Regression Tests, Edge Cases and Negative Test Cases. Include runnable test code blocks where applicable." },
  docs: { label: "Documentation Generator", placeholder: "What should I document? (SRS, API docs, release notes…)", prompt: "Generate professional engineering documentation in Markdown: SRS, API Documentation, Design Document, User Manual, Release Notes or Test Report as requested. Use the project context." },
  meeting: { label: "Meeting Summarizer", placeholder: "Paste meeting notes or a transcript…", prompt: "Summarize the meeting: Summary, Decisions, Action Items (owner, due date), Assigned Tasks, Risks, Deadlines. Use tables where helpful." },
  health: { label: "Health Explanation", placeholder: "Which project's health should I explain?", prompt: "Explain the project health: why the score changed, main risk factors, critical issues, recommended actions and priority improvements. Ground every claim in the context data." },
} as const;

export type AIMode = keyof typeof AI_TOOLS;
export const isMode = (m: unknown): m is AIMode => typeof m === "string" && m in AI_TOOLS;
