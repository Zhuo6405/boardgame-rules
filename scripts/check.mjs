// 檢查所有遊戲頁是否符合 CLAUDE.md 的規則。用法：node scripts/check.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SECTIONS = [
  ['goal', '遊戲目標'],
  ['components', '配件'],
  ['setup', '開局設置'],
  ['turn', '回合流程'],
  ['cards', '重要卡牌與規則'],
  ['mistakes', '新手常見錯誤'],
  ['cheatsheet', '速查表'],
];
const errors = [];
const err = (where, msg) => errors.push(`${where}：${msg}`);

const games = JSON.parse(readFileSync(join(root, 'data/games.json'), 'utf8'));
const slugs = new Set();

for (const g of games) {
  const where = `games.json「${g.title ?? g.slug}」`;
  for (const k of ['slug', 'title', 'players', 'time', 'difficulty', 'tags', 'summary']) {
    if (g[k] === undefined) err(where, `缺少欄位 ${k}`);
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(g.slug ?? '')) err(where, 'slug 只能用小寫英數與連字號');
  if (slugs.has(g.slug)) err(where, 'slug 重複');
  slugs.add(g.slug);
  if (!Number.isInteger(g.difficulty) || g.difficulty < 1 || g.difficulty > 5) err(where, 'difficulty 必須是 1 到 5 的整數');
  if (!Array.isArray(g.tags) || g.tags.length < 1 || g.tags.length > 3) err(where, 'tags 必須有 1 到 3 個');
  if ((g.summary ?? '').length > 40) err(where, 'summary 超過 40 個字');

  const file = `games/${g.slug}.html`;
  if (!existsSync(join(root, file))) {
    err(where, `找不到 ${file}`);
    continue;
  }
  const html = readFileSync(join(root, file), 'utf8');
  if (html.includes('TODO')) err(file, '還有沒填完的 TODO');
  if (/style\s*=\s*"/.test(html) || /<style/.test(html)) err(file, '不可以寫行內樣式或 <style>');
  if (!html.includes(`<h1>${g.title}</h1>`)) err(file, 'h1 必須與 games.json 的 title 相同');
  if (!html.includes(`<p class="lead">${g.summary}</p>`)) err(file, '.lead 必須與 games.json 的 summary 相同');
  if (!html.includes(`<meta name="description" content="${g.summary}">`)) err(file, 'meta description 必須與 summary 相同');

  let last = -1;
  for (const [id, title] of SECTIONS) {
    const pos = html.indexOf(`<h2 id="${id}">${title}</h2>`);
    if (pos === -1) err(file, `缺少區塊 <h2 id="${id}">${title}</h2>`);
    else if (pos < last) err(file, `區塊「${title}」順序錯誤`);
    if (pos !== -1) last = pos;
    if (!html.includes(`href="#${id}"`)) err(file, `目錄缺少 #${id} 的連結`);
  }
  const tables = (html.match(/<table/g) ?? []).length;
  const wraps = (html.match(/class="table-wrap"/g) ?? []).length;
  if (tables !== wraps) err(file, '每個表格都要包在 .table-wrap 裡');
}

for (const f of readdirSync(join(root, 'games'))) {
  if (!f.endsWith('.html') || f.startsWith('_')) continue;
  if (!slugs.has(f.replace(/\.html$/, ''))) err(`games/${f}`, '沒有登記在 data/games.json');
}

if (errors.length) {
  console.error(`發現 ${errors.length} 個問題：`);
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}
console.log(`檢查通過：${games.length} 款遊戲都符合規則。`);
