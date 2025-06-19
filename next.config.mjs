/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'wordpress.local',
                port: '', // leave empty if default
                pathname: '/wp-content/uploads/**',
            },
        ],
    },
};

export default nextConfig;
