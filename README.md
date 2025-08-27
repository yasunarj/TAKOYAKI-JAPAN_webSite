# TAKOYAKI JAPAN

日光・栃木のたこ焼き店「TAKOYAKI JAPAN」の公式サイト（Next.js App Router）

> 🇯🇵/🇬🇧 多言語対応（next-intl）。フルスクリーンのセクション遷移、リッチアニメーション、和柄パターン、SEO/OGP 最適化済み。

---

## 目次

* [概要](#概要)
* [技術スタック](#技術スタック)
* [プロジェクト構成](#プロジェクト構成)
* [セットアップ](#セットアップ)
* [開発スクリプト](#開発スクリプト)
* [国際化 (next-intl)](#国際化-next-intl)
* [ミドルウェア (next-intl)](#ミドルウェア-next-intl)
* [レイアウト & メタデータ](#レイアウト--メタデータ)
* [主要コンポーネント](#主要コンポーネント)

  * [SplashScreen](#splashscreen)
  * [HeroSection](#herosection)
  * [Header](#header)
  * [IntroSection](#introsection)
  * [MenuSection](#menusection)
* [スクロール制御フック](#スクロール制御フック)
* [スタイル / デザイン指針](#スタイル--デザイン指針)

  * [和柄パターンの使い方](#和柄パターンの使い方)
* [アクセシビリティ](#アクセシビリティ)
* [パフォーマンス注意点](#パフォーマンス注意点)
* [環境変数](#環境変数)
* [依存関係 / バージョン](#依存関係--バージョン)
* [デプロイ](#デプロイ)
* [今後の改善案 / TODO](#今後の改善案--todo)
* [付録: 翻訳キー例](#付録-翻訳キー例)
* [付録: セクション追加の流れ](#付録-セクション追加の流れ)

---

## 概要

* **目的**: 店舗の魅力（赤ちょうちん / 和音楽 / オープンテラス）を動画・アニメーション・和柄で表現。日本語 / 英語の2言語で情報を提供。
* **ページ構成**: フルスクリーンのセクション（Hero / Intro / Menu / ...）をホイール/スワイプで切替。右側固定ヘッダーは訪問済みセクションのみを動的表示。
* **翻訳**: `next-intl` による `messages/ja.json`, `messages/en.json` 管理。

## 技術スタック

* **フレームワーク**: Next.js (App Router)
* **言語**: TypeScript
* **スタイル**: Tailwind CSS、カスタム和柄ユーティリティ（`PATTERNS`）
* **アニメーション**: Framer Motion / GSAP（導入済。現状は Framer Motion をメインで使用）
* **i18n**: next-intl
* **画像/動画**: Next/Image, `<video>` 背景

## プロジェクト構成

```
app/
  [locale]/
    layout.tsx        # ロケール別メタデータ + NextIntl プロバイダ
    page.tsx          # セクションを並べるエントリ
  globals.css
app/styles/patterns.ts # PATTERNS: 和柄の background スタイル
components/
  HomeClient.tsx      # 画面全体のオーケストレーション（スプラ、セクション、ヘッダー、スクロール制御）
  SplashScreen.tsx
  sections/
    HeroSection.tsx
    IntroSection.tsx
    MenuSection.tsx
  Header.tsx
hooks/
  useScrollControl.ts # セクションスナップ/遷移制御
messages/
  ja.json
  en.json
src/
  middleware.ts       # next-intl ミドルウェア（/ -> /ja へリダイレクト、matcher 設定）
  i18n/config.ts      # locales, defaultLocale など
```

## セットアップ

```bash
pnpm i   # または npm i / yarn
cp .env.example .env.local
npm run dev
```

* Node.js は LTS（推奨: v18 もしくは v20）
* 画像/動画は `public/images`, `public/movies` 配下

## 開発スクリプト

```json
{
  "scripts": {
    "dev": "next dev",
    "check:i18n": "tsx scripts/check-i18n.ts",
    "build": "npm run check:i18n && next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

* `check:i18n`: `messages/ja.json` と `messages/en.json` のキー差分や未翻訳を検査する想定スクリプト（実装は `scripts/check-i18n.ts`）。
* `build` はビルド前に国際化チェックを実行します。

## 国際化 (next-intl)

* `NextIntlClientProvider` を `app/[locale]/layout.tsx` に設置。
* 文字列は `useTranslations('<namespace>')` から参照（例: `splash`, `hero`, `intro`, `menu`, `access`, `nav`）。
* ICU 形式のプレースホルダを使用（例）:

  * 価格: `"price_label": "{price}円"` / `"price_label": "¥{price}"`
  * 営業時間: `"hours_label": "営業時間 {open}-{close}"` / `"Hours {open}-{close}"`
* 画像・動画の `alt` も `messages` で管理（アクセシビリティ向上）。
* 翻訳ファイルは **同一のキー構造** を維持。`npm run check:i18n` で未翻訳やキー欠落を検知。

## ミドルウェア (next-intl)

`src/middleware.ts`

```ts
import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always' // "/" に来たら "/ja" に誘導
});

export const config = {
  // matcher: ['/', '/(ja|en)/:path*']
  matcher: ['/', '/((?!api|_next|.*\\..*).*)']
};
```

* `localePrefix: 'always'` により `/` は必ずロケール付きに正規化（`/ja`, `/en`）。
* `matcher` は `api` や `_next`、静的アセット（拡張子あり）を除外し、任意パスをロケールルートに通します。

## レイアウト & メタデータ

`app/[locale]/layout.tsx`

* `export const dynamic = 'force-static'` : SSG/ISR 寄りに固定（動的データ非依存サイト向け）。
* `generateMetadata` でロケール別タイトル/説明、`metadataBase`、OGP、`alternates.languages` を設定。
* `suppressHydrationWarning` と `<body className="antialiased">` で Hydration mismatch 回避と滑らかな表示。
* `NextIntlClientProvider` で `messages` をロケール毎に動的 import。

## 主要コンポーネント

### SplashScreen

* 3 秒表示後フェードアウト、`onComplete` コールバックでページ表示を解放。
* 背景画像（`/images/splashScreen.jpg`）＋ロゴ（`/images/TAKOYAKI_JAPAN.png`）。
* ローディングドットに `role="status"` / `aria-live="polite"` を付与。

### HeroSection

* フルスクリーン、背景動画（`/movies/12293701_3840_2160_30fps.mp4`、`muted loop autoplay playsInline`）。
* タグラインを `next-intl` から取得してフェードイン表示。
* 半透明オーバーレイで可読性向上。

### Header

* **デスクトップ**: 右 20% 固定。スプラ後にスライドイン。訪問済みセクションのみをハイライト表示（丸インジケーター付き）。
* **モバイル**: トップ固定バー + ハンバーガー。訪問済みセクションをドロワーに列挙。
* ロゴ（Next/Image）/ 言語切替（`/ja` / `/en`）。
* 和柄背景 `PATTERNS.shippo` を適用。

### IntroSection

* 見出し + リード + 特徴グリッド（6項目）。すべて翻訳文字列化。
* 和柄背景（`kikko`）でカード装飾。スクロールに応じたアニメーション。

### MenuSection

* メインのおすすめ商品カード（画像・説明・価格・特徴・材料・CTA）。
* `featuredItem` の文言は `messages` 管理。金色バッジや星評価の装飾あり。
* 和柄（`kikko`/`karakusa`）をセクション/カードに適用。

## スクロール制御フック

`hooks/useScrollControl.ts`

* **目的**: 各セクションを“ページ”として扱い、端（先頭/末尾）でのホイール継続や上下スワイプをトリガに前後セクションへスナップ遷移。
* **しきい値**: `EDGE_WHEEL_THRESHOLD = 320`、`SWIPE_THRESHOLD = 120`、クールダウン `COOLDOWN_MS = 700ms`。
* **公開 API**:

  * `currentSection: number` 現在のセクション index
  * `direction: "up" | "down"` 遷移方向
  * `goToSection(index: number)` プログラム的に移動
  * `setContainerRef(index: number) => (el) => void` セクション DOM を登録
  * `prevIndex: number | null` 直前の index
* **使い方（擬似コード）**:

  ```tsx
  const { currentSection, goToSection, setContainerRef } = useScrollControl(totalSections);
  return (
    <div ref={setContainerRef(0)}> ...Hero... </div>
    <div ref={setContainerRef(1)}> ...Intro... </div>
    <div ref={setContainerRef(2)}> ...Menu... </div>
  );
  ```
* **実装ポイント**:

  * セクション DOM を `containersRef.current[index]` に収納。
  * 各セクションの `scrollTop` を切替時にリセット。
  * ホイール/タッチイベントを `passive:false` で制御し、端到達 + 追加意図（accumulate）でセクション遷移。

## スタイル / デザイン指針

* Tailwind ユーティリティ + `PATTERNS`（七宝・亀甲・唐草・麻の葉・青海波・矢絣・菱・市松・霰・立涌 など）を背景 layer に。
* 和モダン配色（`japanese-black/white/red/crimson/gold/gray`, `dark-gray`）。
* 見出しに毛筆風（`font-brush`）、本文にゴシック/丸ゴ（`font-maru` など）。
* ドロップシャドウ/ボーダーで立体感を演出。

### 和柄パターンの使い方

* すべて **data URI** 化してあるため追加アセット不要。
* 例: コンポーネントで背景に適用

```tsx
import { PATTERNS } from '@/app/styles/patterns';

export function Card() {
  return (
    <div className="rounded-lg border" style={PATTERNS.shippo}>
      ...
    </div>
  );
}
```

* 既存キー: `seigaiha`, `asanoha`, `kikko`, `shippo`, `uroko`, `tatewaki`, `yagasuri`, `hishi`, `karakusa`, `ichimatsu`, `arare`。
* 新柄を追加する場合は `makeBg(svg, size)` を用いて `PATTERNS` に登録。

## アクセシビリティ

* スプラのローディングに `role/aria-live` を付与。
* 重要な画像は `alt` を明示。動画には視認性向上のオーバーレイ。
* キーボード操作でもヘッダーボタンを押下可能（`button` 要素）。

## パフォーマンス注意点

* 背景動画はサイズが大きいため、ビットレート/解像度最適化を推奨（必要なら `webm` 併用）。
* 画像は `next/image` の最適化を活用。`priority` は要点に限定。
* Framer Motion の `whileHover`などは最小限にし、再レンダリングを抑制。
* Tailwind v4 を使用。クラスのツリーシェイク前提で未使用スタイルを残さない運用に注意。

## 環境変数

```
NEXT_PUBLIC_SITE_URL=https://example.com
```

* OGP の URL 組成に利用。デプロイ先 URL を設定。

## 依存関係 / バージョン

* Next.js **15.4.6**
* React **19.1.0**, React DOM **19.1.0**
* next-intl **4.3.5**
* Tailwind CSS **4** / `@tailwindcss/postcss` **4**
* Framer Motion **12.23.12**
* GSAP **3.13.0** (`@gsap/react` **2.1.2**)
* lenis **1.3.8**, locomotive-scroll **4.1.4**
* TypeScript **5**, ESLint **9**

> パッケージは `package.json` の記載に準拠。Node は LTS（v18+ / v20+）推奨。

## デプロイ

* Vercel 推奨。
* SSG 設定: `export const dynamic = 'force-static'` により基本静的化。動的データが増える場合は適宜 SSR/ISR 方針に見直し。

## 今後の改善案 / TODO

* [ ] メニュー一覧ページへの導線（`All Menu` 先）
* [ ] `messages/*.json` の語彙見直しと翻訳校正（ICU プレースホルダの一貫性）
* [ ] 画像/動画の軽量化（AVIF/WebP/WebM）
* [ ] アクセシビリティ（フォーカススタイル、コントラスト検証）
* [ ] `Header` ナビにスクロール連動の現在地ハイライト
* [ ] E2E/ビジュアルリグレッション（Playwright 等）
* [ ] `scripts/check-i18n.ts` の実装（未翻訳検出・キー同期ツール）
* [ ] `HomeClient` の責務を README に追記（セクション配列/visited 管理・`useScrollControl` 連携）

---

## 付録: 翻訳キー例

* `brand`, `splash.bg_alt`, `splash.subtitle`, `splash.loading_aria`
* `nav.hero`, `nav.intro`, `nav.menu`, `nav.access`
* `hero.tagline1`, `hero.taglineEm`, `hero.tagline2`
* `intro.heading`, `intro.lead_long`, `intro.features.*`, `intro.atmosphere.*`
* `menu.heading`, `menu.lead_long`, `menu.featured.*`, `menu.more.*`
* `access.*`（基本情報/アクセス方法/支払い方法/問い合わせなど）

## 付録: セクション追加の流れ

1. `components/sections/NewSection.tsx` を作成し `isActive` を受け取る実装に。
2. `HomeClient` で `useScrollControl(totalSections)` を用い、`setContainerRef(index)` を割当て。
3. `Header` の `sections` 配列に `{ id, label }` を追加。必要なら `messages/*.json` に翻訳キーを追加。
4. デザインに応じて `PATTERNS` を適用し、`messages` に `alt` を追加。
