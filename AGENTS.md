<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- All AI calls go through `src/routes/api/ai.ts` → `src/lib/ai/gateway.server.ts` (provider/model configured only there); tool prompts live in `src/lib/ai/prompts.ts`. Why: one swappable, server-side AI service layer with keys never in the browser.
- Prototype data lives only in `src/lib/devpulse-data.ts` (marked SAMPLE); page access per role lives in `PAGE_ROLES` (`src/lib/roles.ts`) and is enforced in `/app` beforeLoad. Why: keeps mock data swappable for a real API and avoids mistaking hidden menus for authorization.
- Auth uses Lovable Cloud (`src/lib/auth.ts`): username maps to a synthetic email, auto-confirm on; profile + role are created by a signup trigger into `profiles`/`user_roles`. Why: username-only login with hashed passwords and JWT sessions.
