import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { propertyService } from '../services';

const SearchBar = ({ onResults }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim() && !location.trim()) {
      toast.info('Please enter a search term or location');
      return;
    }

    setLoading(true);
    try {
      const filters = {
        search: searchTerm,
        location: location,
        priceRange: priceRange,
        propertyType: propertyType
      };
      
      const results = await propertyService.getAll(filters);
      
      // Filter results based on search criteria
      const filteredResults = results.filter(property => {
        const matchesSearch = !searchTerm || 
          property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesLocation = !location || 
          property.address.toLowerCase().includes(location.toLowerCase());
          
        const matchesType = !propertyType || 
          property.propertyType.toLowerCase() === propertyType.toLowerCase();
          
        return matchesSearch && matchesLocation && matchesType;
      });

      if (onResults) {
        onResults(filteredResults);
      }
      
      toast.success(`Found ${filteredResults.length} properties`);
    } catch (error) {
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async (value) => {
    setSearchTerm(value);
    
    if (value.length > 2) {
      try {
        const properties = await propertyService.getAll();
        const filtered = properties
          .filter(p => p.title.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 5)
          .map(p => p.title);
        setSuggestions(filtered);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Term */}
        <div className="relative lg:col-span-2">
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-10"
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                >
                  {suggestion}
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Location */}
        <div className="relative">
          <ApperIcon name="MapPin" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Price Range */}
        <div>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Any Price</option>
            <option value="0-300000">Under $300K</option>
            <option value="300000-500000">$300K - $500K</option>
            <option value="500000-750000">$500K - $750K</option>
            <option value="750000-1000000">$750K - $1M</option>
            <option value="1000000+">$1M+</option>
          </select>
        </div>

        {/* Property Type */}
        <div>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Property Type</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Condo">Condo</option>
            <option value="Townhouse">Townhouse</option>
          </select>
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-4 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSearch}
          disabled={loading}
          className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <ApperIcon name="Loader2" className="w-5 h-5 animate-spin" />
          ) : (
            <ApperIcon name="Search" className="w-5 h-5" />
          )}
          <span>{loading ? 'Searching...' : 'Search Properties'}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SearchBar;