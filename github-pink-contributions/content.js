// GitHub Contributions → Pink
//
// Instead of hardcoding colors for specific elements (which breaks the
// moment GitHub changes its markup), this rotates the HUE of any
// green-ish color it finds — in backgrounds AND svg fills — toward pink,
// while keeping each color's original lightness/saturation. That way the
// contribution calendar, its legend, AND the "Contribution activity" bars
// below it (and anything else green) all turn into a consistent pink
// gradient automatically.

(function () {
  const TARGET_HUE = 322;       // vivid pink/magenta
  const MIN_SATURATION = 0.12;  // ignore near-gray colors (keeps dark bg cells untouched)
  const HUE_MIN = 70;           // lower bound of "green-ish" hues (yellow-green)
  const HUE_MAX = 180;          // upper bound of "green-ish" hues (green-cyan)

  function parseColor(str) {
    if (!str) return null;
    const m = str.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\)/i);
    if (!m) return null;
    return {
      r: parseFloat(m[1]),
      g: parseFloat(m[2]),
      b: parseFloat(m[3]),
      a: m[4] !== undefined ? parseFloat(m[4]) : 1
    };
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        default: h = (r - g) / d + 4; break;
      }
      h *= 60;
    }
    return { h, s, l };
  }

  function hslToRgb(h, s, l) {
    h = (((h % 360) + 360) % 360) / 360;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }

  function isGreenish(color) {
    const { h, s } = rgbToHsl(color.r, color.g, color.b);
    return s >= MIN_SATURATION && h >= HUE_MIN && h <= HUE_MAX;
  }

  function toPink(color) {
    const { s, l } = rgbToHsl(color.r, color.g, color.b);
    const boostedS = Math.min(1, s * 1.05);
    const { r, g, b } = hslToRgb(TARGET_HUE, boostedS, l);
    return color.a < 1 ? `rgba(${r}, ${g}, ${b}, ${color.a})` : `rgb(${r}, ${g}, ${b})`;
  }

  const PROCESSED = new WeakSet();

  function recolor(el) {
    if (PROCESSED.has(el) || el.nodeType !== Node.ELEMENT_NODE) return;
    PROCESSED.add(el);

    const style = getComputedStyle(el);

    const bg = parseColor(style.backgroundColor);
    if (bg && bg.a !== 0 && isGreenish(bg)) {
      el.style.setProperty("background-color", toPink(bg), "important");
    }

    if (el instanceof SVGElement) {
      const fill = parseColor(style.fill);
      if (fill && fill.a !== 0 && isGreenish(fill)) {
        el.style.setProperty("fill", toPink(fill), "important");
      }
    }
  }

  function recolorAll(root) {
    recolor(root);
    root.querySelectorAll("*").forEach(recolor);
  }

  recolorAll(document.body);

  // GitHub re-renders parts of the page via AJAX (e.g. switching years,
  // loading more activity), so watch for new elements and recolor them too.
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          recolorAll(node);
        }
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
