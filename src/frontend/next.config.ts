import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
    experimental: {
        rootParams: true,
    },
    cacheComponents: true,
    reactStrictMode: true,
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);