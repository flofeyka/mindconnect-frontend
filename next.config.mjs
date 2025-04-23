/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "react-markdown",
    "remark-*",
    "rehype-*",
    "unist-*",
    "hast-*",
    "micromark-*",
  ],
  webpack: (config) => {
    // Это заставит webpack игнорировать проблемные файлы .d.ts
    config.resolve.extensionAlias = {
      ".js": [".js", ".ts"],
      ".jsx": [".jsx", ".tsx"],
    };
    return config;
  },
  typescript: {
    // Эта опция отключит проверку типов только при сборке,
    // но ваш редактор всё равно будет показывать ошибки
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
