// next.config.mjs (または next.config.ts)
import createNextIntlPlugin from 'next-intl/plugin';

// request.ts の場所を **明示**（ミスを防ぐ）
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig /**: NextConfig*/ = {
  reactStrictMode: true
};

export default withNextIntl(nextConfig);

