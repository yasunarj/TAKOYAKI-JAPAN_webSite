// Header.tsx などの先頭（コンポーネント外）にコピペ

type CSS = React.CSSProperties;

// 汎用ヘルパー：# を %23 に、改行を削除して安全な data URI に
const makeBg = (svg: string, size = 64): CSS => ({
  backgroundImage: `url("data:image/svg+xml;utf8,${svg
    .replace(/#/g, "%23")
    .replace(/\n+/g, "")}")`,
  backgroundSize: `${size}px ${size}px`,
  backgroundRepeat: "repeat",
});

// 1) 麻の葉（Asanoha） … シャープで幾何学的
const ASANOHA_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>
  <rect width='64' height='64' fill='#0A0A0A'/>
  <g stroke='#ffffff' stroke-opacity='.10' stroke-width='1.2' fill='none'>
    <!-- 六角格子っぽい芯 -->
    <path d='M32 0 L48 8 L48 24 L32 32 L16 24 L16 8 Z'/>
    <path d='M32 32 L48 40 L48 56 L32 64 L16 56 L16 40 Z'/>
    <!-- 斜めの葉筋 -->
    <path d='M16 8 L32 32 L48 8 M16 24 L32 0 L48 24'/>
    <path d='M16 40 L32 64 L48 40 M16 56 L32 32 L48 56'/>
  </g>
</svg>
`;
export const PATTERN_ASANOHA = makeBg(ASANOHA_SVG, 64);

// 2) 亀甲（Kikkō） … 六角形の連続
const KIKKO_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='72' height='62' viewBox='0 0 72 62'>
  <rect width='72' height='62' fill='#0A0A0A'/>
  <g stroke='#ffffff' stroke-opacity='.10' stroke-width='1.2' fill='none'>
    <!-- 六角形 3個（タイルで連続） -->
    <polygon points='18,5 36,5 45,16 36,27 18,27 9,16'/>
    <polygon points='54,5 72,5 81,16 72,27 54,27 45,16'/>
    <polygon points='36,35 54,35 63,46 54,57 36,57 27,46'/>
    <polygon points='0,35 18,35 27,46 18,57 0,57 -9,46'/>
  </g>
</svg>
`;
export const PATTERN_KIKKO = makeBg(KIKKO_SVG, 72);

// 3) 七宝（Shippō） … 円の重なりでレンズ形が現れる
const SHIPPO_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>
  <rect width='64' height='64' fill='#0A0A0A'/>
  <g fill='none' stroke='#ffffff' stroke-opacity='.10' stroke-width='1.2'>
    <circle cx='32' cy='0' r='32'/>
    <circle cx='32' cy='64' r='32'/>
    <circle cx='0'  cy='32' r='32'/>
    <circle cx='64' cy='32' r='32'/>
  </g>
</svg>
`;
export const PATTERN_SHIPPO = makeBg(SHIPPO_SVG, 64);

// 4) 鱗（Uroko） … 交互の三角形
const UROKO_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'>
  <rect width='48' height='48' fill='#0A0A0A'/>
  <g fill='none' stroke='#ffffff' stroke-opacity='.10' stroke-width='1'>
    <!-- 上段 -->
    <path d='M0,48 L12,24 L24,48 Z'/>
    <path d='M24,48 L36,24 L48,48 Z'/>
    <!-- 下段（タイルで連続） -->
    <path d='M-12,24 L0,0 L12,24 Z'/>
    <path d='M12,24 L24,0 L36,24 Z'/>
    <path d='M36,24 L48,0 L60,24 Z'/>
  </g>
</svg>
`;
export const PATTERN_UROKO = makeBg(UROKO_SVG, 48);

// 5) 立涌（Tatewaki） … 縦にゆらめく唐草ライン
const TATEWAKI_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='48' height='64' viewBox='0 0 48 64'>
  <rect width='48' height='64' fill='#0A0A0A'/>
  <g fill='none' stroke='#ffffff' stroke-opacity='.10' stroke-width='1.2'>
    <path d='M12 0 C 6 10, 6 22, 12 32 C 18 42, 18 54, 12 64'/>
    <path d='M36 0 C 30 10, 30 22, 36 32 C 42 42, 42 54, 36 64'/>
  </g>
</svg>
`;
export const PATTERN_TATEWAKI = makeBg(TATEWAKI_SVG, 48);

// 既存：青海波（Seigaiha）
const SEIGAIHA_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>
  <rect width='64' height='64' fill='#0A0A0A'/>
  <path d='M0 64a32 32 0 0 1 64 0' fill='none' stroke='#ffffff' stroke-opacity='.12' stroke-width='2'/>
  <path d='M-16 64a32 32 0 0 1 64 0' fill='none' stroke='#ffffff' stroke-opacity='.12' stroke-width='2'/>
  <path d='M16 64a16 16 0 0 1 32 0' fill='none' stroke='#ffffff' stroke-opacity='.10' stroke-width='1.5'/>
  <path d='M0 64a16 16 0 0 1 32 0' fill='none' stroke='#ffffff' stroke-opacity='.10' stroke-width='1.5'/>
</svg>
`;
export const PATTERN_SEIGAIHA = makeBg(SEIGAIHA_SVG, 64);

// 6) 矢絣（Yagasuri）
const YAGASURI_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='48' height='64' viewBox='0 0 48 64'>
  <rect width='48' height='64' fill='#0A0A0A'/>
  <g fill='none' stroke='#ffffff' stroke-opacity='.10' stroke-width='1.2'>
    <path d='M24 0 L12 16 L24 32 L36 16 Z'/>
    <path d='M24 32 L12 48 L24 64 L36 48 Z'/>
  </g>
</svg>
`;
export const PATTERN_YAGASURI = makeBg(YAGASURI_SVG, 48);

// 7) 菱（Hishi）
const HISHI_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'>
  <rect width='48' height='48' fill='#0A0A0A'/>
  <g fill='none' stroke='#ffffff' stroke-opacity='.10' stroke-width='1'>
    <path d='M24 0 L48 24 L24 48 L0 24 Z'/>
  </g>
</svg>
`;
export const PATTERN_HISHI = makeBg(HISHI_SVG, 48);

// 8) 唐草（Karakusa）
const KARAKUSA_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>
  <rect width='64' height='64' fill='#0A0A0A'/>
  <g fill='none' stroke='#ffffff' stroke-opacity='.10' stroke-width='1.2'>
    <path d='M0 32 Q16 0, 32 32 T64 32'/>
    <path d='M0 48 Q16 16, 32 48 T64 48'/>
  </g>
</svg>
`;
export const PATTERN_KARAKUSA = makeBg(KARAKUSA_SVG, 64);

// 9) 市松（Ichimatsu）
const ICHIMATSU_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>
  <rect width='64' height='64' fill='#0A0A0A'/>
  <rect x='0' y='0' width='32' height='32' fill='#ffffff' fill-opacity='.05'/>
  <rect x='32' y='32' width='32' height='32' fill='#ffffff' fill-opacity='.05'/>
</svg>
`;
export const PATTERN_ICHIMATSU = makeBg(ICHIMATSU_SVG, 64);

// 10) 霰（Arare）
const ARARE_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'>
  <rect width='32' height='32' fill='#0A0A0A'/>
  <circle cx='4' cy='4' r='2' fill='#ffffff' fill-opacity='.08'/>
  <circle cx='20' cy='12' r='2' fill='#ffffff' fill-opacity='.08'/>
  <circle cx='12' cy='28' r='2' fill='#ffffff' fill-opacity='.08'/>
  <circle cx='28' cy='20' r='2' fill='#ffffff' fill-opacity='.08'/>
</svg>
`;
export const PATTERN_ARARE = makeBg(ARARE_SVG, 32);

// PATTERNSオブジェクトに追加
export const PATTERNS = {
  seigaiha: PATTERN_SEIGAIHA,
  asanoha: PATTERN_ASANOHA,
  kikko: PATTERN_KIKKO,
  shippo: PATTERN_SHIPPO,
  uroko: PATTERN_UROKO,
  tatewaki: PATTERN_TATEWAKI,
  yagasuri: PATTERN_YAGASURI,
  hishi: PATTERN_HISHI,
  karakusa: PATTERN_KARAKUSA,
  ichimatsu: PATTERN_ICHIMATSU,
  arare: PATTERN_ARARE,
};
