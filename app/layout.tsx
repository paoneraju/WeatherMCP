import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Weather MCP Server Dashboard",
  description: "Deploy a stateless, serverless Model Context Protocol (MCP) server providing weather forecasts to Vercel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
