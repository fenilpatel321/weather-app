import { FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Loader = ({ text = "Fetching real-time data..." }) => {
  return (
    <motion.div 
      className="loading-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <FiLoader className="animate-spin" style={{ fontSize: '3rem', color: 'var(--primary)' }} />
      <p>{text}</p>
    </motion.div>
  );
};

export default Loader;
