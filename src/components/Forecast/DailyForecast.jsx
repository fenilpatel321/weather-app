import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { getWeatherIcon, getDayName } from '../../utils/weatherUtils';
import { useWeatherContext } from '../../context/WeatherContext';

const DailyForecast = React.memo(({ dailyData }) => {
  const { formatTemp } = useWeatherContext();

  if (!dailyData || dailyData.length === 0) return null;

  return (
    <motion.div 
      className="section-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      role="region"
      aria-label="7-Day Forecast"
    >
      <h3 className="section-title">7-Day Forecast</h3>
      <div className="daily-list">
        {dailyData.map((day, index) => (
          <div key={index} className="daily-item" role="listitem">
            <span className="daily-day">{getDayName(day.date, index)}</span>
            <div className="daily-icon-wrapper" aria-hidden="true">
              {getWeatherIcon(day.code, 1, 'small')}
            </div>
            <div className="daily-temp-range" aria-label={`Low of ${formatTemp(day.minTemp)} degrees and high of ${formatTemp(day.maxTemp)} degrees`}>
              <span className="temp-min">{formatTemp(day.minTemp)}°</span>
              <div className="temp-bar" aria-hidden="true"></div>
              <span className="temp-max">{formatTemp(day.maxTemp)}°</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
});

DailyForecast.displayName = 'DailyForecast';

DailyForecast.propTypes = {
  dailyData: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.instanceOf(Date).isRequired,
    minTemp: PropTypes.number.isRequired,
    maxTemp: PropTypes.number.isRequired,
    code: PropTypes.number.isRequired,
  })),
};

export default DailyForecast;
