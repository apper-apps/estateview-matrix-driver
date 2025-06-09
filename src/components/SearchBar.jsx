import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const SearchBar = ({ value, onChange, onFilterToggle, showFilters }) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ApperIcon name="Search" className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by location, property type, or features..."
          className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-gray-900 placeholder-gray-500 transition-colors duration-200"
        />
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onFilterToggle}
        className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-colors duration-200 ${
          showFilters
            ? 'bg-primary text-white border-primary'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`}
      >
        <ApperIcon name="Filter" className="w-5 h-5" />
        <span className="hidden sm:inline font-medium">Filters</span>
      </motion.button>
    </div>
  );
};

export default SearchBar;