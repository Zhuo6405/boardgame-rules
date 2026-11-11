// 首頁：讀取 data/games.json，畫出遊戲卡片。新增遊戲時不需要改這個檔案。
(async function () {
  const list = document.getElementById('game-list');
  if (!list) return;
  try {
    const res = await fetch('data/games.json');
    if (!res.ok) throw new Error(res.status);
    const games = await res.json();
    for (const g of games) {
      const a = document.createElement('a');
      a.className = 'game-card';
      a.href = 'games/' + g.slug + '.html';

      const h = document.createElement('h2');
      h.textContent = g.title;
      const p = document.createElement('p');
      p.textContent = g.summary;

      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = g.players + '・' + g.time + '・難度 ';
      const dots = document.createElement('span');
      dots.className = 'dots';
      dots.textContent = '●'.repeat(g.difficulty) + '○'.repeat(5 - g.difficulty);
      dots.setAttribute('aria-label', g.difficulty + ' / 5');
      meta.appendChild(dots);

      const tags = document.createElement('ul');
      tags.className = 'tags';
      for (const t of g.tags) {
        const li = document.createElement('li');
        li.textContent = t;
        tags.appendChild(li);
      }
      a.append(h, p, meta, tags);
      list.appendChild(a);
    }
  } catch (e) {
    list.textContent = '遊戲清單讀取失敗，請用本機伺服器開啟（見 README）。';
  }
})();
