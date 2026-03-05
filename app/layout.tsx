import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "🌸 花卷能力中心",
  description: "完整展示花卷的所有能力",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
