# CLAUDE.md

這份文件是給 AI 助理看的專案規則。開始任何修改前請先讀完。

## 專案目的

「桌遊規則講義」是一個靜態網站，每款桌遊一頁，讓沒玩過的人在十分鐘內看懂規則，並且可以邊玩邊查。
讀者是第一次接觸這款遊戲的朋友，所以重點是「看得懂、找得到」，不是把說明書完整搬過來。

- 網站：https://zhuo6405.github.io/boardgame-rules/
- 部署：GitHub Pages，直接發布 `main` 分支的根目錄，沒有建置步驟。

## 專案結構

```
index.html            首頁，卡片由 assets/site.js 讀 data/games.json 產生
data/games.json       所有遊戲的清單（首頁唯一的資料來源）
games/_template.html  新遊戲頁的範本
games/<slug>.html     每款遊戲一頁
assets/style.css      全站唯一的樣式表
assets/site.js        首頁產生卡片用的腳本
scripts/check.mjs     檢查所有頁面是否符合本文件的規則
```

## 新增一款遊戲（最常見的工作）

依序做這四步，缺一不可：

1. 複製 `games/_template.html` 為 `games/<slug>.html`。
2. 把所有 `TODO` 換成內容，並刪掉範本裡的 HTML 註解。
3. 在 `data/games.json` 陣列的最後加一筆資料。
4. 執行 `node scripts/check.mjs`，全部通過才算完成。

不需要修改 `index.html`、`assets/site.js` 或 `assets/style.css`。

### slug 命名

- 只用小寫英文、數字和連字號，例如 `fengsheng`、`bang`、`love-letter`。
- 中文遊戲用漢語拼音，英文遊戲用原名的小寫。
- 檔名、`games.json` 的 `slug`、首頁連結三者必須完全相同。

### games.json 的欄位

```json
{
  "slug": "love-letter",
  "title": "情書",
  "players": "2–4 人",
  "time": "約 20 分鐘",
  "difficulty": 1,
  "tags": ["推理", "卡牌"],
  "summary": "一句話介紹，40 個字以內。"
}
```

- `difficulty` 是 1 到 5 的整數：1 是五分鐘教得完，5 是需要讀完整本說明書。
- `tags` 最多三個，優先沿用已經出現過的標籤。
- `summary` 必須和該遊戲頁的 `.lead` 段落、`<meta name="description">` 一字不差。
- 數字範圍用半形連接號 `–`（例如 `3–9 人`）。

## 遊戲頁的固定格式

每一頁都必須有下面七個區塊，順序、標題文字與 `id` 都不能改。沒有內容可寫時，寫「這款遊戲沒有」，不要刪掉區塊。

| 順序 | 標題 | id | 內容與格式 |
|---|---|---|---|
| 1 | 遊戲目標 | `goal` | 怎麼贏、怎麼輸。有多個陣營時用表格（身份｜怎麼贏） |
| 2 | 配件 | `components` | 條列盒子裡有什麼 |
| 3 | 開局設置 | `setup` | `ol.steps` 步驟；依人數不同的配置用表格 |
| 4 | 回合流程 | `turn` | `ol.steps` 步驟；補充規則用 `h3` |
| 5 | 重要卡牌與規則 | `cards` | 表格（牌｜什麼時候用｜效果），最多 12 列 |
| 6 | 新手常見錯誤 | `mistakes` | `.note.warn` 內的條列，3 到 5 條 |
| 7 | 速查表 | `cheatsheet` | `.cheat` 內的條列，最多 6 條，每條以粗體標籤開頭 |

區塊之前固定是：`h1` 遊戲名稱、`.lead` 一句話介紹、`.facts` 四格資訊列（人數、時間、難度、類型）、`.toc` 頁內目錄。

## 寫作規則

- 使用台灣習慣的繁體中文。
- 用自己的話重新整理規則，不要照抄官方說明書的文字，也不要放官方圖片、商標或卡牌美術。
- 先講目標再講流程。讀者要先知道怎麼贏，才看得懂每個動作的意義。
- 一句話只講一件事；能用表格或步驟就不要寫成長段落。
- 卡牌名稱：有通用中文譯名就用中文；英文遊戲寫成「原文（中文）」，例如「Beer（啤酒）」。
- 不確定的規則不要自己編。寫不出來就在回覆中告訴使用者哪一條需要他確認。
- 只收錄基本版規則，擴充內容不寫進來，除非使用者要求。

## 樣式規則

- 整體風格：牌桌感。米色紙張底、深綠色（桌布）為主色、磚紅色只用在警告。
- 所有顏色和字級都定義在 `assets/style.css` 的 `:root` 變數，頁面裡不寫行內樣式，也不新增 `<style>`。
- 只使用範本裡已有的 class：`lead`、`facts`、`toc`、`table-wrap`、`steps`、`note`、`note warn`、`cheat`。
  需要新的樣式時，先問使用者，再加到 `style.css`，並補進這份清單。
- 表格一律包在 `<div class="table-wrap">` 裡，手機上才能橫向捲動。
- 不使用外部 CDN、框架或圖片，網站要能離線開啟。

## 修改既有內容時

- 只改使用者要求的部分，不順手重寫其他段落。
- 改了某頁的一句話介紹，要同時改 `games.json` 的 `summary` 和該頁的 `<meta name="description">`。
- 改了本文件定義的格式，要同時更新 `games/_template.html`、所有既有的遊戲頁和 `scripts/check.mjs`。

## 完成前的檢查

1. `node scripts/check.mjs` 全部通過。
2. 用 `python3 -m http.server` 開啟首頁，確認新卡片出現、點得進去、目錄連結都能跳到對應區塊。
3. 把瀏覽器寬度縮到手機大小，確認表格沒有撐破版面。

## Git 規則

- 一次提交只做一件事。訊息用繁體中文，格式為「新增：情書」「修正：BANG! 距離說明」「樣式：調整表格間距」。
- 直接提交到 `main`，推送後 GitHub Pages 會自動更新，約一分鐘後生效。
