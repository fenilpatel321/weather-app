import Dashboard from './pages/Dashboard';
import { WeatherProvider } from './context/WeatherContext';
import ErrorBoundary from './components/UI/ErrorBoundary';
import './index.css';

const App = () => {
  return (
    <ErrorBoundary>
      <WeatherProvider>
        <Dashboard />
      </WeatherProvider>
    </ErrorBoundary>
  );
};

export default App;
