import { 
  FiSun, 
  FiCloud, 
  FiCloudRain, 
  FiCloudSnow, 
  FiCloudLightning 
} from 'react-icons/fi';

export const getWeatherIcon = (code, isDay = 1, size = 'normal') => {
  const iconClass = size === 'small' ? 'weather-icon-small' : 'weather-icon';
  if (code === 0) return <FiSun className={iconClass} style={isDay ? {} : { color: '#94a3b8' }} />;
  if (code >= 1 && code <= 3) return <FiCloud className={iconClass} style={{ color: '#9ca3af' }} />;
  if (code >= 45 && code <= 48) return <FiCloud className={iconClass} style={{ color: '#cbd5e1' }} />;
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <FiCloudRain className={iconClass} style={{ color: '#60a5fa' }} />;
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return <FiCloudSnow className={iconClass} style={{ color: '#e2e8f0' }} />;
  if (code >= 95 && code <= 99) return <FiCloudLightning className={iconClass} style={{ color: '#a78bfa' }} />;
  return <FiSun className={iconClass} />;
};

export const getWeatherDescription = (code) => {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 45 && code <= 48) return 'Fog';
  if (code >= 51 && code <= 57) return 'Drizzle';
  if (code >= 61 && code <= 67) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code >= 85 && code <= 86) return 'Snow showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Unknown';
};

export const formatTime = (dateObj) => {
  if (!dateObj) return '--:--';
  return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const getDayName = (dateObj, index) => {
  if (!dateObj) return '';
  if (index === 0) return 'Today';
  return dateObj.toLocaleDateString('en-US', { weekday: 'short' });
};
