function shuffled(items, random) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

export function prepareQuiz(bank, count = 10, random = Math.random) {
    return shuffled(bank, random).slice(0, count).map(question => ({
        ...question,
        options: shuffled(question.options, random),
    }));
}
