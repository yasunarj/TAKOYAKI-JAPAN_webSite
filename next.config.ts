// next.config.mjs (または next.config.ts)
import createNextIntlPlugin from "next-intl/plugin";

// request.ts の場所を **明示**（ミスを防ぐ）
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig /**: NextConfig*/ = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/movies/:file*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
