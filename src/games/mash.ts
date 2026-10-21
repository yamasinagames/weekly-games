import type { MicroGame } from "../types";
import { el, onTap } from "../util";

export const mash: MicroGame = {
  id: "mash",
  instruction: "連打！",
  mount(root, ctx) {
    let left = Math.min(8 + ctx.level * 2, 30);
    const pad = el("button", "mash-pad");
    const num = el("div", "mash-num", String(left));
    pad.append(num, el("div", "mash-label", "あと"));
    onTap(pad, () => {
      left--;
      num.textContent = String(left);
      pad.classList.remove("pop");
      void pad.offsetWidth;
      pad.classList.add("pop");
      if (left === 0) ctx.win();
    });
    root.append(pad);
    return { winOnTimeout: false };
  },
};
