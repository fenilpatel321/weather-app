import React from 'react';
import PropTypes from 'prop-types';
import { FiMapPin } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const SavedLocations = React.memo(({ savedLocations, onSelectLocation, onRemoveLocation, onClearAll }) => {
  if (!savedLocations || savedLocations.length === 0) return null;

  return (
    <motion.div 
      className="saved-locations-container"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      style={{ width: '100%', marginTop: '5px' }}
      role="region"
      aria-label="Saved Locations"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>Your Locations</span>
        {savedLocations.length > 1 && (
          <button 
            onClick={onClearAll} 
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--error)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            aria-label="Clear all saved locations"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="saved-locations" style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '15px', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingLeft: '2px', paddingRight: '2px' }} role="list">
        <AnimatePresence>
          {savedLocations.map((loc) => (
            <motion.div 
              key={`${loc.lat}-${loc.lon}`}
              role="listitem"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onSelectLocation(loc)}
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
              aria-label={`Select saved location: ${loc.name.split(',')[0]}`}
            >
              <FiMapPin style={{ color: 'var(--primary)', fontSize: '1rem' }} aria-hidden="true" />
              <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: '500', letterSpacing: '0.02em' }}>
                {loc.name.split(',')[0]}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveLocation(loc);
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
                aria-label={`Remove ${loc.name.split(',')[0]} from saved locations`}
              >
                &times;
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

SavedLocations.displayName = 'SavedLocations';

SavedLocations.propTypes = {
  savedLocations: PropTypes.arrayOf(PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  onSelectLocation: PropTypes.func.isRequired,
  onRemoveLocation: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
};

export default SavedLocations;
