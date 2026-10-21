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
- The custom forest-green Kee logo appears in every header and footer, and in browser icon metadata. The original transparent asset is `public/kee-logo.png`.
- Edexcel IGCSE English Language B (4EB1) is the third class, linked from the homepage, resource library, and existing subject pages. Its page at `/subject/language-b` includes reading and writing focus areas, class enquiries, a searchable past-paper library, and Pearson's official specification and qualification links. Private class materials are requested from Kee; no separate pricing is claimed.
- All three subject pages include 165 curated external resources from Paperlords: 54 CS, 63 ICT, and 48 English Language B files. These are links to files at their original provider, with visible source attribution; PDFs are not republished in this repository. Source, year, session, and type filters work alongside the existing Kee/Google Drive index. PDF previews use Google Docs Viewer with a direct-file fallback; ZIP practical files open directly.
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

Add articles as Markdown files in `content/articles/` and rebuild. Reviewed static page templates live in `lib/design-pages.json`; shared design styles are in `app/globals.css`, `app/refined.css`, `app/playground.css`, `app/brand-class.css`, and `app/resources.css`. Learning-tool interactions live in `public/app.js` and `public/python-worker.js`. Paperlords metadata is a checked snapshot in `public/data/paperlords.json`; see `docs/paperlords-catalogue.md` before updating it.

All twelve page routes were checked for mobile layout. Functional checks covered resource filters, a full quiz and review, circuit signals and wiring, binary scoring and progression, real Python execution/input/stop, and store difficulty selection.

The playground update was also checked at 320px width across all five playground pages. Checks covered warm-up hints and persistence, practice-path switching, Python draft restoration and execution, circuit save/reset/restore, a completed quiz with best-score persistence, and separate practice/arcade scoring.

The logo and third-class update passed a production build. Homepage, library, and English class layouts were checked at 320px without horizontal overflow. Logo loading, mobile menu, resource navigation, and the class enquiry destination were verified.

Paperlords checks covered all 173 source URLs, qualification codes in the first two pages of 154 reachable PDFs, exact PDF duplicates, and document-cover label corrections. Eight records were excluded: one broken link, five files for the previous ICT 4IT0 syllabus, and two exact duplicate CS PDFs. Functional checks covered source counts, existing library counts, year/type filtering, pagination, empty-search recovery, a real rendered PDF preview, ZIP handling, and corrected English regional labels. All three resource pages were checked at 320px width.
