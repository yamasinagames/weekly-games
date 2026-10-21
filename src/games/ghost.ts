import type { MicroGame } from "../types";
import { el, onTap, randInt, shuffle } from "../util";

const COLS = 4;
const ROWS = 5;

export const ghost: MicroGame = {
  id: "ghost",
  instruction: "おばけをタップ！",
  mount(root, ctx) {
    const count = Math.min(4 + ctx.level * 2, COLS * ROWS);
    const cells = shuffle([...Array(COLS * ROWS).keys()]).slice(0, count);
    const ghostAt = randInt(0, count - 1);

    const grid = el("div", "ghost-grid");
    for (let i = 0; i < COLS * ROWS; i++) grid.append(el("div"));
    cells.forEach((cell, i) => {
      const isGhost = i === ghostAt;
      const b = el("button", "ghost-item", isGhost ? "👻" : "🎃");
      onTap(b, () => {
        if (isGhost) ctx.win();
        else {
          b.classList.add("miss");
          ctx.lose();
        }
      });
      grid.children[cell].replaceWith(b);
    });
    root.append(grid);
    return { winOnTimeout: false };
  },
};
