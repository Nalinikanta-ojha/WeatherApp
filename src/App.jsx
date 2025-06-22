import { useEffect, useState } from "react";
import "./App.css";
import WeatherBackground from "./components/WeatherBackground";
import {
  convertTemperature,
  getHumidityValue,
  getVisibilityValue,
  getWindDirection,
} from "./components/Helper";
import {
  HumidityIcon,
  SunriseIcon,
  SunsetIcon,
  VisibilityIcon,
  WindIcon,
} from "./components/Icon";

const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [suggestion, setSuggestion] = useState([]);
  const [unit, setUnit] = useState("C");
  const [error, setError] = useState("");

  const API_KEY = "112dd024408de7db5bc53c84f8fae57f";

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

  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const getWeatherByLocation = async () => {
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude: lat, longitude: lon } = coords;

        try {
          // Gunupur location
          const gunupurLat = 19.08;
          const gunupurLon = 83.81;

          const isNearGunupur =
            getDistanceKm(lat, lon, gunupurLat, gunupurLon) <= 20;

          const placeName = isNearGunupur ? "Gunupur" : "your location";

          await fetchWeatherData(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
            placeName
          );
        } catch (err) {
          setError("Could not determine your location.");
        }
      },
      () => {
        setError("Location access denied.");
      }
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return setError("Please enter a valid city name");
    await fetchWeatherData(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${API_KEY}&units=metric`
    );
  };

  const getWeatherCondition = () =>
    weather && {
      main: weather.weather[0].main,
      isDay:
        Date.now() / 1000 > weather.sys.sunrise &&
        Date.now() / 1000 < weather.sys.sunset,
    };

  return (
    <div className="min-h-screen">
      <WeatherBackground condition={getWeatherCondition()} />
      <div className="flex items-center justify-center p-6 min-h-screen">
        <div className="bg-transparent backdrop-filter backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-md text-white w-full border border-white/30 relative z-10">
          <h1 className="text-4xl font-extrabold text-center mb-6">
            Weather App
          </h1>
          {!weather ? (
            <form onSubmit={handleSearch} className="flex flex-col relative">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city or country (min 3 letters)"
                className="mb-4 rounded border border-white bg-transparent text-white placeholder-white focus:outline-none focus:border-blue-300 transition-all duration-300"
              />
              {suggestion.length > 0 && (
                <div className="absolute top-12 left-0 right-0 bg-transparent shadow-md rounded z-10">
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
                      className="block hover:bg-blue-700 bg-transparent px-4 py-2 text-sm text-left w-full transition-colors"
                    >
                      {s.name}, {s.country}
                      {s.state && `, ${s.state}`}
                    </button>
                  ))}
                </div>
              )}
              <button
                type="submit"
                className="bg-purple-700 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Get Weather
              </button>
              <button
                type="button"
                onClick={getWeatherByLocation}
                className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 mt-2 rounded transition-colors"
              >
                Use My Location
              </button>
            </form>
          ) : (
            <div className="mt-6 text-center transition-opacity duration-500">
              <button
                onClick={() => {
                  setWeather(null);
                  setCity("");
                }}
                className="mb-4 bg-purple-900 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded transition-colors"
              >
                New Search
              </button>

              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">{city}</h2>
                <button
                  onClick={() => setUnit((u) => (u === "C" ? "F" : "C"))}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-1 px-3 rounded transition-colors"
                >
                  &deg;{unit}
                </button>
              </div>

              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="mx-auto my-4 animate-bounce"
              />
              <p className="text-4xl">
                {convertTemperature(weather.main.temp, unit)} &deg;{unit}
              </p>
              <p className="capitalize">{weather.weather[0].description}</p>
              <div className="flex flex-wrap justify-around mt-6">
                {[
                  [
                    HumidityIcon,
                    "Humidity",
                    `${weather.main.humidity} % (${getHumidityValue(
                      weather.main.humidity
                    )})`,
                  ],
                  [
                    WindIcon,
                    "Wind",
                    `${weather.wind.speed} m/s ${
                      weather.wind.deg
                        ? `(${getWindDirection(weather.wind.deg)})`
                        : ""
                    }`,
                  ],
                  [
                    VisibilityIcon,
                    "Visibility",
                    getVisibilityValue(weather.visibility),
                  ],
                ].map(([Icon, label, value]) => (
                  <div key={label} className="flex flex-col items-center m-2">
                    <Icon />
                    <p className="mt-1 font-semibold">{label}</p>
                    <p className="text-sm">{value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap justify-around mt-6">
                {[
                  [SunriseIcon, "Sunrise", weather.sys.sunrise],
                  [SunsetIcon, "Sunset", weather.sys.sunset],
                ].map(([Icon, label, time]) => (
                  <div key={label} className="flex flex-col items-center m-2">
                    <Icon />
                    <p className="mt-1 font-semibold">{label}</p>
                    <p className="text-sm">
                      {new Date(time * 1000).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-sm">
                <p>
                  <strong>Feels Like:</strong>{" "}
                  {convertTemperature(weather.main.feels_like, unit)} &deg;
                  {unit}
                </p>
                <p>
                  <strong>Pressure:</strong> {weather.main.pressure} hPa
                </p>
              </div>
            </div>
          )}
          {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default App;
