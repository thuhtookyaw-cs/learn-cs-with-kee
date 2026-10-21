# Learn CS with Kee

Complete redesign of the existing Next.js teaching website, recovered from its linked GitHub repository.

## What changed

- A consistent warm white and forest green design across the homepage, resource library, store, journal, and all four learning tools.
- Public access to all pages: the vault wrapper and `/api/vault` endpoint have been removed.
- Live Google Drive resources remain connected through the original `/api/files` backend. A saved index is available if the live API is temporarily unavailable; the library labels this fallback.
- The journal continues to read Markdown files from `content/articles/`.
- The Python tool runs the original Pyodide runtime in a worker, supports supplied program input, and can stop endless code.
- The circuit lab supports gate wiring, live signals, keyboard movement, and cycle prevention. The quiz uses the original 85-question bank. The binary game increases difficulty as the score rises.
- The playground includes an interactive binary warm-up, three suggested practice paths, illustrated tool previews, and a recent-tool shortcut.
- Python drafts and program input save automatically in this browser. Circuits have explicit save and restore controls. Completed quizzes retain a personal best; the binary arcade retains its high score separately from untimed practice.
- Practice records stay in the current browser and do not sync across devices. Clearing browser storage removes them. Binary practice has no timer or lost lives, and progresses from four to eight bits.
- Store prices and the original free sample PDF are retained. Orders are prepared as enquiries to Kee on Telegram; this site does not process payments.

## Run locally

Use Node.js and the checked-in lockfile:

```sh
npm ci
npm run build
npm run start
```

For development, run `npm run dev`.

## Resource connection

Keep the existing Vercel environment variables. Google Drive uses `DRIVE_CS_FOLDER_ID`, `DRIVE_ICT_FOLDER_ID`, and either `GOOGLE_CREDENTIALS_BASE64` or the pair `GOOGLE_SERVICE_ACCOUNT_EMAIL` / `GOOGLE_PRIVATE_KEY`. Credentials are server-only and are not included in this source backup. Without local credentials the library uses the saved index.

## Content maintenance

Add articles as Markdown files in `content/articles/` and rebuild. Reviewed static page templates live in `lib/design-pages.json`; shared design styles are in `app/globals.css`, `app/refined.css`, and `app/playground.css`. Learning-tool interactions live in `public/app.js` and `public/python-worker.js`.

All twelve page routes were checked for mobile layout. Functional checks covered resource filters, a full quiz and review, circuit signals and wiring, binary scoring and progression, real Python execution/input/stop, and store difficulty selection.

The playground update was also checked at 320px width across all five playground pages. Checks covered warm-up hints and persistence, practice-path switching, Python draft restoration and execution, circuit save/reset/restore, a completed quiz with best-score persistence, and separate practice/arcade scoring.
