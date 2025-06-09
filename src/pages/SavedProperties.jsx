import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import PropertyCard from '../components/PropertyCard';
import { savedPropertiesService, propertyService } from '../services';

const SavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSavedProperties();
  }, []);

  const loadSavedProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const [savedData, allProperties] = await Promise.all([
        savedPropertiesService.getAll(),
        propertyService.getAll()
      ]);
      
      // Get the actual property data for saved property IDs
      const savedPropertyDetails = savedData
        .map(saved => {
          const property = allProperties.find(p => p.id === saved.propertyId);
          return property ? { ...property, savedDate: saved.savedDate, savedId: saved.id } : null;
        })
        .filter(Boolean);

      setSavedProperties(savedData);
      setProperties(savedPropertyDetails);
    } catch (err) {
      setError(err.message || 'Failed to load saved properties');
      toast.error('Failed to load saved properties');
    } finally {
      setLoading(false);
    }
  };

  const removeSavedProperty = async (savedId, propertyTitle) => {
    try {
      await savedPropertiesService.delete(savedId);
      setSavedProperties(prev => prev.filter(item => item.id !== savedId));
      setProperties(prev => prev.filter(item => item.savedId !== savedId));
      toast.success(`Removed "${propertyTitle}" from saved properties`);
    } catch (error) {
      toast.error('Failed to remove property');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          
          {/* Property grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="animate-pulse"
              >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load saved properties</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadSavedProperties}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
          Saved Properties
        </h1>
        <p className="text-gray-600">
          {properties.length} {properties.length === 1 ? 'property' : 'properties'} saved for later
        </p>
      </motion.div>

      {/* Content */}
      {properties.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Heart" className="w-16 h-16 text-gray-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-heading font-medium text-gray-900">No saved properties yet</h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            Start browsing properties and save your favorites to keep track of them here.
          </p>
          <motion.a
            href="/browse"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Browse Properties
          </motion.a>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <PropertyCard property={property} />
              
              {/* Remove button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeSavedProperty(property.savedId, property.title)}
                className="absolute top-3 left-3 bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                title="Remove from saved"
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </motion.button>
              
              {/* Saved date */}
              <div className="absolute bottom-3 right-3 bg-white/90 text-xs text-gray-600 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Saved {new Date(property.savedDate).toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedProperties;