# Paperlords resource catalogue

Source: https://www.paperlords.org/igcse

Checked: 22 October 2026.

The snapshot in `public/data/paperlords.json` contains external links and metadata. The papers remain at Paperlords' public archive/storage providers. No paper PDFs or ZIP archives are included in the website source.

| Subject | Qualification | Included files |
| --- | --- | ---: |
| Computer Science | 4CP0 | 54 |
| ICT | 4IT1 | 63 |
| English Language B | 4EB1 | 48 |
| Total | | 165 |

The 165 resources comprise question papers, mark schemes, examiner reports, and practical data files. They are not 165 question papers. The original Kee/Google Drive library is a separate source and may hold alternative copies of the same exam papers. The source filter lets students choose which provider to browse.

## Verification and exclusions

- Checked all 173 public links in Paperlords' index for the three subjects. 172 returned HTTP 200; the ICT May/June 2022 Paper 2 question-paper link returned 404 and was omitted.
- Checked qualification codes in the first two pages of all 154 reachable PDFs. All current-syllabus PDFs contained the expected subject code. Four ICT May/June 2018 PDFs were for the previous 4IT0 syllabus; these and the associated practical ZIP were omitted from the 4IT1 catalogue.
- Removed two byte-identical CS mark-scheme copies from May/June 2021 and May/June 2022. The copies labelled Paper 2A were retained.
- Corrected English May/June 2026 labels using the document covers: the question paper listed as P2 is Paper 1 (4EB1/01); the mark scheme listed as P2 is Paper 1R (4EB1/01R); the question paper listed as P1 is Paper 1R (4EB1/01R).
- The CS November 2020 mark scheme listed as P2 identifies 4CP0/2A on its cover and is labelled Paper 2A here.
- Preserved Paperlords' combined May/June/November 2020 English session label, with a visible note. Question-paper cover dates and mark-scheme series labels differ for those files; they are not silently reassigned to a single session.
- Normalised May, June, and MayJune archive labels to the May/June exam series. Original source session and paper labels remain in metadata for traceability.

## Maintenance

This is a dated snapshot, not an automatic synchronisation or a live connection to Paperlords' database. Recheck source links and PDF cover references when adding or changing records. Keep attribution and the original-file link. Preserve the distinction between qualification codes, paper variants, resource types, and the combined 2020 English series. Update the checked date only after verification.

The website does not store or require a Paperlords account or API credential. Browser requests load only this local JSON snapshot, plus the existing Kee resource API. PDF previews send the public file URL to Google Docs Viewer; the direct-file link remains available if that viewer cannot load a document.
