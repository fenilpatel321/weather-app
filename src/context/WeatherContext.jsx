import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const WeatherContext = createContext();

export const useWeatherContext = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeatherContext must be used within a WeatherProvider');
  }
  return context;
};

export const WeatherProvider = ({ children }) => {
  const [savedLocations, setSavedLocations] = useLocalStorage('weatherSavedLocations', []);
  const [unit, setUnit] = useLocalStorage('weatherUnit', 'C'); // 'C' or 'F'

  const toggleUnit = useCallback(() => {
    setUnit(prev => (prev === 'C' ? 'F' : 'C'));
  }, [setUnit]);

  const addLocation = useCallback((loc) => {
    setSavedLocations(prev => {
      if (!prev.some(l => l.lat === loc.lat && l.lon === loc.lon)) {
        return [...prev, loc];
      }
      return prev;
    });
  }, [setSavedLocations]);

  const removeLocation = useCallback((locToRemove) => {
    setSavedLocations(prev => prev.filter(loc => loc.lat !== locToRemove.lat || loc.lon !== locToRemove.lon));
  }, [setSavedLocations]);

  const clearLocations = useCallback(() => {
    setSavedLocations([]);
  }, [setSavedLocations]);

  // Convert temperature based on selected unit
  const formatTemp = useCallback((tempInC) => {
    if (unit === 'F') {
      return Math.round((tempInC * 9/5) + 32);
    }
    return Math.round(tempInC);
  }, [unit]);

  const value = useMemo(() => ({
    savedLocations,
    addLocation,
    removeLocation,
    clearLocations,
    unit,
    toggleUnit,
    formatTemp
  }), [savedLocations, addLocation, removeLocation, clearLocations, unit, toggleUnit, formatTemp]);

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

WeatherProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
