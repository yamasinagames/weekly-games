// GoatCounter のサイトコード。登録したらここに入れる（空なら送信しない）
const GOATCOUNTER_CODE = "";

type GoatCounter = { count: (opts: { path: string; title?: string; event?: boolean }) => void };

if (GOATCOUNTER_CODE) {
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://gc.zgo.at/count.js";
  s.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
  document.head.append(s);
}

export function track(name: string): void {
  if (import.meta.env.DEV) console.log("[track]", name);
  const gc = (window as unknown as { goatcounter?: GoatCounter }).goatcounter;
  gc?.count?.({ path: name, title: name, event: true });
}
