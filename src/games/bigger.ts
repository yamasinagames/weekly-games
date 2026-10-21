import type { MicroGame } from "../types";
import { el, onTap, randInt } from "../util";

export const bigger: MicroGame = {
  id: "bigger",
  instruction: "大きい方をタップ！",
  mount(root, ctx) {
    const max = ctx.level < 3 ? 99 : 999;
    const a = randInt(1, max);
    let b: number;
    do {
      // レベルが上がると差の小さい数字になる
      b = ctx.level < 6 ? randInt(1, max) : a + randInt(-9, 9);
    } while (b === a || b < 1 || b > max);

    const wrap = el("div", "bigger");
    [a, b].forEach((v, i) => {
      const card = el("button", "bigger-card", String(v));
      onTap(card, () => {
        if (v > [a, b][1 - i]) ctx.win();
        else {
          card.classList.add("miss");
          ctx.lose();
        }
      });
      wrap.append(card);
    });
    root.append(wrap);
    return { winOnTimeout: false };
  },
};
