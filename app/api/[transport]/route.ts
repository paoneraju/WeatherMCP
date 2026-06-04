import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { geocodeLocation, getWeatherData } from "@/lib/weather";

const handler = createMcpHandler(
  (server) => {
    // Tool: get_current_weather
    server.tool(
      "get_current_weather",
      "Get current weather details for a specific city or region",
      {
        location: z.string().describe("The name of the city/location (e.g. 'San Francisco, CA', 'Paris', 'Tokyo')"),
      },
      async ({ location }) => {
        try {
          const geocoded = await geocodeLocation(location);
          if (geocoded.length === 0) {
            return {
              content: [{ type: "text", text: `Error: Location "${location}" not found.` }],
            };
          }
          const weather = await getWeatherData(geocoded[0]);
          const current = weather.current;
          const loc = weather.location;

          const textResult = [
            `Current weather for ${loc.name}, ${loc.admin1 ? loc.admin1 + ", " : ""}${loc.country}:`,
            `- Conditions: ${current.icon} ${current.description}`,
            `- Temperature: ${current.temperature}°C`,
            `- Feels Like: ${current.feelsLike}°C`,
            `- Humidity: ${current.humidity}%`,
            `- Wind Speed: ${current.windSpeed} km/h`,
            `- Precipitation: ${current.precipitation} mm`,
          ].join("\n");

          return {
            content: [{ type: "text", text: textResult }],
          };
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          return {
            content: [{ type: "text", text: `Error fetching weather for "${location}": ${errorMessage}` }],
          };
        }
      }
    );

    // Tool: get_weather_forecast
    server.tool(
      "get_weather_forecast",
      "Get 7-day daily weather forecast for a specific city or region",
      {
        location: z.string().describe("The name of the city/location (e.g. 'New York', 'London', 'Berlin')"),
      },
      async ({ location }) => {
        try {
          const geocoded = await geocodeLocation(location);
          if (geocoded.length === 0) {
            return {
              content: [{ type: "text", text: `Error: Location "${location}" not found.` }],
            };
          }
          const weather = await getWeatherData(geocoded[0]);
          const forecast = weather.forecast;
          const loc = weather.location;

          const header = `7-Day Weather Forecast for ${loc.name}, ${loc.admin1 ? loc.admin1 + ", " : ""}${loc.country}:`;
          const lines = forecast.map((day) => {
            return `- ${day.date}: ${day.icon} ${day.description} | Temp: ${day.tempMin}°C to ${day.tempMax}°C | Rain Prob: ${day.precipitationProbability}% | Precip: ${day.precipitationSum} mm`;
          });

          return {
            content: [{ type: "text", text: [header, ...lines].join("\n") }],
          };
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          return {
            content: [{ type: "text", text: `Error fetching weather forecast for "${location}": ${errorMessage}` }],
          };
        }
      }
    );
  },
  {
    serverInfo: {
      name: "weather-mcp-server",
      version: "1.0.0",
    },
  },
  {
    basePath: "/api",
    verboseLogs: true,
  }
);

export { handler as GET, handler as POST };
