import { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  FiSearch, 
  FiSun, 
  FiCloud, 
  FiCloudRain, 
  FiCloudSnow, 
  FiCloudLightning, 
  FiWind, 
  FiDroplet,
  FiAlertCircle,
  FiLoader,
  FiMapPin,
  FiSunrise,
  FiSunset,
  FiActivity,
  FiStar
} from 'react-icons/fi';
import './index.css';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchedCity, setSearchedCity] = useState('');
  const [currentLocationInfo, setCurrentLocationInfo] = useState(null);
  const [savedLocations, setSavedLocations] = useState(() => {
    const saved = localStorage.getItem('savedLocations');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
  }, [savedLocations]);

  const handleToggleSaveLocation = () => {
    if (!currentLocationInfo) return;
    
    const isSaved = savedLocations.some(loc => loc.lat === currentLocationInfo.lat && loc.lon === currentLocationInfo.lon);
    
    if (isSaved) {
      setSavedLocations(savedLocations.filter(loc => loc.lat !== currentLocationInfo.lat || loc.lon !== currentLocationInfo.lon));
    } else {
      setSavedLocations([...savedLocations, currentLocationInfo]);
    }
  };

  const getWeatherIcon = (code, isDay = 1, size = 'normal') => {
    const iconClass = size === 'small' ? 'weather-icon-small' : 'weather-icon';
    if (code === 0) return <FiSun className={iconClass} style={isDay ? {} : { color: '#94a3b8' }} />;
    if (code >= 1 && code <= 3) return <FiCloud className={iconClass} style={{ color: '#9ca3af' }} />;
    if (code >= 45 && code <= 48) return <FiCloud className={iconClass} style={{ color: '#cbd5e1' }} />;
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <FiCloudRain className={iconClass} style={{ color: '#60a5fa' }} />;
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return <FiCloudSnow className={iconClass} style={{ color: '#e2e8f0' }} />;
    if (code >= 95 && code <= 99) return <FiCloudLightning className={iconClass} style={{ color: '#a78bfa' }} />;
    return <FiSun className={iconClass} />;
  };

  const getWeatherDescription = (code) => {
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

  const fetchWeatherByCoords = async (lat, lon, cityName = 'Current Location') => {
    setLoading(true);
    setError('');
    
    try {
      const weatherRes = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,surface_pressure&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`
      );
      
      setSearchedCity(cityName);
      const newLocInfo = { name: cityName, lat, lon };
      setCurrentLocationInfo(newLocInfo);
      
      setSavedLocations(prev => {
        const isSaved = prev.some(loc => loc.lat === newLocInfo.lat && loc.lon === newLocInfo.lon);
        if (!isSaved) {
          return [...prev, newLocInfo];
        }
        return prev;
      });

      setWeatherData(weatherRes.data.current);
      
      // Parse hourly data (next 24 hours)
      // Open-Meteo returns hourly from midnight, we need from current hour.
      const currentHourObj = new Date();
      // Find the index in the hourly array that matches our current hour
      // Open meteo format: "2023-10-26T12:00"
      const nowTime = currentHourObj.getTime();
      let startIndex = 0;
      for (let i = 0; i < weatherRes.data.hourly.time.length; i++) {
        const hTime = new Date(weatherRes.data.hourly.time[i]).getTime();
        if (hTime >= nowTime - 3600000) {
           startIndex = i;
           break;
        }
      }

      const hourly = [];
      for(let i=startIndex; i<startIndex+24; i++) {
        if(weatherRes.data.hourly.time[i]) {
            const timeDate = new Date(weatherRes.data.hourly.time[i]);
            hourly.push({
            time: timeDate.getHours(),
            temp: weatherRes.data.hourly.temperature_2m[i],
            code: weatherRes.data.hourly.weather_code[i]
            });
        }
      }
      setHourlyData(hourly);
      
      // Parse daily data (7 days)
      const daily = [];
      for(let i=0; i<7; i++) {
        daily.push({
          date: new Date(weatherRes.data.daily.time[i]),
          maxTemp: weatherRes.data.daily.temperature_2m_max[i],
          minTemp: weatherRes.data.daily.temperature_2m_min[i],
          code: weatherRes.data.daily.weather_code[i],
          sunrise: new Date(weatherRes.data.daily.sunrise[i]),
          sunset: new Date(weatherRes.data.daily.sunset[i]),
          uv: weatherRes.data.daily.uv_index_max[i]
        });
      }
      setDailyData(daily);
      
    } catch (err) {
      setError('Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (searchCity) => {
    if (!searchCity.trim()) {
      setError('Please enter a city name.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const geoRes = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchCity)}&count=1`);
      
      if (!geoRes.data.results || geoRes.data.results.length === 0) {
        throw new Error('City not found.');
      }

      const location = geoRes.data.results[0];
      const cityName = `${location.name}${location.country ? `, ${location.country}` : ''}`;
      
      await fetchWeatherByCoords(location.latitude, location.longitude, cityName);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
          setCity('');
        },
        () => {
          setError('Unable to retrieve your location. Please check permissions.');
        }
      );
    } else {
      setError('Geolocation not supported by your browser.');
    }
  };

  useEffect(() => {
    fetchWeather('London');
    setCity('London');
  }, []);

  const formatTime = (dateObj) => {
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getDayName = (dateObj, index) => {
    if (index === 0) return 'Today';
    return dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="app-container glass-panel">
      
      <div className="search-header">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Enter city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? <FiLoader className="animate-spin" /> : <FiSearch />}
          </button>
        </form>
        <button className="location-button" onClick={useCurrentLocation} title="Use Current Location">
          <FiMapPin />
        </button>
      </div>

      {savedLocations.length > 0 && (
        <div className="saved-locations-container animate-fade-in" style={{ width: '100%', marginTop: '5px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>Your Locations</span>
            {savedLocations.length > 1 && (
              <button 
                onClick={() => setSavedLocations([])} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--error)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                Clear All
              </button>
            )}
          </div>
          <div className="saved-locations" style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '15px', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingLeft: '2px', paddingRight: '2px' }}>
            {savedLocations.map((loc, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  setCity(loc.name);
                  fetchWeatherByCoords(loc.lat, loc.lon, loc.name);
                }}
                style={{ 
                  position: 'relative',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '10px 16px', 
                  borderRadius: '14px', 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  backdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  minWidth: 'max-content'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.25)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                <FiMapPin style={{ color: 'var(--primary)', fontSize: '1rem' }} />
                <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: '500', letterSpacing: '0.02em' }}>
                  {loc.name.split(',')[0]}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSavedLocations(savedLocations.filter(l => l.lat !== loc.lat || l.lon !== loc.lon));
                  }}
                  style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    border: 'none', 
                    color: 'var(--text-muted)', 
                    cursor: 'pointer', 
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginLeft: '4px',
                    transition: 'all 0.2s',
                    fontSize: '1rem'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.8)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                  title="Remove location"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="error-container animate-fade-in">
          <FiAlertCircle className="error-icon" />
          <p>{error}</p>
        </div>
      )}

      {loading && !error && (
        <div className="loading-container">
          <FiLoader className="animate-spin" style={{ fontSize: '3rem', color: 'var(--primary)' }} />
          <p>Fetching real-time data...</p>
        </div>
      )}

      {weatherData && !loading && !error && (
        <div className="weather-content animate-fade-in">
          {/* Main Current Weather */}
          <div className="current-weather">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '5px' }}>
              <h2 className="city-name" style={{ margin: 0, marginBottom: 0 }}>{searchedCity}</h2>
              <button 
                onClick={handleToggleSaveLocation} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: (currentLocationInfo && savedLocations.some(loc => loc.lat === currentLocationInfo.lat && loc.lon === currentLocationInfo.lon)) ? '#fbbf24' : 'var(--text-muted)', 
                  cursor: 'pointer', 
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0,
                  transition: 'color 0.3s'
                }}
                title="Save Location"
              >
                <FiStar fill={(currentLocationInfo && savedLocations.some(loc => loc.lat === currentLocationInfo.lat && loc.lon === currentLocationInfo.lon)) ? '#fbbf24' : 'transparent'} />
              </button>
            </div>
            <p className="weather-desc">{getWeatherDescription(weatherData.weather_code)}</p>
            <div className="temp-main">
              {getWeatherIcon(weatherData.weather_code, weatherData.is_day)}
              <div className="temperature">
                {Math.round(weatherData.temperature_2m)}<span className="degree">°</span>
              </div>
            </div>
            <p className="feels-like">Feels like {Math.round(weatherData.apparent_temperature)}°</p>
          </div>

          {/* Hourly Forecast */}
          <div className="section-container">
            <h3 className="section-title">Hourly Forecast</h3>
            <div className="hourly-scroll">
              {hourlyData.map((hour, index) => (
                <div key={index} className="hourly-item">
                  <span className="hourly-time">{index === 0 ? 'Now' : `${String(hour.time).padStart(2, '0')}:00`}</span>
                  {getWeatherIcon(hour.code, 1, 'small')}
                  <span className="hourly-temp">{Math.round(hour.temp)}°</span>
                </div>
              ))}
            </div>
          </div>

          {/* Temperature Trend Graph */}
          <div className="section-container">
            <h3 className="section-title">Temperature Trend (24h)</h3>
            <div style={{ width: '100%', height: 160, marginLeft: '-15px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${String(val).padStart(2, '0')}:00`} interval="preserveStartEnd" minTickGap={20} />
                  <YAxis domain={['auto', 'auto']} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${Math.round(val)}°`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    labelFormatter={(label) => `${String(label).padStart(2, '0')}:00`}
                    formatter={(value) => [`${Math.round(value)}°C`, 'Temperature']}
                  />
                  <Area type="monotone" dataKey="temp" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="section-container">
            <h3 className="section-title">7-Day Forecast</h3>
            <div className="daily-list">
              {dailyData.map((day, index) => (
                <div key={index} className="daily-item">
                  <span className="daily-day">{getDayName(day.date, index)}</span>
                  <div className="daily-icon-wrapper">
                    {getWeatherIcon(day.code, 1, 'small')}
                  </div>
                  <div className="daily-temp-range">
                    <span className="temp-min">{Math.round(day.minTemp)}°</span>
                    <div className="temp-bar"></div>
                    <span className="temp-max">{Math.round(day.maxTemp)}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Extra Details Grid */}
          <div className="details-grid">
            <div className="detail-card">
              <FiWind className="detail-icon" />
              <div className="detail-info">
                <span className="detail-label">Wind</span>
                <span className="detail-value">{weatherData.wind_speed_10m} km/h</span>
              </div>
            </div>
            
            <div className="detail-card">
              <FiDroplet className="detail-icon" />
              <div className="detail-info">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{weatherData.relative_humidity_2m}%</span>
              </div>
            </div>

            <div className="detail-card">
              <FiSun className="detail-icon" />
              <div className="detail-info">
                <span className="detail-label">UV Index</span>
                <span className="detail-value">{dailyData[0] ? Math.round(dailyData[0].uv) : '--'}</span>
              </div>
            </div>

            <div className="detail-card">
              <FiActivity className="detail-icon" />
              <div className="detail-info">
                <span className="detail-label">Pressure</span>
                <span className="detail-value">{weatherData.surface_pressure} hPa</span>
              </div>
            </div>

            {dailyData[0] && (
              <>
                <div className="detail-card">
                  <FiSunrise className="detail-icon" />
                  <div className="detail-info">
                    <span className="detail-label">Sunrise</span>
                    <span className="detail-value">{formatTime(dailyData[0].sunrise)}</span>
                  </div>
                </div>
                <div className="detail-card">
                  <FiSunset className="detail-icon" />
                  <div className="detail-info">
                    <span className="detail-label">Sunset</span>
                    <span className="detail-value">{formatTime(dailyData[0].sunset)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
