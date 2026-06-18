import { FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <motion.div 
      className="error-container animate-fade-in"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <FiAlertCircle className="error-icon" />
      <p>{message}</p>
    </motion.div>
  );
};

export default ErrorMessage;
