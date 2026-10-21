const typeOrder = ['Question paper', 'Mark scheme', 'Data files', 'Examiner report'];
export const paperLabel = paper => /^P\d+[A-Z]*$/i.test(paper || '') ? `Paper ${paper.slice(1)}` : (paper || 'Supporting files');
const normalise = value => String(value ?? '').toLowerCase().replace(/[-_·/.]/g, ' ').replace(/\s+/g, ' ').trim();
export function filterPapers(files, filters = {}) {
  const terms = normalise(filters.search).split(' ').filter(Boolean);
  return files.filter(file => {
    if (['year','session','paper','kind'].some(key => filters[key] && file[key] !== filters[key])) return false;
    if (filters.library && file.sourceKey !== filters.library) return false;
    const alias = {'Question paper':'qp question papers','Mark scheme':'ms mark schemes','Examiner report':'er examiner reports','Data files':'zip practical files'}[file.kind] || '';
    const text = normalise([file.name, ...(file.folders || []), file.year, file.session, file.kind, file.code, file.paper, paperLabel(file.paper), alias].join(' '));
    return terms.every(term => text.includes(term));
  });
}
export function groupPapers(files, sort = 'new') {
  const groups = new Map();
  for (const file of files) {
    // Only pair files when every qualification, series and variant field agrees.
    const key = file.sourceKey === 'primary'
      ? JSON.stringify([file.subject,file.code,file.year,file.session,file.paper])
      : `additional:${file.url}`;
    if (!groups.has(key)) groups.set(key, {key, year:file.year || '', session:file.session || '', paper:file.paper || '', code:file.code || '', primary:file.sourceKey === 'primary', files:[]});
    groups.get(key).files.push(file);
  }
  const dateOrder = group => Number(group.year || 0) * 12 + (group.session.includes('November') ? 11 : group.session === 'January' ? 1 : group.session ? 6 : 0);
  const title = group => group.primary ? paperLabel(group.paper) : group.files[0].name;
  return [...groups.values()].map(group => ({...group, files:group.files.sort((a,b) => {
    const rank = file => typeOrder.includes(file.kind) ? typeOrder.indexOf(file.kind) : typeOrder.length;
    return rank(a)-rank(b) || a.name.localeCompare(b.name);
  })})).sort((a,b) => sort === 'name'
    ? title(a).localeCompare(title(b),undefined,{numeric:true}) || dateOrder(b)-dateOrder(a)
    : (sort === 'old' ? 1 : -1) * (dateOrder(a)-dateOrder(b)) || title(a).localeCompare(title(b),undefined,{numeric:true}));
}
export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  return bytes < 1048576 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1048576).toFixed(1)} MB`;
}
