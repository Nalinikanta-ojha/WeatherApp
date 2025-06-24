import { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import "../App.css";
import WeatherBackground from "../components/WeatherBackground";
import {
  convertTemperature,
  getHumidityValue,
  getVisibilityValue,
  getWindDirection,
} from "../components/Helper";
import {
  HumidityIcon,
  SunriseIcon,
  SunsetIcon,
  VisibilityIcon,
  WindIcon,
} from "../components/Icon";

// ✅ InfoCard component
const InfoCard = ({ icon, label, value }) => (
  <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 shadow flex flex-col items-center justify-center text-center">
    {icon && <div className="mb-1">{icon}</div>}
    <p className="font-semibold">{label}</p>
    <p className="text-sm">{value}</p>
  </div>
);

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [suggestion, setSuggestion] = useState([]);
  const [unit, setUnit] = useState("C");
  const [error, setError] = useState("");

  const API_KEY = "112dd024408de7db5bc53c84f8fae57f";

  const {
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
    positionError,
    getPosition,
  } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
  });

  useEffect(() => {
    if (city.trim().length >= 3 && !weather) {
      const timer = setTimeout(() => fetchSuggestions(city), 500);
      return () => clearTimeout(timer);
    }
    setSuggestion([]);
  }, [city, weather]);

  const fetchSuggestions = async (query) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      res.ok ? setSuggestion(await res.json()) : setSuggestion([]);
    } catch {
      setSuggestion([]);
    }
  };

  const fetchWeatherData = async (url, name = "") => {
    setError("");
    setWeather(null);
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error((await response.json()).message || "City not found");
      const data = await response.json();
      setWeather(data);
      setCity(name || data.name);
      setSuggestion([]);
    } catch (e) {
      setError(e.message);
    }
  };

  const getWeatherByLocation = async () => {
    setError("");

    if (!isGeolocationAvailable) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    if (!isGeolocationEnabled) {
      setError("Geolocation is not enabled.");
      return;
    }

    if (!coords) {
      setError("Detecting your location...");
      getPosition();
      return;
    }

    const { latitude: lat, longitude: lon } = coords;

    try {
      const locationRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
      );
      const locationData = await locationRes.json();
      const cityName = locationData?.[0]?.name || "Your Location";

      await fetchWeatherData(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
        cityName
      );
    } catch (err) {
      setError("Could not fetch weather data based on your location.");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return setError("Please enter a valid city name");
    await fetchWeatherData(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${API_KEY}&units=metric`
    );
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-sky-200 via-emerald-100 to-white">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/clouds.png')] opacity-10 pointer-events-none z-0" />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-2xl bg-white/30 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-8 text-slate-900 font-sans">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-green-800 mb-8 drop-shadow-sm">
            🌿 NatureCast
          </h1>

          {!weather ? (
            <form onSubmit={handleSearch} className="space-y-4">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter a city"
                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-white/20 placeholder-gray-500 text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300"
              />

              {suggestion.length > 0 && (
                <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg overflow-hidden text-gray-500">
                  {suggestion.map((s) => (
                    <button
                      type="button"
                      key={`${s.lat}-${s.lon}`}
                      onClick={() =>
                        fetchWeatherData(
                          `https://api.openweathermap.org/data/2.5/weather?lat=${s.lat}&lon=${s.lon}&appid=${API_KEY}&units=metric`,
                          `${s.name}, ${s.country}${
                            s.state ? `, ${s.state}` : ""
                          }`
                        )
                      }
                      className="w-full px-4 py-2 text-left hover:bg-white/10 transition"
                    >
                      {s.name}, {s.country}
                      {s.state && `, ${s.state}`}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-400 to-teal-500 text-white py-2 rounded-lg shadow-md hover:scale-95 transition"
                >
                  🌦️ Get Weather
                </button>
                <button
                  type="button"
                  onClick={getWeatherByLocation}
                  className="flex-1 bg-gradient-to-r from-blue-400 to-sky-500 text-white py-2 rounded-lg shadow-md hover:scale-95 transition"
                >
                  📍 Use My Location
                </button>
              </div>
              {positionError && (
                <p className="text-red-500 text-center mt-2">
                  Location Error: {positionError.message}
                </p>
              )}
            </form>
          ) : (
            <div className="space-y-6">
              <button
                onClick={() => {
                  setWeather(null);
                  setCity("");
                }}
                className="mb-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded"
              >
                🔄 New Search
              </button>

              <div className="text-center space-y-2">
                <h2 className="text-3xl font-semibold text-green-900">
                  {city}
                </h2>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  className="mx-auto w-24 h-24 animate-bounce"
                />
                <p className="text-4xl font-bold">
                  {convertTemperature(weather.main.temp, unit)}°{unit}
                </p>
                <p className="capitalize text-lg text-gray-800">
                  {weather.weather[0].description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-900">
                <InfoCard
                  icon={<HumidityIcon />}
                  label="Humidity"
                  value={`${weather.main.humidity}% (${getHumidityValue(
                    weather.main.humidity
                  )})`}
                />
                <InfoCard
                  icon={<WindIcon />}
                  label="Wind"
                  value={`${weather.wind.speed} m/s (${getWindDirection(
                    weather.wind.deg
                  )})`}
                />
                <InfoCard
                  icon={<VisibilityIcon />}
                  label="Visibility"
                  value={getVisibilityValue(weather.visibility)}
                />
                <InfoCard
                  icon={<SunriseIcon />}
                  label="Sunrise"
                  value={new Date(
                    weather.sys.sunrise * 1000
                  ).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                />
                <InfoCard
                  icon={<SunsetIcon />}
                  label="Sunset"
                  value={new Date(weather.sys.sunset * 1000).toLocaleTimeString(
                    "en-GB",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                />
                <InfoCard
                  label="Feels Like"
                  value={`${convertTemperature(
                    weather.main.feels_like,
                    unit
                  )}°${unit}`}
                />
                <InfoCard
                  label="Pressure"
                  value={`${weather.main.pressure} hPa`}
                />
                <div className="col-span-2">
                  <button
                    onClick={() => setUnit((u) => (u === "C" ? "F" : "C"))}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                  >
                    Switch to °{unit === "C" ? "F" : "C"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className="text-center mt-4 text-red-400 font-medium">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
