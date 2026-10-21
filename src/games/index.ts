import type { MicroGame } from "../types";
import { bigger } from "./bigger";
import { ghost } from "./ghost";
import { mash } from "./mash";
import { stop } from "./stop";

// 新しいマイクロゲームはここに足すだけでフィードに流れる
export const games: MicroGame[] = [bigger, ghost, mash, stop];
