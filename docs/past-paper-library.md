# Downloaded past-paper library

Checked: 22 October 2026.

The main library is hosted directly in `public/papers/`. The public index, `public/data/past-papers.json`, contains relative URLs, file sizes, and SHA-256 hashes. `lib/papers-manifest.json` records every hosted file for deployment checks. No third-party archive credentials are required at runtime.

| Subject | Qualification | Files |
| --- | --- | ---: |
| Computer Science | 4CP0 | 54 |
| ICT | 4IT1 | 63 |
| English Language B | 4EB1 | 48 |
| Total | | 165 |

The resources include question papers, mark schemes, examiner reports, and practical archives. All views and dashboard counts use this downloaded library. The former Drive collection, saved index, API routes, and Google API dependency have been removed.

Qualification references were checked in all reachable PDFs. The catalogue excludes one missing ICT question paper, four previous-syllabus 4IT0 PDFs and their associated ZIP, and two exact duplicate CS mark schemes. Several English 2026 paper variants and a CS November 2020 mark scheme are labelled using their document-cover references. The combined English 2020 series is preserved with a note rather than reassigned to an unsupported date.

All PDFs and archives are stored as downloaded, preserving publisher notices. Fifteen of seventeen practical ZIPs have readable directories. The two original ICT 2020 archives do not have a readable central directory and may be incomplete or multipart files; their entries include a note to ask Kee if extraction fails. Do not describe these two archives as fully validated or repaired.

When updating the library, check the qualification reference, paper variant, session, download status, file type, archive integrity, and SHA-256 hash. Keep file metadata and the deployment manifest consistent. Large files belong in Git-based deployments, not the limited CLI source upload.

## Browsing

Hosted files are displayed in paper sets, matched strictly by subject, qualification code, year, full series label, and exact paper variant. Question papers appear before mark schemes, then practical files and examiner reports. This does not claim every set is complete: only the files in the catalogue are shown. Regional papers and the combined English 2020 series remain distinct. Every library entry must be a downloaded file under `/papers/`; external resource entries are excluded.

Search supports multiple terms in any order and QP/MS/ER aliases. The year, series, paper variant, and file-type filters work together. Reset clears the filters within the hosted collection. Grouping and search checks run with `node --test tests/paper-library.test.mjs`.
