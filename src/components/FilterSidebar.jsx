import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const FilterSidebar = ({ filters, onChange, properties, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handlePriceChange = (min, max) => {
    const newFilters = { 
      ...localFilters, 
      priceMin: min || null, 
      priceMax: max || null 
    };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handlePropertyTypeChange = (type) => {
    const currentTypes = localFilters.propertyTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    handleFilterChange('propertyTypes', newTypes);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      priceMin: null,
      priceMax: null,
      propertyTypes: [],
      bedroomsMin: null,
      bathroomsMin: null,
      location: ''
    };
    setLocalFilters(clearedFilters);
    onChange(clearedFilters);
  };

  // Get unique property types and price range
  const propertyTypes = [...new Set(properties.map(p => p.propertyType))];
  const prices = properties.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearAllFilters}
          className="text-accent hover:text-accent/80 text-sm font-medium"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Min Price</label>
                <input
                  type="number"
                  value={localFilters.priceMin || ''}
                  onChange={(e) => handlePriceChange(e.target.value ? parseInt(e.target.value) : null, localFilters.priceMax)}
                  placeholder={`$${minPrice.toLocaleString()}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max Price</label>
                <input
                  type="number"
                  value={localFilters.priceMax || ''}
                  onChange={(e) => handlePriceChange(localFilters.priceMin, e.target.value ? parseInt(e.target.value) : null)}
                  placeholder={`$${maxPrice.toLocaleString()}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            
            {/* Quick price buttons */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Under $500K', max: 500000 },
                { label: '$500K - $1M', min: 500000, max: 1000000 },
                { label: '$1M - $2M', min: 1000000, max: 2000000 },
                { label: 'Over $2M', min: 2000000 }
              ].map((range, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePriceChange(range.min, range.max)}
                  className={`px-3 py-2 text-xs rounded-md border transition-colors ${
                    (localFilters.priceMin === (range.min || null) && localFilters.priceMax === (range.max || null))
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {range.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Property Type</h4>
          <div className="space-y-2">
            {propertyTypes.map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(localFilters.propertyTypes || []).includes(type)}
                  onChange={() => handlePropertyTypeChange(type)}
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                />
                <span className="ml-2 text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Minimum Bedrooms</h4>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((beds) => (
              <motion.button
                key={beds}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange('bedroomsMin', 
                  localFilters.bedroomsMin === beds ? null : beds
                )}
                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                  localFilters.bedroomsMin === beds
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {beds}+
              </motion.button>
            ))}
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Minimum Bathrooms</h4>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((baths) => (
              <motion.button
                key={baths}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange('bathroomsMin', 
                  localFilters.bathroomsMin === baths ? null : baths
                )}
                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                  localFilters.bathroomsMin === baths
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {baths}+
              </motion.button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Location</h4>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ApperIcon name="MapPin" className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={localFilters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              placeholder="Enter city, neighborhood, or ZIP"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Apply button for mobile */}
      {onClose && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Apply Filters
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;