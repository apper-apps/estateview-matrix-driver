import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { filterService } from '../services';

const FilterSidebar = ({ onFilterChange, onSaveFilter }) => {
  const [filters, setFilters] = useState({
    propertyType: [],
    priceRange: [0, 2000000],
    bedrooms: 'Any',
    bathrooms: 'Any',
    squareFeet: [0, 10000],
    amenities: []
  });
  
  const [savedFilters, setSavedFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    loadSavedFilters();
  }, []);

  const loadSavedFilters = async () => {
    setLoading(true);
    try {
      const data = await filterService.getAll();
      setSavedFilters(data);
    } catch (error) {
      toast.error('Failed to load saved filters');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handlePropertyTypeChange = (type) => {
    const newTypes = filters.propertyType.includes(type)
      ? filters.propertyType.filter(t => t !== type)
      : [...filters.propertyType, type];
    
    handleFilterChange('propertyType', newTypes);
  };

  const handleAmenityChange = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    
    handleFilterChange('amenities', newAmenities);
  };

  const handleSaveFilter = async () => {
    if (!filterName.trim()) {
      toast.error('Please enter a filter name');
      return;
    }

    try {
      const filterData = {
        name: filterName,
        propertyType: filters.propertyType,
        priceRange: `${filters.priceRange[0]}-${filters.priceRange[1]}`,
        bedrooms: filters.bedrooms,
        bathrooms: filters.bathrooms,
        squareFeet: `${filters.squareFeet[0]}-${filters.squareFeet[1]}`,
        amenities: filters.amenities
      };

      await filterService.create(filterData);
      toast.success('Filter saved successfully');
      setShowSaveDialog(false);
      setFilterName('');
      loadSavedFilters();
      
      if (onSaveFilter) {
        onSaveFilter(filterData);
      }
    } catch (error) {
      toast.error('Failed to save filter');
    }
  };

  const handleLoadFilter = async (filterId) => {
    try {
      const savedFilter = await filterService.getById(filterId);
      if (savedFilter) {
        const priceRange = savedFilter.priceRange.split('-').map(Number);
        const squareFeet = savedFilter.squareFeet.split('-').map(Number);
        
        const newFilters = {
          propertyType: savedFilter.propertyType,
          priceRange: priceRange,
          bedrooms: savedFilter.bedrooms,
          bathrooms: savedFilter.bathrooms,
          squareFeet: squareFeet,
          amenities: savedFilter.amenities
        };
        
        setFilters(newFilters);
        if (onFilterChange) {
          onFilterChange(newFilters);
        }
        toast.success('Filter loaded successfully');
      }
    } catch (error) {
      toast.error('Failed to load filter');
    }
  };

  const handleDeleteFilter = async (filterId) => {
    if (window.confirm('Are you sure you want to delete this filter?')) {
      try {
        await filterService.delete(filterId);
        toast.success('Filter deleted successfully');
        loadSavedFilters();
      } catch (error) {
        toast.error('Failed to delete filter');
      }
    }
  };

  const clearFilters = () => {
    const defaultFilters = {
      propertyType: [],
      priceRange: [0, 2000000],
      bedrooms: 'Any',
      bathrooms: 'Any',
      squareFeet: [0, 10000],
      amenities: []
    };
    setFilters(defaultFilters);
    if (onFilterChange) {
      onFilterChange(defaultFilters);
    }
  };

  const propertyTypes = ['House', 'Apartment', 'Condo', 'Townhouse'];
  const bedroomOptions = ['Any', '1+', '2+', '3+', '4+'];
  const bathroomOptions = ['Any', '1+', '2+', '3+'];
  const amenityOptions = ['Pool', 'Gym', 'Garage', 'Pet-Friendly', 'Fireplace', 'Balcony', 'Central Air'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-heading font-semibold text-gray-900">Filters</h2>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSaveDialog(true)}
            className="p-2 text-primary hover:bg-primary/10 rounded-md"
            title="Save Filter"
          >
            <ApperIcon name="Save" className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"
            title="Clear Filters"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Property Type */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Property Type</h3>
        <div className="space-y-2">
          {propertyTypes.map(type => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.propertyType.includes(type)}
                onChange={() => handlePropertyTypeChange(type)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>${filters.priceRange[0].toLocaleString()}</span>
            <span>${filters.priceRange[1].toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="0"
            max="2000000"
            step="50000"
            value={filters.priceRange[1]}
            onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
            className="w-full"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Bedrooms</h3>
        <div className="grid grid-cols-3 gap-2">
          {bedroomOptions.map(option => (
            <motion.button
              key={option}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleFilterChange('bedrooms', option)}
              className={`py-2 px-3 text-sm rounded-md border transition-colors ${
                filters.bedrooms === option
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Bathrooms</h3>
        <div className="grid grid-cols-3 gap-2">
          {bathroomOptions.map(option => (
            <motion.button
              key={option}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleFilterChange('bathrooms', option)}
              className={`py-2 px-3 text-sm rounded-md border transition-colors ${
                filters.bathrooms === option
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Square Feet */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Square Feet</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{filters.squareFeet[0].toLocaleString()} sqft</span>
            <span>{filters.squareFeet[1].toLocaleString()} sqft</span>
          </div>
          <input
            type="range"
            min="0"
            max="10000"
            step="500"
            value={filters.squareFeet[1]}
            onChange={(e) => handleFilterChange('squareFeet', [filters.squareFeet[0], parseInt(e.target.value)])}
            className="w-full"
          />
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Amenities</h3>
        <div className="space-y-2">
          {amenityOptions.map(amenity => (
            <label key={amenity} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => handleAmenityChange(amenity)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Saved Filters */}
      {savedFilters.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Saved Filters</h3>
          <div className="space-y-2">
            {savedFilters.map(filter => (
              <div key={filter.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <button
                  onClick={() => handleLoadFilter(filter.id)}
                  className="text-sm text-primary hover:underline"
                >
                  {filter.name}
                </button>
                <button
                  onClick={() => handleDeleteFilter(filter.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Filter Dialog */}
      {showSaveDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold mb-4">Save Filter</h3>
            <input
              type="text"
              placeholder="Filter name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <div className="flex space-x-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveFilter}
                className="flex-1 bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Save
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default FilterSidebar;