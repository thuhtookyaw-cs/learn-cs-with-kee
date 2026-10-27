import fs from 'node:fs';
import path from 'node:path';

export function getStoreProducts({ includeDrafts = false } = {}) {
    const products = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content/store-products.json'), 'utf8'));
    return includeDrafts ? products : products.filter(product => product.published !== false);
}
