import React, { useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useWeather } from '../hooks/useWeather';
import { useGeolocation } from '../hooks/useGeolocation';
import { useWeatherContext } from '../context/WeatherContext';

import SearchBar from '../components/SearchBar/SearchBar';
import SavedLocations from '../components/SavedLocations/SavedLocations';
import CurrentWeather from '../components/CurrentWeather/CurrentWeather';
import WeatherDetails from '../components/WeatherDetails/WeatherDetails';
import ErrorMessage from '../components/UI/ErrorMessage';
import { WeatherSkeleton } from '../components/UI/Skeleton';

// Lazy load the charts for performance
const HourlyForecast = React.lazy(() => import('../components/Forecast/HourlyForecast'));
const DailyForecast = React.lazy(() => import('../components/Forecast/DailyForecast'));

const Dashboard = () => {
  const {
    weatherData,
    hourlyData,
    dailyData,
    loading: weatherLoading,
    error: weatherError,
    currentLocationInfo,
    searchCity,
    fetchWeatherByCoords,
    setError: setWeatherError
  } = useWeather();

  const { location, getLocation, loading: geoLoading, error: geoError } = useGeolocation();
  
  // Use global context for saved locations and units
  const { savedLocations, addLocation, removeLocation, clearLocations, unit, toggleUnit } = useWeatherContext();

  // Fetch initial data
  useEffect(() => {
    searchCity('London'); // Default city
  }, [searchCity]);

  // Handle geolocation updates
  useEffect(() => {
    if (location) {
      fetchWeatherByCoords(location.lat, location.lon, 'Current Location');
    }
  }, [location, fetchWeatherByCoords]);

  // Handle geolocation errors
  useEffect(() => {
    if (geoError) {
      setWeatherError(geoError);
    }
  }, [geoError, setWeatherError]);

  // Update dynamic background
  useEffect(() => {
    if (weatherData) {
      const code = weatherData.weather_code;
      const isDay = weatherData.is_day;
      
      document.body.className = ''; // reset
      if (code === 0) document.body.classList.add(isDay ? 'theme-clear-day' : 'theme-clear-night');
      else if (code >= 1 && code <= 3) document.body.classList.add(isDay ? 'theme-cloudy-day' : 'theme-cloudy-night');
      else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) document.body.classList.add('theme-rainy');
      else if ((code >= 71 && code <= 77) || code === 85 || code === 86) document.body.classList.add('theme-snowy');
      else if (code >= 95 && code <= 99) document.body.classList.add('theme-stormy');
      else document.body.classList.add('theme-default');
    }
  }, [weatherData]);

  const handleToggleSaveLocation = () => {
    if (!currentLocationInfo) return;
    
    const isSaved = savedLocations.some(loc => loc.lat === currentLocationInfo.lat && loc.lon === currentLocationInfo.lon);
    
    if (isSaved) {
      removeLocation(currentLocationInfo);
    } else {
      addLocation(currentLocationInfo);
    }
  };

  const handleSelectLocation = (loc) => {
    fetchWeatherByCoords(loc.lat, loc.lon, loc.name);
  };

  const isLoading = weatherLoading || geoLoading;

  return (
    <motion.div 
      className="app-container glass-panel"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      role="main"
      aria-label="Weather Dashboard"
    >
      <header style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-10px' }}>
        <button 
          onClick={toggleUnit}
          className="unit-toggle"
          aria-label={`Switch to ${unit === 'C' ? 'Fahrenheit' : 'Celsius'}`}
        >
          °{unit}
        </button>
      </header>

      <SearchBar 
        onSearch={searchCity} 
        onUseLocation={getLocation} 
        loading={isLoading} 
      />

      <SavedLocations 
        savedLocations={savedLocations}
        onSelectLocation={handleSelectLocation}
        onRemoveLocation={removeLocation}
        onClearAll={clearLocations}
      />

      <AnimatePresence mode="wait">
        {weatherError ? (
          <ErrorMessage key="error" message={weatherError} />
        ) : isLoading ? (
          <WeatherSkeleton key="skeleton" />
        ) : weatherData ? (
          <motion.div 
            key="content"
            className="weather-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CurrentWeather 
              weatherData={weatherData}
              searchedCity={currentLocationInfo?.name}
              currentLocationInfo={currentLocationInfo}
              savedLocations={savedLocations}
              onToggleSave={handleToggleSaveLocation}
            />
            
            <Suspense fallback={<WeatherSkeleton />}>
              <HourlyForecast hourlyData={hourlyData} />
              <DailyForecast dailyData={dailyData} />
            </Suspense>
            
            <WeatherDetails weatherData={weatherData} dailyData={dailyData} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
