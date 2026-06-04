"use client";

import { useState } from "react";
import { CloudSun, Search, Wind, Droplets } from "lucide-react";
import { geocodeLocation, getWeatherData, WeatherData, GeocodedLocation } from "@/lib/weather";
import styles from "../app/page.module.css";

export default function WeatherTester() {
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState<GeocodedLocation[]>([]);
  const [selectedLoc, setSelectedLoc] = useState<GeocodedLocation | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setLocations([]);
    setWeather(null);
    setSelectedLoc(null);

    try {
      const results = await geocodeLocation(query);
      if (results.length === 0) {
        setError(`No locations found matching "${query}"`);
      } else {
        setLocations(results);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to search for location";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLocation = async (loc: GeocodedLocation) => {
    setSelectedLoc(loc);
    setLocations([]);
    setLoading(true);
    setError("");

    try {
      const weatherData = await getWeatherData(loc);
      setWeather(weatherData);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load weather details";
      setError(errMsg);
      setSelectedLoc(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        <CloudSun size={22} style={{ color: "var(--accent-purple)" }} />
        Weather Tool Sandbox
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
        Search a location to preview the weather details format returned by the MCP tools.
      </p>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. San Francisco, Tokyo, London..."
          className={styles.searchInput}
          disabled={loading}
        />
        <button type="submit" className={styles.searchButton} disabled={loading}>
          {loading ? <span className={styles.loader}></span> : <Search size={18} />}
          Search
        </button>
      </form>

      {error && (
        <div style={{ color: "var(--error)", fontSize: "0.9rem", padding: "0.5rem", borderRadius: "4px", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
          {error}
        </div>
      )}

      {locations.length > 0 && (
        <div>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
            Select Location:
          </div>
          <ul className={styles.geoList}>
            {locations.map((loc, idx) => (
              <li key={`${loc.latitude}-${loc.longitude}-${idx}`} className={styles.geoItem} onClick={() => handleSelectLocation(loc)}>
                <span className={styles.geoItemName}>
                  {loc.name}, {loc.admin1 ? `${loc.admin1}, ` : ""}{loc.country}
                </span>
                <span className={styles.geoItemCountry}>{loc.country}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading && !selectedLoc && (
        <div className={styles.loaderCenter}>
          <span className={styles.loader} style={{ width: "30px", height: "30px" }}></span>
        </div>
      )}

      {weather && selectedLoc && (
        <div className={styles.weatherDisplay}>
          <div className={styles.weatherMain}>
            <div className={styles.weatherMeta}>
              <h3>{weather.location.name}</h3>
              <div className={styles.weatherLocationMeta}>
                {weather.location.admin1 ? `${weather.location.admin1}, ` : ""}{weather.location.country}
              </div>
              <div className={styles.weatherTemp}>
                {Math.round(weather.current.temperature)}
                <span className={styles.tempUnit}>°C</span>
              </div>
            </div>
            <div className={styles.weatherIconLarge} title={weather.current.description}>
              {weather.current.icon}
            </div>
          </div>

          <div className={styles.weatherDetailsGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Feels Like</div>
              <div className={styles.detailValue}>{Math.round(weather.current.feelsLike)}°C</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Humidity</div>
              <div className={styles.detailValue}>
                <Droplets size={14} style={{ display: "inline", marginRight: "4px", color: "var(--accent-blue)", verticalAlign: "middle" }} />
                {weather.current.humidity}%
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Wind Speed</div>
              <div className={styles.detailValue}>
                <Wind size={14} style={{ display: "inline", marginRight: "4px", color: "var(--text-secondary)", verticalAlign: "middle" }} />
                {weather.current.windSpeed} km/h
              </div>
            </div>
          </div>

          <div>
            <h4 className={styles.forecastTitle}>7-Day Forecast</h4>
            <div className={styles.forecastContainer}>
              {weather.forecast.map((day) => {
                const dayName = new Date(day.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                });
                return (
                  <div key={day.date} className={styles.forecastRow}>
                    <span className={styles.forecastDate}>{dayName}</span>
                    <span className={styles.forecastIcon}>{day.icon}</span>
                    <span className={styles.forecastDesc}>{day.description}</span>
                    <span className={styles.forecastTemp}>
                      {Math.round(day.tempMin)}° / {Math.round(day.tempMax)}°C
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
