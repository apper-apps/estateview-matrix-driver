import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import ImageCarousel from '../components/ImageCarousel';
import { propertyService, savedPropertiesService } from '../services';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadProperty();
  }, [id]);

  useEffect(() => {
    if (property) {
      checkIfSaved();
    }
  }, [property]);

  const loadProperty = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await propertyService.getById(id);
      if (data) {
        setProperty(data);
      } else {
        setError('Property not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to load property');
      toast.error('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const saved = await savedPropertiesService.getAll();
      setIsSaved(saved.some(item => item.propertyId === property.id));
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const toggleSaved = async () => {
    try {
      if (isSaved) {
        const saved = await savedPropertiesService.getAll();
        const savedItem = saved.find(item => item.propertyId === property.id);
        if (savedItem) {
          await savedPropertiesService.delete(savedItem.id);
          setIsSaved(false);
          toast.success('Removed from saved properties');
        }
      } else {
        await savedPropertiesService.create({
          propertyId: property.id,
          savedDate: new Date().toISOString(),
          notes: ''
        });
        setIsSaved(true);
        toast.success('Added to saved properties');
      }
    } catch (error) {
      toast.error('Failed to update saved properties');
    }
  };

  const handleContactInquiry = () => {
    toast.success('Contact form would open here - inquiry submitted!');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatSquareFeet = (sqft) => {
    return new Intl.NumberFormat('en-US').format(sqft);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
          </div>
          
          {/* Image gallery skeleton */}
          <div className="h-96 bg-gray-200 rounded-lg"></div>
          
          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Property not found</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <div className="space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/browse')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse Properties
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadProperty}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Try Again
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
        >
          <ApperIcon name="ArrowLeft" className="w-5 h-5" />
          <span>Back to listings</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSaved}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              isSaved
                ? 'bg-accent text-white border-accent'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <ApperIcon 
              name="Heart" 
              className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} 
            />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContactInquiry}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Contact Agent
          </motion.button>
        </div>
      </motion.div>

      {/* Image Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-96">
          <div className="lg:col-span-3 h-full">
            <ImageCarousel 
              images={property.images} 
              alt={property.title}
              className="w-full h-full rounded-lg"
            />
          </div>
          <div className="hidden lg:grid grid-rows-3 gap-4 h-full">
            {property.images.slice(1, 4).map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="relative rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => setCurrentImageIndex(index + 1)}
              >
                <img
                  src={image}
                  alt={`${property.title} - ${index + 2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {index === 2 && property.images.length > 4 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-medium">
                      +{property.images.length - 4} more
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Property Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Title and Price */}
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
              {property.title}
            </h1>
            <div className="flex items-center justify-between mb-4">
              <p className="text-2xl font-bold text-primary">
                {formatPrice(property.price)}
              </p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary/10 text-secondary">
                {property.propertyType}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <ApperIcon name="MapPin" className="w-5 h-5 mr-2" />
              <span>{property.address}</span>
            </div>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-gray-200">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2">
                <ApperIcon name="Bed" className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{property.bedrooms}</p>
              <p className="text-sm text-gray-600">Bedrooms</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2">
                <ApperIcon name="Bath" className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{property.bathrooms}</p>
              <p className="text-sm text-gray-600">Bathrooms</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2">
                <ApperIcon name="Square" className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatSquareFeet(property.squareFeet)}</p>
              <p className="text-sm text-gray-600">Sq Ft</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2">
                <ApperIcon name="Calendar" className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{property.yearBuilt}</p>
              <p className="text-sm text-gray-600">Year Built</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed">{property.description}</p>
          </div>

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <div>
              <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {property.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center space-x-2"
                  >
                    <ApperIcon name="Check" className="w-5 h-5 text-success" />
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Contact Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">
              Interested in this property?
            </h3>
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContactInquiry}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Request Info
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContactInquiry}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Schedule Tour
              </motion.button>
            </div>
          </div>

          {/* Property Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">
              Property Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Property Type</span>
                <span className="font-medium text-gray-900">{property.propertyType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Year Built</span>
                <span className="font-medium text-gray-900">{property.yearBuilt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Square Feet</span>
                <span className="font-medium text-gray-900">{formatSquareFeet(property.squareFeet)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Listed Date</span>
                <span className="font-medium text-gray-900">
                  {new Date(property.listedDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PropertyDetail;