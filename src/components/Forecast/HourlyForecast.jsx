import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { getWeatherIcon } from '../../utils/weatherUtils';
import { useWeatherContext } from '../../context/WeatherContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const HourlyForecast = React.memo(({ hourlyData }) => {
  const { formatTemp, unit } = useWeatherContext();

  if (!hourlyData || hourlyData.length === 0) return null;

  // Transform data for the chart based on the current unit
  const chartData = hourlyData.map(hour => ({
    ...hour,
    displayTemp: formatTemp(hour.temp)
  }));

  return (
    <motion.div 
      className="section-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      role="region"
      aria-label="Hourly Forecast"
    >
      <h3 className="section-title">Hourly Forecast</h3>
      <div className="hourly-scroll" tabIndex="0" aria-label="Scrollable hourly forecast list">
        {hourlyData.map((hour, index) => (
          <div key={index} className="hourly-item">
            <span className="hourly-time">{index === 0 ? 'Now' : `${String(hour.time).padStart(2, '0')}:00`}</span>
            {getWeatherIcon(hour.code, 1, 'small')}
            <span className="hourly-temp" aria-label={`${formatTemp(hour.temp)} degrees`}>
              {formatTemp(hour.temp)}°
            </span>
          </div>
        ))}
      </div>
      
      <div style={{ width: '100%', height: 160, marginLeft: '-15px', marginTop: '1rem' }} aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${String(val).padStart(2, '0')}:00`} interval="preserveStartEnd" minTickGap={20} />
            <YAxis domain={['auto', 'auto']} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}°`} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              labelFormatter={(label) => `${String(label).padStart(2, '0')}:00`}
              formatter={(value) => [`${value}°${unit}`, 'Temperature']}
            />
            <Area type="monotone" dataKey="displayTemp" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});

HourlyForecast.displayName = 'HourlyForecast';

HourlyForecast.propTypes = {
  hourlyData: PropTypes.arrayOf(PropTypes.shape({
    time: PropTypes.number.isRequired,
    temp: PropTypes.number.isRequired,
    code: PropTypes.number.isRequired,
  })),
};

export default HourlyForecast;
