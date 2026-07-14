<div align="center">

```
    .・゜゜・.・゜🎀゜・.・゜゜・.
      P I N K I F Y   G I T H U B
    .・゜゜・.・゜🎀゜・.・゜゜・.
```

# 💚 ➜ 💖 github-pink-contributions

**Because green just isn't *me*.**

![vibe](https://img.shields.io/badge/vibe-neon%20pink-ff3ec8?style=for-the-badge)
![manifest](https://img.shields.io/badge/manifest-v3-1a1a2e?style=for-the-badge)
![status](https://img.shields.io/badge/status-unreasonably%20pink-c21b96?style=for-the-badge)
![made with](https://img.shields.io/badge/made%20with-spite%20%26%20css-ff69b4?style=for-the-badge)

</div>

---

### 🩷 what is this?

A tiny Chrome extension that turns GitHub's contribution graph (and basically everything else green around it) into various shades of pink. No green. Anywhere. Never again.

---

### ✨ features

* 🎨 Recolors the contribution calendar, **including** the Less → More legend
* 📊 Recolors the bars in the "Contribution activity" section too
* 🌈 Automatically detects green hues via hue rotation — no fragile color mapping that breaks whenever GitHub updates something
* 🕶️ Preserves brightness and saturation → dark green becomes dark pink, light green becomes **vibrant** pink
* 🔄 Reacts to GitHub's AJAX updates (switching years, loading more activity, etc.) via `MutationObserver`
* 📦 No dependencies, no build step, no tracking permissions

---

<details>
<summary>🧠 <b>how does the magic work?</b> (click to expand, curious human)</summary>

<br>

The content script scans elements on `github.com`, converts background and fill colors to HSL, and checks: *is the hue somewhere between yellow-green and green-cyan?* If yes → the hue gets rotated to a vibrant pink (`322°`) while saturation and brightness stay (almost) exactly the same.

```text
green 🟢  h≈130°, s≈64%, l≈53%
        │
        │  hue → 322°
        ▼
pink  💗  h=322°, s≈64%, l≈53%
```

No hardcoded "Level 1 = this hex, Level 2 = that hex" nonsense — the extension simply remembers: *everything green becomes pink*, no matter where GitHub tries to hide it.

</details>

---

### 🚀 installation

> [!NOTE]
> Currently available only as an unpacked extension — no Chrome Web Store listing yet (soon™️, maybe, no promises).

1. Clone the repo or download the ZIP 📥
2. Open `chrome://extensions`
3. Enable **Developer mode** in the top-right corner 🛠️
4. Click **"Load unpacked"** and select the folder
5. Reload your GitHub profile and watch everything turn pink 💅

---

### 🎨 want different shades of pink?

The target hue lives near the top of `content.js`:

```js
const TARGET_HUE = 322; // vivid pink/magenta
```

Different number, different vibe. `280` for purple, `340` for hot magenta, `300` when you're feeling a little more orchid.

---

<div align="center">

### 🐛 bugs? ideas? need more pink?

Issues and PRs are welcome — as long as they're color-coordinated with the repo. 💖

<br>

```
       ✧･ﾟ: *✧･ﾟ:*  made with neon pink and mild green hatred  *:･ﾟ✧*:･ﾟ✧
```

</div>
