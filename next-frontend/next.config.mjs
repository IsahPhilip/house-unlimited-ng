const wordpressOrigin = (process.env.WORDPRESS_BACKEND_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || "").replace(/\/$/, "");
const graphqlEndpoint = (process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT || `${wordpressOrigin}/graphql`).replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      },
      {
        protocol: "http",
        hostname: "**"
      }
    ]
  },
  async rewrites() {
    if (!wordpressOrigin) {
      return [];
    }

    return [
      {
        source: "/wp-json/:path*",
        destination: `${wordpressOrigin}/wp-json/:path*`
      },
      {
        source: "/graphql",
        destination: graphqlEndpoint
      }
    ];
  }
};

export default nextConfig;
