---
title: "Trace an algorithm without losing your place"
date: "2026-10-22"
description: "A small loop, a clear trace, and a fresh question to try for Edexcel IGCSE Computer Science."
subject: "Computer Science"
subjectHref: "/subject/cs/"
type: "worked example"
visual: "01 → 27"
topic: "ALGORITHMS · TRACE TABLES"
---

When an algorithm changes a variable more than once, trying to do everything in your head is risky. Write down the value **after each line runs**. The question below is an original practice example.

## The question

What value does this algorithm output?

```text
score ← 2
FOR step ← 1 TO 3
    score ← score * 2 + step
NEXT step
OUTPUT score
```

## Work it through

Start with `score = 2`. The loop runs three times, with `step` equal to 1, then 2, then 3.

1. **Step 1:** `score = 2 × 2 + 1 = 5`.
2. **Step 2:** use the **new** score: `score = 5 × 2 + 2 = 12`.
3. **Step 3:** `score = 12 × 2 + 3 = 27`.

The output is **27**. A useful trace is just three rows: `step 1 → 5`, `step 2 → 12`, `step 3 → 27`. You do not need to copy the whole algorithm into every row.

### The easy mistake

The expression on the right uses the current value of `score`. After the first pass, that value is 5, not the original 2. The arrow means *replace the old value*; it is not a mathematical equation that stays true forever.

## Your turn

Change the first line to `score ← 1` and the loop to `FOR step ← 1 TO 4`. Keep the update line the same. What is the output? Write four intermediate scores before you reveal the answer.

**Check:** the scores are 3, 8, 19, and **42**. If you got 42, you carried the updated value into every new pass.

Try tracing another loop from the [Computer Science paper library](/subject/cs/). If a line is confusing, bring your trace to class and ask Kee to walk through it with you.
