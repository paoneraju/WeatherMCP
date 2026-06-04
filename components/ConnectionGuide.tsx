"use client";

import { useState, useEffect } from "react";
import { Terminal, Copy, Check } from "lucide-react";
import styles from "../app/page.module.css";

export default function ConnectionGuide() {
  const [activeTab, setActiveTab] = useState<"cursor" | "claude">("cursor");
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const origin = mounted ? window.location.origin : "https://your-app.vercel.app";

  const getClaudeConfig = () => {
    return JSON.stringify(
      {
        mcpServers: {
          "weather-mcp": {
            command: "npx",
            args: ["-y", "mcp-remote", `${origin}/api/mcp`],
          },
        },
      },
      null,
      2
    );
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        <Terminal size={22} className="text-accent-purple" />
        Connection Guide
      </h2>

      <div className={styles.tabsHeader}>
        <button
          onClick={() => setActiveTab("cursor")}
          className={`${styles.tabBtn} ${activeTab === "cursor" ? styles.activeTabBtn : ""}`}
        >
          Cursor IDE
        </button>
        <button
          onClick={() => setActiveTab("claude")}
          className={`${styles.tabBtn} ${activeTab === "claude" ? styles.activeTabBtn : ""}`}
        >
          Claude Desktop
        </button>
      </div>

      {activeTab === "cursor" ? (
        <div className={styles.tabContent}>
          <div className={styles.stepList}>
            <div className={styles.stepItem}>
              <div className={styles.stepNum}>1</div>
              <div className={styles.stepText}>
                Open **Cursor Settings** (gear icon in the top right or `Cmd+,`).
              </div>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepNum}>2</div>
              <div className={styles.stepText}>
                Navigate to **Features** &rarr; **MCP**.
              </div>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepNum}>3</div>
              <div className={styles.stepText}>
                Click **+ Add New MCP Server**.
              </div>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepNum}>4</div>
              <div className={styles.stepText}>
                Configure with the following values:
                <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <div>&bull; **Name:** `weather-mcp`</div>
                  <div>&bull; **Type:** `SSE`</div>
                  <div>&bull; **URL:** `{origin}/api/sse`</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.codeContainer}>
            <button
              className={styles.copyBtn}
              onClick={() => copyToClipboard(`${origin}/api/sse`)}
              title="Copy URL"
            >
              {copied ? <Check size={16} style={{ color: "var(--success)" }} /> : <Copy size={16} />}
            </button>
            <div className={styles.codeBlock}>{origin}/api/sse</div>
          </div>
        </div>
      ) : (
        <div className={styles.tabContent}>
          <div className={styles.stepList}>
            <div className={styles.stepItem}>
              <div className={styles.stepNum}>1</div>
              <div className={styles.stepText}>
                Open your `claude_desktop_config.json` configuration file:
                <div style={{ fontSize: "0.85rem", marginTop: "0.25rem", color: "var(--text-muted)" }}>
                  MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`<br />
                  Windows: `%APPDATA%\Claude\claude_desktop_config.json`
                </div>
              </div>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepNum}>2</div>
              <div className={styles.stepText}>
                Add the `weather-mcp` definition to your `mcpServers` object (copy snippet below).
              </div>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepNum}>3</div>
              <div className={styles.stepText}>
                **Restart Claude Desktop** completely for the changes to take effect.
              </div>
            </div>
          </div>

          <div className={styles.codeContainer}>
            <button
              className={styles.copyBtn}
              onClick={() => copyToClipboard(getClaudeConfig())}
              title="Copy Configuration JSON"
            >
              {copied ? <Check size={16} style={{ color: "var(--success)" }} /> : <Copy size={16} />}
            </button>
            <pre className={styles.codeBlock}>
              <code>{getClaudeConfig()}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
