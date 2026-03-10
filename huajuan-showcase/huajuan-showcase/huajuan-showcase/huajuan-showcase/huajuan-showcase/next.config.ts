import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 移除 output: 'export' 以支持 Vercel Serverless Functions
  // 这是为了解决 CORS 问题，使用服务器端代理
};

export default nextConfig;
