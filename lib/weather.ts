export interface GeocodedLocation {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // State or province
  timezone: string;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
  precipitation: number;
  weatherCode: number;
  description: string;
  icon: string; // Weather icon symbol
}

export interface ForecastDay {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProbability: number;
  description: string;
  icon: string;
}

export interface WeatherData {
  location: GeocodedLocation;
  current: CurrentWeather;
  forecast: ForecastDay[];
}

// Maps WMO weather codes to readable description, emoji, and color schemes
// WMO weather interpretation codes: https://open-meteo.com/en/docs
export function mapWeatherCode(code: number): { description: string; emoji: string; category: string } {
  switch (code) {
    case 0:
      return { description: "Clear sky", emoji: "☀️", category: "sunny" };
    case 1:
      return { description: "Mainly clear", emoji: "🌤️", category: "sunny" };
    case 2:
      return { description: "Partly cloudy", emoji: "⛅", category: "cloudy" };
    case 3:
      return { description: "Overcast", emoji: "☁️", category: "cloudy" };
    case 45:
      return { description: "Fog", emoji: "🌫️", category: "foggy" };
    case 48:
      return { description: "Depositing rime fog", emoji: "🌫️", category: "foggy" };
    case 51:
      return { description: "Light drizzle", emoji: "🌧️", category: "rainy" };
    case 53:
      return { description: "Moderate drizzle", emoji: "🌧️", category: "rainy" };
    case 55:
      return { description: "Dense drizzle", emoji: "🌧️", category: "rainy" };
    case 56:
      return { description: "Light freezing drizzle", emoji: "🌧️", category: "snowy" };
    case 57:
      return { description: "Dense freezing drizzle", emoji: "🌧️", category: "snowy" };
    case 61:
      return { description: "Slight rain", emoji: "💧", category: "rainy" };
    case 63:
      return { description: "Moderate rain", emoji: "🌧️", category: "rainy" };
    case 65:
      return { description: "Heavy rain", emoji: "🌧️", category: "rainy" };
    case 66:
      return { description: "Light freezing rain", emoji: "🌧️", category: "snowy" };
    case 67:
      return { description: "Heavy freezing rain", emoji: "🌧️", category: "snowy" };
    case 71:
      return { description: "Slight snow fall", emoji: "❄️", category: "snowy" };
    case 73:
      return { description: "Moderate snow fall", emoji: "❄️", category: "snowy" };
    case 75:
      return { description: "Heavy snow fall", emoji: "❄️", category: "snowy" };
    case 77:
      return { description: "Snow grains", emoji: "❄️", category: "snowy" };
    case 80:
      return { description: "Slight rain showers", emoji: "🌦️", category: "rainy" };
    case 81:
      return { description: "Moderate rain showers", emoji: "🌦️", category: "rainy" };
    case 82:
      return { description: "Violent rain showers", emoji: "🌧️", category: "rainy" };
    case 85:
      return { description: "Slight snow showers", emoji: "🌨️", category: "snowy" };
    case 86:
      return { description: "Heavy snow showers", emoji: "🌨️", category: "snowy" };
    case 95:
      return { description: "Thunderstorm", emoji: "⛈️", category: "stormy" };
    case 96:
      return { description: "Thunderstorm with slight hail", emoji: "⛈️", category: "stormy" };
    case 99:
      return { description: "Thunderstorm with heavy hail", emoji: "⛈️", category: "stormy" };
    default:
      return { description: "Unknown conditions", emoji: "🌈", category: "unknown" };
  }
}

/**
 * Searches for a location and returns geocoding matches
 */
export async function geocodeLocation(query: string): Promise<GeocodedLocation[]> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query
  )}&count=5&language=en&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Geocoding API responded with status ${res.status}`);
    }

    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      return [];
    }

    interface GeocodingItem {
      name: string;
      latitude: number;
      longitude: number;
      country: string;
      admin1?: string;
      timezone?: string;
    }

    return data.results.map((item: GeocodingItem) => ({
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country,
      admin1: item.admin1,
      timezone: item.timezone || "UTC",
    }));
  } catch (error) {
    console.error("Geocoding error:", error);
    throw error;
  }
}

/**
 * Fetches the full current weather and forecast for a specific location
 */
export async function getWeatherData(location: GeocodedLocation): Promise<WeatherData> {
  const { latitude: lat, longitude: lon } = location;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Weather API responded with status ${res.status}`);
    }

    const data = await res.json();
    
    // Current Weather mapping
    const currentData = data.current;
    const currentMapped = mapWeatherCode(currentData.weather_code);
    const current: CurrentWeather = {
      temperature: currentData.temperature_2m,
      feelsLike: currentData.apparent_temperature,
      humidity: currentData.relative_humidity_2m,
      windSpeed: currentData.wind_speed_10m,
      isDay: currentData.is_day === 1,
      precipitation: currentData.precipitation,
      weatherCode: currentData.weather_code,
      description: currentMapped.description,
      icon: currentMapped.emoji,
    };

    // Daily Forecast mapping
    const dailyData = data.daily;
    const forecast: ForecastDay[] = dailyData.time.map((timeStr: string, idx: number) => {
      const dayCode = dailyData.weather_code[idx];
      const dayMapped = mapWeatherCode(dayCode);
      return {
        date: timeStr,
        weatherCode: dayCode,
        tempMax: dailyData.temperature_2m_max[idx],
        tempMin: dailyData.temperature_2m_min[idx],
        precipitationSum: dailyData.precipitation_sum[idx],
        precipitationProbability: dailyData.precipitation_probability_max[idx],
        description: dayMapped.description,
        icon: dayMapped.emoji,
      };
    });

    return {
      location,
      current,
      forecast,
    };
  } catch (error) {
    console.error("Fetch weather data error:", error);
    throw error;
  }
}
