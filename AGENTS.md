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
- Auth is client-side (localStorage, `src/lib/auth.ts`); `/app` gates with `ssr: false` + `beforeLoad`. Why: demo auth without a backend; replace with Lovable Cloud auth for real users.
