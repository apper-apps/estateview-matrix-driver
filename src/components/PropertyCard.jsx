import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import ImageCarousel from './ImageCarousel';
import { savedPropertiesService } from '../services';

const PropertyCard = ({ property, viewMode = 'grid' }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkIfSaved();
  }, [property.id]);

  const checkIfSaved = async () => {
    try {
      const saved = await savedPropertiesService.getAll();
      setIsSaved(saved.some(item => item.propertyId === property.id));
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const toggleSaved = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
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

  const formatSquareFeet = (sqft) => {
    return new Intl.NumberFormat('en-US').format(sqft);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
      >
        <Link to={`/property/${property.id}`} className="block">
          <div className="flex">
            <div className="w-64 h-48 flex-shrink-0">
              <ImageCarousel 
                images={property.images} 
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-heading font-semibold text-gray-900 mb-1">
                    {property.title}
                  </h3>
                  <p className="text-lg font-bold text-primary">
                    {formatPrice(property.price)}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleSaved}
                  disabled={loading}
                  className={`p-2 rounded-full transition-colors ${
                    isSaved 
                      ? 'text-accent bg-accent/10 hover:bg-accent/20' 
                      : 'text-gray-400 hover:text-accent hover:bg-accent/10'
                  }`}
                >
                  <ApperIcon 
                    name="Heart" 
                    className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} 
                  />
                </motion.button>
              </div>
              
              <div className="flex items-center text-gray-600 mb-2">
                <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
                <span className="text-sm">{property.address}</span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <ApperIcon name="Bed" className="w-4 h-4 mr-1" />
                  <span>{property.bedrooms} beds</span>
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Bath" className="w-4 h-4 mr-1" />
                  <span>{property.bathrooms} baths</span>
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Square" className="w-4 h-4 mr-1" />
                  <span>{formatSquareFeet(property.squareFeet)} sqft</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                {property.description}
              </p>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                  {property.propertyType}
                </span>
                <span className="text-xs text-gray-500">
                  Listed {new Date(property.listedDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden"
    >
      <Link to={`/property/${property.id}`} className="block">
        <div className="relative">
          <ImageCarousel 
            images={property.images} 
            alt={property.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSaved}
              disabled={loading}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                isSaved 
                  ? 'text-accent bg-white/90 hover:bg-white' 
                  : 'text-gray-400 bg-white/90 hover:text-accent hover:bg-white'
              }`}
            >
              <ApperIcon 
                name="Heart" 
                className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} 
              />
            </motion.button>
          </div>
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-accent/90 text-white backdrop-blur-sm">
              {property.propertyType}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-2">
            <h3 className="text-lg font-heading font-semibold text-gray-900 mb-1 line-clamp-1">
              {property.title}
            </h3>
            <p className="text-xl font-bold text-primary">
              {formatPrice(property.price)}
            </p>
          </div>
          
          <div className="flex items-center text-gray-600 mb-3">
            <ApperIcon name="MapPin" className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{property.address}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <ApperIcon name="Bed" className="w-4 h-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Bath" className="w-4 h-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Square" className="w-4 h-4 mr-1" />
              <span>{formatSquareFeet(property.squareFeet)}</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {property.description}
          </p>
          
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              Listed {new Date(property.listedDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;