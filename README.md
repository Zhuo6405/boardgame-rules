# 桌遊規則講義

每款桌遊一頁、格式固定的規則講義網站，讓沒玩過的人十分鐘看懂規則。

網站：https://zhuo6405.github.io/boardgame-rules/

## 這個專案的重點

專案的規則都寫在 [CLAUDE.md](CLAUDE.md)。AI 助理讀完這份文件後，只要一句「幫我新增某某遊戲」，就能依照同一套格式產生新的頁面：

1. 複製 `games/_template.html`
2. 依固定的七個區塊填入規則
3. 在 `data/games.json` 加一筆資料（首頁卡片會自動出現）
4. 執行 `node scripts/check.mjs` 自我檢查

## 目前收錄

- 風聲
- BANG!

## 本機預覽

```bash
python3 -m http.server 8000
# 開啟 http://localhost:8000
```

首頁用 `fetch` 讀取 `data/games.json`，直接點兩下 `index.html` 開啟時卡片不會出現，請用上面的本機伺服器。

## 說明

規則為個人整理的教學筆記，僅供朋友間遊玩參考；完整規則請以各遊戲的官方說明書為準。
