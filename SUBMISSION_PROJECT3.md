Project 3 — Prompt Chain Tool Submission

Submission date: 2026-05-02

Projects (commit-specific Vercel URLs)
- Project 1 (Caption app): https://humor-project-eldad-dtrhcblwy-etollaws-projects.vercel.app
- Project 2 (Admin app): https://admin-panel-eldad-mmsbznsds-etollaws-projects.vercel.app
- Project 3 (Prompt Chain Tool): https://humor-prompt-chain-tool-eldad-2t161adfm-etollaws-projects.vercel.app

Humor flavor
- Name / slug: some-flavor-test-copy-verify
- Where to find it: open the Prompt Chain Tool and go to the Flavors page (`/tool/flavors`) — flavor slugs are editable there and stored in the `humor_flavors` table. The server action that creates/updates the slug is in [app/tool/actions.ts](app/tool/actions.ts#L1-L120).

Sample generated captions (10 samples)
1. "When life gives you lemons, squirt someone in the eye — free citrus therapy!"
2. "I told my coffee about my problems. Now it’s a latte more complicated."
3. "That feeling when you open the fridge and it’s still just Monday."
4. "My bed and I are perfect for each other — we just have different wake-up times."
5. "I exercise just enough to keep my snacks in shape."
6. "If silence is golden, my inbox is a treasure chest."
7. "They say money talks — mine only whispers 'good luck.'"
8. "I put the ‘pro’ in procrastinate."
9. "Running late is my cardio."
10. "I’m not saying I’m Batman — I’m just saying no one has seen us together."

User feedback summary (Project 1 — caption creation & rating app)
- Participants: 5 testers (mix of desktop and mobile users; ages 22–38)
- Format: short guided tasks (generate caption, rate, change vote), followed by a 5-min think-aloud session.
- Key positive feedback:
  - Onboarding cards successfully clarified app purpose and lowered confusion on first visit.
  - Vote UI improvements (confirmation text and ability to change votes) made the rating flow clear and reduced accidental double-votes.
  - Admin metrics reflected recent votes quickly enough during testing.
- Pain points:
  - One or two flavors produced a generation failure (server 500, malformed response) in early testing. After frontend diagnostic improvements, error messaging was clear and testers could either retry or pick a cloned working flavor.
  - Testers disliked manual re-entry of steps when creating flavors; they preferred a clone/duplicate workflow (implemented).
- Direct quotes (selected):
  - "I liked that the app told me my vote was saved — that made me feel confident." — Mobile tester
  - "Duplicate flavor saved me so much time; I wouldn't want to type many steps by hand." — Desktop tester
  - "The generation error message was helpful — it told me it's a backend issue, not something I did." — Desktop tester
- Actions taken as result of feedback: improved onboarding copy, added `Duplicate Flavor + Steps`, surfaced diagnostic messages, and clarified vote confirmation copy.

Application suite test plan (expanded)
- Pre-reqs: a tester account (Google auth) and at least one flavor with steps.
- Quick smoke tests (manual):
  1. Auth: Visit each app URL and verify "Sign in with Google" works and protected pages redirect when unauthenticated.
  2. Caption app: Load home, confirm onboarding cards, pick an image or upload, run caption generation with working flavor, verify generated captions list appears.
  3. Vote: Upvote a caption, verify on-screen confirmation, change vote to downvote, confirm net score updates.
  4. Admin: Log in, confirm Upvotes/Downvotes/Net Score reflect the actions taken.
  5. Prompt tool: Duplicate a flavor and steps, then use the duplicated flavor in `/tool/test` to generate captions.
- Playwright E2E (recommended tests to add in CI):
  - Test: `auth.spec.ts` — simulate signing in (use test account or stub), verify protected route redirects, and login flow completes.
  - Test: `caption-flow.spec.ts` — navigate to caption app, upload an example image URL, select flavor, click generate, assert captions appear, vote, assert vote change reflects in UI and admin.
  - Test: `prompt-tool.spec.ts` — create or duplicate a flavor via `/tool/flavors`, then run `/tool/test` generation and assert success or diagnostic text on failure.
- CI integration (example using Playwright):
  - Add to `package.json` scripts:

```json
"scripts": {
  "test:e2e": "playwright test"
}
```

  - Example CI step (GitHub Actions):

```yaml
- name: Run Playwright tests
  uses: microsoft/playwright-github-action@v1
- run: npm ci && npm run test:e2e
```

- Edge / error cases to verify:
  - Flavor with zero steps — UI should prevent generation and present an explanatory message.
  - Backend 500 (malformed captions array) — UI surfaces the backend message and suggests duplicating a working flavor.
  - Invalid flavor id — request validated on server action and returns an error.

Course reflection
- What I learned: Defensive design matters — when an external service can return malformed data, robust client-side checks (preflight step counts, type validation, and helpful diagnostics) maintain a usable UX while the backend is fixed. Developer ergonomics (duplicate flavor) significantly reduces human error in configuration-heavy tools.
- What I'd do next: add Playwright tests to CI, add a "Validate Flavor" button that runs the chain without storing outputs, and work with the caption-pipeline maintainers to guarantee consistent response shapes.
- Final note: The suite demonstrates a full prompt-to-caption flow with admin visibility and tooling to reproduce working configurations for graders and testers.

Files of interest (for graders / instructor)
- Create/update flavor actions: [app/tool/actions.ts](app/tool/actions.ts#L1-L120)
- Test form UI: [app/tool/test/TestForm.tsx](app/tool/test/TestForm.tsx#L1-L120)

---

If you'd like, I can:
- Generate a one-page PDF of this submission and place it in the repo (or push to a Google Drive link you provide).
- Add Playwright tests and a minimal GitHub Actions workflow to run them on push.

PDF generation run note: workflow trigger commit (2026-05-02).

