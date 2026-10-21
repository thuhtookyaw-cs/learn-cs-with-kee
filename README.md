# Study with Kee

Complete redesign of the existing Next.js teaching website, recovered from its linked GitHub repository.

## What changed

- A consistent warm white and forest green design across the homepage, resource library, store, journal, and all four learning tools.
- Public access to all pages: the vault wrapper and `/api/vault` endpoint have been removed.
- Past papers use only the downloaded files hosted on this website. The Drive integration, its saved index, and its API routes have been removed.
- The journal continues to read Markdown files from `content/articles/`.
- The Python tool runs the original Pyodide runtime in a worker, supports supplied program input, and can stop endless code.
- The circuit lab supports gate wiring, live signals, keyboard movement, and cycle prevention. The quiz uses the original 85-question bank. The binary game increases difficulty as the score rises.
- The playground includes an interactive binary warm-up, three suggested practice paths, illustrated tool previews, and a recent-tool shortcut.
- Python drafts and program input save automatically in this browser. Circuits have explicit save and restore controls. Completed quizzes retain a personal best; the binary arcade retains its high score separately from untimed practice.
- Practice records stay in the current browser and do not sync across devices. Clearing browser storage removes them. Binary practice has no timer or lost lives, and progresses from four to eight bits.
- The custom forest-green Kee logo appears in every header and footer, and in browser icon metadata. The original transparent asset is `public/kee-logo.png`.
- Edexcel IGCSE English Language B (4EB1) is the third class, linked from the homepage, resource library, and existing subject pages. Its page at `/subject/language-b` includes reading and writing focus areas, class enquiries, a searchable past-paper library, and Pearson's official specification and qualification links. Private class materials are requested from Kee; no separate pricing is claimed.
- Edexcel International GCSE Physics (4PH1) is the fourth class. Its page at `/subject/physics` explains the class and groups downloaded question papers with matching mark schemes.
- The main library hosts 261 downloaded resources directly under `public/papers/`: 54 CS, 63 ICT, 48 English Language B, and 96 Physics files. Main-library links and downloads use this website’s own domain. Year, session, type, and paper-variant filters are available; all views and counts use the downloaded library. PDF previews use Google Docs Viewer with a direct-file fallback.
- Home, Library, Playground, Journal, and Store share a simple navigation menu. Library is a homepage section; Playground, Journal, and Store open their own pages directly from the navigation. Homepage file counts use the hosted paper index. Decorative diagonal-arrow glyphs have been removed from page templates and generated content.
- Store prices and the original free sample PDF are retained. Orders are prepared as enquiries to Kee on Telegram; this site does not process payments.

## Run locally

Use Node.js and the checked-in lockfile:

```sh
npm ci
npm run build
npm run start
```

For development, run `npm run dev`.

## Resource source

The library reads only `public/data/past-papers.json` and files under `public/papers/`. It has no Drive API dependency, saved Drive fallback, or Drive credential requirement. PDF previews display these hosted files through Google Docs Viewer, with a direct link to the same hosted PDF.

## Content maintenance

Add articles as Markdown files in `content/articles/` and rebuild. Reviewed static page templates live in `lib/design-pages.json`; shared design styles are in `app/globals.css`, `app/refined.css`, `app/playground.css`, `app/brand-class.css`, `app/resources.css`, and `app/home-hub.css`. Homepage file counts are populated by `lib/home-content.js`. Learning-tool interactions live in `public/app.js` and `public/python-worker.js`. Main-library metadata is in `public/data/past-papers.json`, with file sizes and SHA-256 hashes in `lib/papers-manifest.json`; see `docs/past-paper-library.md` before updating it.

All twelve page routes were checked for mobile layout. Functional checks covered resource filters, a full quiz and review, circuit signals and wiring, binary scoring and progression, real Python execution/input/stop, and store difficulty selection.

The playground update was also checked at 320px width across all five playground pages. Checks covered warm-up hints and persistence, practice-path switching, Python draft restoration and execution, circuit save/reset/restore, a completed quiz with best-score persistence, and separate practice/arcade scoring.

The logo and third-class update passed a production build. Homepage, library, and English class layouts were checked at 320px without horizontal overflow. Logo loading, mobile menu, resource navigation, and the class enquiry destination were verified.

The original three-subject library checks covered 173 candidate URLs, qualification codes in the first two pages of 154 reachable PDFs, exact PDF duplicates, and document-cover label corrections. Eight records were excluded: one broken link, five files for the previous ICT 4IT0 syllabus, and two exact duplicate CS PDFs. All 165 selected files are downloaded locally. The 96 additional Physics PDFs were retrieved from Pearson's public 4PH1 exam-materials archive, checked as readable PDFs, and recorded with file sizes and SHA-256 hashes. Two original ICT 2020 practical archives do not have a readable ZIP central directory; they are retained unchanged with a visible note. Functional checks cover downloaded-library counts, year/type filtering, pagination, search recovery, and direct download paths.

## Deploy the downloaded library

The downloaded assets total about 360 MiB. Deploy from the connected Git repository rather than uploading source files with the Vercel CLI, whose Hobby source-upload limit is 100 MB. Commit and push the complete source and `public/papers/`, then create a production Git deployment using the existing Vercel project and GitHub repository connection. No Drive credentials are required.

Past-paper browsing groups matching files by qualification, year, exact exam series, and paper variant. The browser helper is `public/paper-library.mjs`; run `node --test tests/paper-library.test.mjs` to verify grouping, searching, filters, ordering, and preservation of all hosted files. All four subject libraries have file-type shortcuts, removable filters, paper-number selection, and collapsible phone filters.
