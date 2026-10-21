export type Ctx = {
  /** 0 から始まり、ステージが進むほど上がる */
  level: number;
  /** 1 が基準。アニメーションの速さに掛ける */
  speed: number;
  win: () => void;
  lose: () => void;
};

export type Instance = {
  /** 時間切れまで耐えたら成功になるゲームなら true */
  winOnTimeout: boolean;
  destroy?: () => void;
};

export type MicroGame = {
  id: string;
  instruction: string;
  mount: (root: HTMLElement, ctx: Ctx) => Instance;
};
