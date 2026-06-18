import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ width, height, borderRadius = '8px', style = {}, className = '' }) => {
  return (
    <div 
      className={`skeleton-shimmer ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
      aria-hidden="true"
    />
  );
};

export const WeatherSkeleton = () => {
  return (
    <motion.div 
      className="weather-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="current-weather" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Skeleton width="150px" height="32px" style={{ marginBottom: '10px' }} />
        <Skeleton width="100px" height="20px" style={{ marginBottom: '20px' }} />
        <Skeleton width="80px" height="80px" borderRadius="50%" style={{ marginBottom: '20px' }} />
        <Skeleton width="120px" height="60px" style={{ marginBottom: '10px' }} />
        <Skeleton width="80px" height="16px" />
      </div>

      <div className="section-container">
        <Skeleton width="120px" height="20px" style={{ marginBottom: '15px' }} />
        <div style={{ display: 'flex', gap: '15px' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <Skeleton width="30px" height="15px" />
              <Skeleton width="30px" height="30px" borderRadius="50%" />
              <Skeleton width="30px" height="15px" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Skeleton;
