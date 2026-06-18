import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiSearch, FiMapPin, FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';

const SearchBar = React.memo(({ onSearch, onUseLocation, loading }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
      setCity('');
    }
  };

  return (
    <motion.div 
      className="search-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="search"
    >
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          aria-label="City name to search for weather"
        />
        <button type="submit" className="search-button" disabled={loading} aria-label="Search weather">
          {loading ? <FiLoader className="animate-spin" aria-hidden="true" /> : <FiSearch aria-hidden="true" />}
        </button>
      </form>
      <button 
        className="location-button" 
        onClick={onUseLocation} 
        title="Use Current Location"
        aria-label="Get weather for your current location"
      >
        <FiMapPin aria-hidden="true" />
      </button>
    </motion.div>
  );
});

SearchBar.displayName = 'SearchBar';

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onUseLocation: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default SearchBar;
