import React from 'react';
import PropTypes from 'prop-types';
import { FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { getWeatherIcon, getWeatherDescription } from '../../utils/weatherUtils';
import { useWeatherContext } from '../../context/WeatherContext';

const CurrentWeather = React.memo(({ weatherData, searchedCity, currentLocationInfo, savedLocations, onToggleSave }) => {
  const { formatTemp } = useWeatherContext();

  if (!weatherData) return null;

  const isSaved = currentLocationInfo && savedLocations.some(loc => loc.lat === currentLocationInfo.lat && loc.lon === currentLocationInfo.lon);

  return (
    <motion.div 
      className="current-weather"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      role="region"
      aria-label={`Current weather in ${searchedCity}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '5px' }}>
        <h2 className="city-name" style={{ margin: 0, marginBottom: 0 }}>{searchedCity}</h2>
        <button 
          onClick={onToggleSave} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: isSaved ? '#fbbf24' : 'var(--text-muted)', 
            cursor: 'pointer', 
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            transition: 'color 0.3s'
          }}
          title={isSaved ? "Remove Location" : "Save Location"}
          aria-label={isSaved ? "Remove from saved locations" : "Save this location"}
          aria-pressed={isSaved}
        >
          <FiStar fill={isSaved ? '#fbbf24' : 'transparent'} aria-hidden="true" />
        </button>
      </div>
      <p className="weather-desc" aria-live="polite">{getWeatherDescription(weatherData.weather_code)}</p>
      <div className="temp-main">
        {getWeatherIcon(weatherData.weather_code, weatherData.is_day)}
        <div className="temperature" aria-label={`Temperature is ${formatTemp(weatherData.temperature_2m)} degrees`}>
          {formatTemp(weatherData.temperature_2m)}<span className="degree" aria-hidden="true">°</span>
        </div>
      </div>
      <p className="feels-like">Feels like {formatTemp(weatherData.apparent_temperature)}°</p>
    </motion.div>
  );
});

CurrentWeather.displayName = 'CurrentWeather';

CurrentWeather.propTypes = {
  weatherData: PropTypes.shape({
    weather_code: PropTypes.number.isRequired,
    is_day: PropTypes.number.isRequired,
    temperature_2m: PropTypes.number.isRequired,
    apparent_temperature: PropTypes.number.isRequired,
  }),
  searchedCity: PropTypes.string,
  currentLocationInfo: PropTypes.shape({
    lat: PropTypes.number,
    lon: PropTypes.number,
    name: PropTypes.string,
  }),
  savedLocations: PropTypes.array.isRequired,
  onToggleSave: PropTypes.func.isRequired,
};

export default CurrentWeather;
