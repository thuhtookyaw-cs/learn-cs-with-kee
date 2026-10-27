import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { prepareQuiz } from '../public/quiz-practice.mjs';

const bank = JSON.parse(fs.readFileSync(new URL('../public/data/quiz.json', import.meta.url), 'utf8'));

test('a quiz keeps ten distinct questions and each correct answer after shuffling', () => {
    const quiz = prepareQuiz(bank, 10, () => .25);
    assert.equal(quiz.length, 10);
    assert.equal(new Set(quiz.map(q => q.q)).size, 10);
    for (const question of quiz) {
        const original = bank.find(q => q.q === question.q);
        assert.equal(question.options.filter(option => option === question.answer).length, 1);
        assert.deepEqual([...question.options].sort(), [...original.options].sort());
    }
    assert.ok(quiz.some(q => q.options.indexOf(q.answer) !== 0), 'the answer must not always stay in position A');
});

test('starting a quiz leaves the original question bank unchanged', () => {
    const before = JSON.stringify(bank);
    const quiz = prepareQuiz(bank, 10, () => .5);
    quiz[0].options.reverse();
    assert.equal(JSON.stringify(bank), before);
});
