import { toast } from 'react-toastify';

const filterService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          "Name", "property_type", "price_range", "bedrooms", 
          "bathrooms", "square_feet", "amenities"
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords("filter", params);
      
      if (!response || !response.data) {
        return [];
      }
      
      return response.data.map(filter => ({
        id: filter.Id,
        name: filter.Name,
        propertyType: filter.property_type ? filter.property_type.split(',') : [],
        priceRange: filter.price_range || '0-5',
        bedrooms: filter.bedrooms || 'Any',
        bathrooms: filter.bathrooms || 'Any',
        squareFeet: filter.square_feet || '0-5',
        amenities: filter.amenities ? filter.amenities.split(',') : []
      }));
    } catch (error) {
      console.error("Error fetching filters:", error);
      toast.error("Failed to load filters");
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
          "Name", "property_type", "price_range", "bedrooms", 
          "bathrooms", "square_feet", "amenities"
        ]
      };

      const response = await apperClient.getRecordById("filter", id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const filter = response.data;
      return {
        id: filter.Id,
        name: filter.Name,
        propertyType: filter.property_type ? filter.property_type.split(',') : [],
        priceRange: filter.price_range || '0-5',
        bedrooms: filter.bedrooms || 'Any',
        bathrooms: filter.bathrooms || 'Any',
        squareFeet: filter.square_feet || '0-5',
        amenities: filter.amenities ? filter.amenities.split(',') : []
      };
    } catch (error) {
      console.error(`Error fetching filter ${id}:`, error);
      throw error;
    }
  },

  async create(filter) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: filter.name,
          property_type: Array.isArray(filter.propertyType) ? filter.propertyType.join(',') : filter.propertyType,
          price_range: filter.priceRange,
          bedrooms: filter.bedrooms,
          bathrooms: filter.bathrooms,
          square_feet: filter.squareFeet,
          amenities: Array.isArray(filter.amenities) ? filter.amenities.join(',') : filter.amenities
        }]
      };

      const response = await apperClient.createRecord("filter", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          const errorMessage = result.message || 'Failed to create filter';
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
        
        toast.success('Filter created successfully');
        return result.data;
      }
      
      throw new Error('No results returned');
    } catch (error) {
      console.error("Error creating filter:", error);
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
        ...(updates.name && { Name: updates.name }),
        ...(updates.propertyType && { property_type: Array.isArray(updates.propertyType) ? updates.propertyType.join(',') : updates.propertyType }),
        ...(updates.priceRange && { price_range: updates.priceRange }),
        ...(updates.bedrooms && { bedrooms: updates.bedrooms }),
        ...(updates.bathrooms && { bathrooms: updates.bathrooms }),
        ...(updates.squareFeet && { square_feet: updates.squareFeet }),
        ...(updates.amenities && { amenities: Array.isArray(updates.amenities) ? updates.amenities.join(',') : updates.amenities })
      };

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord("filter", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          const errorMessage = result.message || 'Failed to update filter';
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
        
        toast.success('Filter updated successfully');
        return result.data;
      }
      
      throw new Error('No results returned');
    } catch (error) {
      console.error("Error updating filter:", error);
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

      const response = await apperClient.deleteRecord("filter", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          const errorMessage = result.message || 'Failed to delete filter';
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
        
        toast.success('Filter deleted successfully');
        return true;
      }
      
      throw new Error('No results returned');
    } catch (error) {
      console.error("Error deleting filter:", error);
      throw error;
    }
  }
};

export default filterService;