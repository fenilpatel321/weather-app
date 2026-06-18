import React from 'react';
import PropTypes from 'prop-types';
import { FiWind, FiDroplet, FiSun, FiActivity, FiSunrise, FiSunset } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { formatTime } from '../../utils/weatherUtils';

const WeatherDetails = React.memo(({ weatherData, dailyData }) => {
  if (!weatherData) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.4 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="details-grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      role="region"
      aria-label="Additional Weather Details"
    >
      <motion.div variants={itemVariants} className="detail-card">
        <FiWind className="detail-icon" aria-hidden="true" />
        <div className="detail-info">
          <span className="detail-label">Wind</span>
          <span className="detail-value">{weatherData.wind_speed_10m} km/h</span>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="detail-card">
        <FiDroplet className="detail-icon" aria-hidden="true" />
        <div className="detail-info">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{weatherData.relative_humidity_2m}%</span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="detail-card">
        <FiSun className="detail-icon" aria-hidden="true" />
        <div className="detail-info">
          <span className="detail-label">UV Index</span>
          <span className="detail-value">{dailyData && dailyData[0] ? Math.round(dailyData[0].uv) : '--'}</span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="detail-card">
        <FiActivity className="detail-icon" aria-hidden="true" />
        <div className="detail-info">
          <span className="detail-label">Pressure</span>
          <span className="detail-value">{weatherData.surface_pressure} hPa</span>
        </div>
      </motion.div>

      {dailyData && dailyData[0] && (
        <>
          <motion.div variants={itemVariants} className="detail-card">
            <FiSunrise className="detail-icon" aria-hidden="true" />
            <div className="detail-info">
              <span className="detail-label">Sunrise</span>
              <span className="detail-value">{formatTime(dailyData[0].sunrise)}</span>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="detail-card">
            <FiSunset className="detail-icon" aria-hidden="true" />
            <div className="detail-info">
              <span className="detail-label">Sunset</span>
              <span className="detail-value">{formatTime(dailyData[0].sunset)}</span>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
});

WeatherDetails.displayName = 'WeatherDetails';

WeatherDetails.propTypes = {
  weatherData: PropTypes.shape({
    wind_speed_10m: PropTypes.number,
    relative_humidity_2m: PropTypes.number,
    surface_pressure: PropTypes.number,
  }),
  dailyData: PropTypes.arrayOf(PropTypes.shape({
    uv: PropTypes.number,
    sunrise: PropTypes.instanceOf(Date),
    sunset: PropTypes.instanceOf(Date),
  })),
};

export default WeatherDetails;
