import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {filterPapers,groupPapers,isHostedPaper} from '../public/paper-library.mjs';
const files = JSON.parse(await readFile(new URL('../public/data/past-papers.json',import.meta.url)));
test('all hosted files survive grouping, without crossing subjects, series or variants', () => {
  const groups=groupPapers(files);
  assert.equal(groups.flatMap(g=>g.files).length,261);
  assert.equal(new Set(groups.flatMap(g=>g.files.map(f=>f.url))).size,261);
  for(const g of groups) for(const f of g.files) assert.deepEqual([f.year,f.session,f.paper,f.code],[g.year,g.session,g.paper,g.code]);
  assert.ok(groups.some(g=>g.paper==='P1R'));
  assert.ok(groups.some(g=>g.session==='May/June/November'));
});
test('a question paper is followed by its matching mark scheme', () => {
  const groups=groupPapers(filterPapers(files,{year:'2026',paper:'P1',session:'May/June'}));
  const cs=groups.find(g=>g.code==='4CP0');
  assert.deepEqual(cs.files.map(f=>f.kind),['Question paper','Mark scheme']);
});
test('Physics papers use the 4PH1 syllabus and have matching mark schemes', () => {
  const physics = files.filter(f => f.subject === 'physics');
  assert.equal(physics.length,96);
  const groups = groupPapers(physics);
  assert.equal(groups.length,48);
  assert.ok(groups.every(g => g.code === '4PH1' && g.files.map(f => f.kind).join(',') === 'Question paper,Mark scheme'));
});
test('search accepts reordered terms, filenames and common file abbreviations', () => {
  for(const search of ['2026 paper 1 qp','qp 2026 paper 1','4cp0-may-june-2026-p1-qp']) {
    const found=filterPapers(files,{search});
    assert.ok(found.some(f=>f.url==='/papers/cs/2026/4cp0-may-june-2026-p1-qp.pdf'));
    assert.ok(found.every(f=>f.kind==='Question paper'));
  }
  assert.equal(filterPapers(files,{search:'no-such-resource'}).length,0);
});
test('combined series and regional variants stay exact when filtered', () => {
  const found=filterPapers(files,{session:'May/June/November',paper:'P1R'});
  assert.equal(found.length,2);
  assert.ok(found.every(f=>f.year==='2020' && f.subject==='language-b'));
});
test('types, ordering, and notes remain intact', () => {
  const data=filterPapers(files,{kind:'Data files'});
  assert.equal(data.length,17);
  assert.equal(data.filter(f=>f.note).length,2);
  assert.equal(groupPapers(files,'new')[0].year,'2026');
  assert.equal(groupPapers(files,'old')[0].year,'2019');

});

test('only downloaded paper paths qualify as library sources', () => {
  assert.equal(files.filter(isHostedPaper).length,261);
  assert.equal(isHostedPaper({...files[0],url:'https://drive.google.com/file/d/example'}),false);
  assert.equal(isHostedPaper({...files[0],sourceKey:'additional'}),false);
  assert.equal(isHostedPaper({...files[0],preview:'https://drive.google.com/file/d/example/preview'}),false);
});
