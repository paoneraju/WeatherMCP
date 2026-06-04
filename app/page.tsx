import ConnectionGuide from "@/components/ConnectionGuide";
import ToolExplorer from "@/components/ToolExplorer";
import WeatherTester from "@/components/WeatherTester";
import styles from "./page.module.css";
import { CloudSun } from "lucide-react";

export const metadata = {
  title: "Weather MCP Server Dashboard",
  description: "Deploy a stateless, serverless Model Context Protocol (MCP) server providing weather forecasts to Vercel.",
};

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Header Area */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <CloudSun size={36} style={{ color: "var(--accent-purple)", verticalAlign: "middle" }} />
            Weather MCP Server
          </h1>
          <p>Model Context Protocol Server providing global weather data for AI models</p>
        </div>
        <div className={styles.statusIndicator}>
          <span className={styles.statusDot}></span>
          <span className={styles.statusText}>Active</span>
        </div>
      </header>

      {/* Main Grid Dashboard */}
      <main className={styles.grid}>
        {/* Left Column: Connection Guide & Available Tools */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          <ConnectionGuide />
          <ToolExplorer />
        </div>

        {/* Right Column: Interactive weather tester sandbox */}
        <div>
          <WeatherTester />
        </div>
      </main>

      {/* Footer Area */}
      <footer className={styles.footer}>
        <div>
          &copy; {new Date().getFullYear()} Weather MCP. Built for serverless deployment on Vercel.
        </div>
        <div className={styles.footerLinks}>
          <a
            href="https://modelcontextprotocol.io"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
          >
            MCP Specs
          </a>
          <a
            href="https://open-meteo.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
          >
            Open-Meteo API
          </a>
        </div>
      </footer>
    </div>
  );
}
