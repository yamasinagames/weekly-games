import type { MicroGame } from "../types";
import { el, onTap } from "../util";

export const stop: MicroGame = {
  id: "stop",
  instruction: "ぴったり止めろ！",
  mount(root, ctx) {
    // 0〜1 の位置で管理する
    const zoneWidth = Math.max(0.28 - ctx.level * 0.02, 0.1);
    const zoneStart = 0.15 + Math.random() * (0.7 - zoneWidth);
    const velocity = (0.9 + ctx.level * 0.1) * ctx.speed; // 1秒あたり

    const area = el("button", "stop-area");
    const track = el("div", "stop-track");
    const zone = el("div", "stop-zone");
    const marker = el("div", "stop-marker");
    zone.style.left = `${zoneStart * 100}%`;
    zone.style.width = `${zoneWidth * 100}%`;
    track.append(zone, marker);
    area.append(track, el("div", "stop-hint", "どこでもタップ"));

    let pos = 0;
    let dir = 1;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      pos += dir * velocity * ((now - last) / 1000);
      last = now;
      if (pos > 1) { pos = 2 - pos; dir = -1; }
      if (pos < 0) { pos = -pos; dir = 1; }
      marker.style.left = `${pos * 100}%`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    onTap(area, () => {
      cancelAnimationFrame(raf);
      if (pos >= zoneStart && pos <= zoneStart + zoneWidth) ctx.win();
      else {
        marker.classList.add("miss");
        ctx.lose();
      }
    });
    root.append(area);
    return { winOnTimeout: false, destroy: () => cancelAnimationFrame(raf) };
  },
};
