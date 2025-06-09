import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import PropertyCard from '../components/PropertyCard';
import { propertyService } from '../services';

const MapView = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // Default to NYC
  const [hoveredProperty, setHoveredProperty] = useState(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await propertyService.getAll();
      setProperties(data);
      
      // Set map center to first property if available
      if (data.length > 0 && data[0].coordinates) {
        setMapCenter(data[0].coordinates);
      }
    } catch (err) {
      setError(err.message || 'Failed to load properties');
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleMarkerClick = (property) => {
    setSelectedProperty(property);
    setMapCenter(property.coordinates);
  };

  const closePropertyDetail = () => {
    setSelectedProperty(null);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <ApperIcon name="Loader2" className="w-8 h-8 text-primary mx-auto" />
          </motion.div>
          <p className="text-gray-600">Loading map...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load map</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadProperties}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Map Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-heading font-semibold text-gray-900">
            Map View
          </h1>
          <div className="text-sm text-gray-600">
            {properties.length} properties shown
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative overflow-hidden">
        {/* Simulated Map */}
        <div className="w-full h-full bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 relative">
          {/* Map Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          {/* Property Markers */}
          {properties.map((property, index) => {
            const x = 20 + (index % 8) * 12; // Spread across width
            const y = 20 + Math.floor(index / 8) * 15; // Stack vertically
            
            return (
              <motion.div
                key={property.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="absolute cursor-pointer z-10"
                style={{ 
                  left: `${x}%`, 
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onMouseEnter={() => setHoveredProperty(property)}
                onMouseLeave={() => setHoveredProperty(null)}
                onClick={() => handleMarkerClick(property)}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative transition-all duration-200 ${
                    selectedProperty?.id === property.id || hoveredProperty?.id === property.id
                      ? 'z-20'
                      : 'z-10'
                  }`}
                >
                  {/* Price Badge */}
                  <div className={`px-3 py-1.5 rounded-full text-sm font-medium text-white shadow-lg transition-all duration-200 ${
                    selectedProperty?.id === property.id
                      ? 'bg-accent scale-110'
                      : hoveredProperty?.id === property.id
                      ? 'bg-primary scale-105'
                      : 'bg-primary'
                  }`}>
                    {formatPrice(property.price)}
                  </div>
                  
                  {/* Marker Pin */}
                  <div className={`w-3 h-3 rounded-full mx-auto mt-1 transition-all duration-200 ${
                    selectedProperty?.id === property.id
                      ? 'bg-accent'
                      : hoveredProperty?.id === property.id
                      ? 'bg-primary'
                      : 'bg-primary'
                  }`} />
                  
                  {/* Hover Tooltip */}
                  <AnimatePresence>
                    {hoveredProperty?.id === property.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl p-3 min-w-64 z-30"
                      >
                        <div className="text-sm">
                          <h4 className="font-semibold text-gray-900 mb-1">{property.title}</h4>
                          <p className="text-gray-600 mb-2">{property.address}</p>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span>{property.bedrooms} beds</span>
                            <span>{property.bathrooms} baths</span>
                            <span>{property.squareFeet.toLocaleString()} sqft</span>
                          </div>
                        </div>
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2 z-30">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white shadow-md rounded-lg p-2 hover:bg-gray-50 transition-colors"
            >
              <ApperIcon name="Plus" className="w-5 h-5 text-gray-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white shadow-md rounded-lg p-2 hover:bg-gray-50 transition-colors"
            >
              <ApperIcon name="Minus" className="w-5 h-5 text-gray-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white shadow-md rounded-lg p-2 hover:bg-gray-50 transition-colors"
            >
              <ApperIcon name="RotateCcw" className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-30">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Map Legend</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-gray-600">Available Property</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-gray-600">Selected Property</span>
              </div>
            </div>
          </div>
        </div>

        {/* Property Detail Panel */}
        <AnimatePresence>
          {selectedProperty && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              className="absolute top-0 right-0 w-96 h-full bg-white shadow-xl z-40 overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-heading font-semibold text-gray-900">Property Details</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closePropertyDetail}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="p-4">
                <PropertyCard property={selectedProperty} viewMode="grid" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MapView;