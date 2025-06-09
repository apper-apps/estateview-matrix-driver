import { toast } from 'react-toastify';

const propertyService = {
  async getAll(filters = {}) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          "Name", "title", "price", "address", "bedrooms", "bathrooms", 
          "square_feet", "description", "property_type", "listed_date", 
          "images", "year_built", "features", "coordinates"
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords("property", params);
      
      if (!response || !response.data) {
        return [];
      }
      
      return response.data.map(property => ({
        id: property.Id,
        title: property.title || property.Name,
        price: property.price || 0,
        address: property.address || '',
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        squareFeet: property.square_feet || 0,
        description: property.description || '',
        propertyType: property.property_type || '',
        listedDate: property.listed_date || new Date().toISOString(),
        images: property.images ? property.images.split('\n').filter(Boolean) : [],
        yearBuilt: property.year_built || 0,
        features: property.features ? property.features.split('\n').filter(Boolean) : [],
        coordinates: property.coordinates ? JSON.parse(property.coordinates) : { lat: 40.7128, lng: -74.0060 }
      }));
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          "Name", "title", "price", "address", "bedrooms", "bathrooms", 
          "square_feet", "description", "property_type", "listed_date", 
          "images", "year_built", "features", "coordinates"
        ]
      };

      const response = await apperClient.getRecordById("property", id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const property = response.data;
      return {
        id: property.Id,
        title: property.title || property.Name,
        price: property.price || 0,
        address: property.address || '',
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        squareFeet: property.square_feet || 0,
        description: property.description || '',
        propertyType: property.property_type || '',
        listedDate: property.listed_date || new Date().toISOString(),
        images: property.images ? property.images.split('\n').filter(Boolean) : [],
        yearBuilt: property.year_built || 0,
        features: property.features ? property.features.split('\n').filter(Boolean) : [],
        coordinates: property.coordinates ? JSON.parse(property.coordinates) : { lat: 40.7128, lng: -74.0060 }
      };
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error);
      throw error;
    }
  },

  async create(property) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: property.title,
          title: property.title,
          price: property.price,
          address: property.address,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          square_feet: property.squareFeet,
          description: property.description,
          property_type: property.propertyType,
          listed_date: new Date().toISOString(),
          images: Array.isArray(property.images) ? property.images.join('\n') : property.images,
          year_built: property.yearBuilt,
          features: Array.isArray(property.features) ? property.features.join('\n') : property.features,
          coordinates: typeof property.coordinates === 'object' ? JSON.stringify(property.coordinates) : property.coordinates
        }]
      };

      const response = await apperClient.createRecord("property", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          const errorMessage = result.message || 'Failed to create property';
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
        
        toast.success('Property created successfully');
        return result.data;
      }
      
      throw new Error('No results returned');
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: parseInt(id),
        ...(updates.title && { Name: updates.title, title: updates.title }),
        ...(updates.price !== undefined && { price: updates.price }),
        ...(updates.address && { address: updates.address }),
        ...(updates.bedrooms !== undefined && { bedrooms: updates.bedrooms }),
        ...(updates.bathrooms !== undefined && { bathrooms: updates.bathrooms }),
        ...(updates.squareFeet !== undefined && { square_feet: updates.squareFeet }),
        ...(updates.description && { description: updates.description }),
        ...(updates.propertyType && { property_type: updates.propertyType }),
        ...(updates.images && { images: Array.isArray(updates.images) ? updates.images.join('\n') : updates.images }),
        ...(updates.yearBuilt !== undefined && { year_built: updates.yearBuilt }),
        ...(updates.features && { features: Array.isArray(updates.features) ? updates.features.join('\n') : updates.features }),
        ...(updates.coordinates && { coordinates: typeof updates.coordinates === 'object' ? JSON.stringify(updates.coordinates) : updates.coordinates })
      };

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord("property", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          const errorMessage = result.message || 'Failed to update property';
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
        
        toast.success('Property updated successfully');
        return result.data;
      }
      
      throw new Error('No results returned');
    } catch (error) {
      console.error("Error updating property:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("property", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          const errorMessage = result.message || 'Failed to delete property';
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
        
        toast.success('Property deleted successfully');
        return true;
      }
      
      throw new Error('No results returned');
    } catch (error) {
      console.error("Error deleting property:", error);
      throw error;
    }
  }
};

export default propertyService;