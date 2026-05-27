export const log = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  warn: (msg: string) => console.warn(`[WARN] ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${msg}`),
  step: (msg: string) => console.log(`\n> ${msg}`),
  result: (msg: string) => console.log(`  [OK] ${msg}`),
}
