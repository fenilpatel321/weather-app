import { useState, useCallback } from 'react';
import { fetchWeatherByCoords, fetchCityCoordinates } from '../services/weatherApi';

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentLocationInfo, setCurrentLocationInfo] = useState(null);

  const fetchWeather = useCallback(async (lat, lon, cityName = 'Current Location') => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchWeatherByCoords(lat, lon);
      
      setCurrentLocationInfo({ name: cityName, lat, lon });
      setWeatherData(data.current);

      // Parse hourly data
      const currentHourObj = new Date();
      const nowTime = currentHourObj.getTime();
      let startIndex = 0;
      for (let i = 0; i < data.hourly.time.length; i++) {
        const hTime = new Date(data.hourly.time[i]).getTime();
        if (hTime >= nowTime - 3600000) {
          startIndex = i;
          break;
        }
      }

      const hourly = [];
      for (let i = startIndex; i < startIndex + 24; i++) {
        if (data.hourly.time[i]) {
          const timeDate = new Date(data.hourly.time[i]);
          hourly.push({
            time: timeDate.getHours(),
            temp: data.hourly.temperature_2m[i],
            code: data.hourly.weather_code[i]
          });
        }
      }
      setHourlyData(hourly);

      // Parse daily data
      const daily = [];
      for (let i = 0; i < 7; i++) {
        daily.push({
          date: new Date(data.daily.time[i]),
          maxTemp: data.daily.temperature_2m_max[i],
          minTemp: data.daily.temperature_2m_min[i],
          code: data.daily.weather_code[i],
          sunrise: new Date(data.daily.sunrise[i]),
          sunset: new Date(data.daily.sunset[i]),
          uv: data.daily.uv_index_max[i]
        });
      }
      setDailyData(daily);

    } catch (err) {
      setError(err.message || 'Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCity = useCallback(async (cityName) => {
    if (!cityName.trim()) {
      setError('Please enter a city name.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const location = await fetchCityCoordinates(cityName);
      const formattedCityName = `${location.name}${location.country ? `, ${location.country}` : ''}`;
      await fetchWeather(location.latitude, location.longitude, formattedCityName);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  }, [fetchWeather]);

  return {
    weatherData,
    hourlyData,
    dailyData,
    loading,
    error,
    currentLocationInfo,
    searchCity,
    fetchWeatherByCoords: fetchWeather,
    setError
  };
};
