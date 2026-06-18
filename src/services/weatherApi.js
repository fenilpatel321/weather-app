import axios from 'axios';

const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export const fetchWeatherByCoords = async (lat, lon) => {
  try {
    const response = await axios.get(
      `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,surface_pressure&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch weather data.');
  }
};

export const fetchCityCoordinates = async (cityName) => {
  try {
    const response = await axios.get(`${GEOCODING_API_URL}?name=${encodeURIComponent(cityName)}&count=1`);
    if (!response.data.results || response.data.results.length === 0) {
      throw new Error('City not found.');
    }
    return response.data.results[0];
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch city coordinates.');
  }
};
