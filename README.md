This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


まず直すと安定するポイント
同一ファイルに複数コンポーネント＆'use client'が混在
→ それぞれを個別ファイルに分離して、各ファイルの先頭にだけ'use client'。
（今の貼り方だと Header/SplashScreen/FullScreenContainer/HeroSection/IntroSection/ScrollIndicator/AccessSection が1ファイルに混在してます）

completedSections をsetTimeoutで擬似進行
→ 実スクロールに同期させましょう。FullScreenContainerごとに**「セクションが見えた/終わった」**をフックして completedSections を更新。

Tailwind v4 の設定が二重定義気味

@theme inline で bg-japanese-red 等を定義しているので、tailwind.config.js の色/フォント定義はどちらかに統一すると事故が減ります（v4はCSSへの定義が第一候補）。

キーボード操作の誤発火対策
→ keydown をドキュメント全体で拾っているので、フォームやモーダル追加時に暴れます。フォーカスがbody直下/特定ラッパにある時のみ効くようガード。

z-index の固定配列
→ zIndexMap が ["z-10","z-20","z-30","z-40"] 固定なので、セクション数が増えると破綻。動的生成に。


動画のパフォ & 互換性（HERO）
poster を設定（LCP改善）。

<Head> で <link rel="preload" as="video" href="/movies/xxx.mp4" /> を入れるとさらに安定。

muted playsInline はOK。iOS向けに**autoPlayはミュート前提**を維持。

prefers-reduced-motion でアニメ淡く。

Headerの「詳細ページへ」要件
リンク先 /intro /menu /access は別ページ実装が必要（app/intro/page.tsx など）。
右側で“達成済み”表示は今のままでOK。スクロール中はリンクの aria-disabled/pointer-events-none を一時付与すると誤クリック減ります。

最後に：足りてない/あると嬉しいもの
MenuSection.tsx（代表メニュー1品の見せ方）

app/intro/page.tsx / app/menu/page.tsx / app/access/page.tsx（詳細ページ）

app/lib/font.ts（shippori の中身）

もし Lenis / GSAP を本格導入するなら、**「主役はどれか」**を決めましょう：

主役をLenis（慣性/スムーズ担当）に → ページスナップは自作ロジックでOK

主役をScrollTrigger に → セクション監視は ScrollTrigger の onEnter/onLeave を使い、ホイールは Lenis に任せる（競合しないよう wheel 自作を外す）

