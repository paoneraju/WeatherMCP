import { Cpu } from "lucide-react";
import styles from "../app/page.module.css";

interface ToolParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface ToolInfo {
  name: string;
  description: string;
  params: ToolParam[];
}

const TOOLS: ToolInfo[] = [
  {
    name: "get_current_weather",
    description: "Fetches real-time weather details for a given location, automatically converting the location string to geographical coordinates.",
    params: [
      {
        name: "location",
        type: "string",
        required: true,
        description: "The city or region name (e.g. 'San Francisco, CA', 'Paris', 'Tokyo').",
      },
    ],
  },
  {
    name: "get_weather_forecast",
    description: "Fetches a 7-day daily weather forecast for a given location, including high/low temperatures and precipitation probabilities.",
    params: [
      {
        name: "location",
        type: "string",
        required: true,
        description: "The city or region name (e.g. 'Seattle, WA', 'London', 'Munich').",
      },
    ],
  },
];

export default function ToolExplorer() {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        <Cpu size={22} style={{ color: "var(--accent-teal)" }} />
        Available MCP Tools
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
        Your LLM clients can invoke the following functions automatically once the server is connected.
      </p>

      <div className={styles.toolList}>
        {TOOLS.map((tool) => (
          <div key={tool.name} className={styles.toolItem}>
            <div className={styles.toolHeader}>
              <span className={styles.toolName}>{tool.name}</span>
            </div>
            <p className={styles.toolDesc}>{tool.description}</p>

            <div>
              <div className={styles.schemaTitle}>Arguments Schema</div>
              <div className={styles.schemaGrid}>
                {tool.params.map((param) => (
                  <div key={param.name} className={styles.paramRow}>
                    <span className={styles.paramName}>
                      {param.name}
                      {param.required && <span style={{ color: "var(--error)" }}>*</span>}
                    </span>
                    <span className={styles.paramType}>{param.type}</span>
                    <span className={styles.paramDesc}>&mdash; {param.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
