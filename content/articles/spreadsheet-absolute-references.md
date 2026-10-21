---
title: "One formula, many rows: spreadsheet references"
date: "2026-10-22"
description: "See exactly why a tax-rate cell needs dollar signs when you copy a formula down."
subject: "ICT"
subjectHref: "/subject/ict/"
type: "worked example"
visual: "B2 × $F$1"
topic: "SPREADSHEETS · FORMULAS"
---

In a spreadsheet, some cell references should move when you copy a formula. Others should stay fixed. This original example shows both in one line.

## The question

A shop lists prices before tax in column B. Cell `B2` contains **12**, `B3` contains **8**, and `F1` contains a tax rate of **15%**. Put a formula in `C2` for the price including tax, then copy it to `C3`.

## Build the formula

The price including tax is `price × (1 + tax rate)`, so enter:

```text
=B2*(1+$F$1)
```

`B2` is a **relative reference**. Copy the formula down one row and it becomes `B3`, so the second item uses its own price.

`$F$1` is an **absolute reference**. The dollar signs lock both its column and row, so every item keeps using the tax rate in `F1`.

Now calculate:

1. `C2 = 12 × (1 + 0.15) = 13.80`.
2. After copying down, `C3` contains `=B3*(1+$F$1)`.
3. `C3 = 8 × 1.15 = 9.20`.

### The easy mistake

If you write `=B2*(1+F1)` and copy it down, `F1` changes to `F2`. A blank `F2` can produce an answer that looks plausible but leaves out the tax. Always check both the **formula** and the **result** in the copied cell.

## Your turn

Cell `B4` contains **20**. What formula appears in `C4` after copying down, and what is the result?

**Check:** `=B4*(1+$F$1)` gives **23.00**. The price reference moves to row 4; the tax-rate reference stays in `F1`.

For more practice, open the [ICT paper and practical-file library](/subject/ict/). In class, you can test the formula in a real workbook with Kee.
