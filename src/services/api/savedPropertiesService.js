import { toast } from 'react-toastify';

const savedPropertiesService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ["Name", "property_id", "saved_date", "notes"],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords("saved_property", params);
      
      if (!response || !response.data) {
        return [];
      }
      
      return response.data.map(saved => ({
        id: saved.Id,
        propertyId: saved.property_id,
        savedDate: saved.saved_date,
        notes: saved.notes || ''
      }));
    } catch (error) {
      console.error("Error fetching saved properties:", error);
      toast.error("Failed to load saved properties");
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
        fields: ["Name", "property_id", "saved_date", "notes"]
      };

      const response = await apperClient.getRecordById("saved_property", id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const saved = response.data;
      return {
        id: saved.Id,
        propertyId: saved.property_id,
        savedDate: saved.saved_date,
        notes: saved.notes || ''
      };
    } catch (error) {
      console.error(`Error fetching saved property ${id}:`, error);
      throw error;
    }
  },

  async create(savedProperty) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `Saved Property ${savedProperty.propertyId}`,
          property_id: parseInt(savedProperty.propertyId),
          saved_date: savedProperty.savedDate || new Date().toISOString(),
          notes: savedProperty.notes || ''
        }]
      };

      const response = await apperClient.createRecord("saved_property", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          const errorMessage = result.message || 'Failed to save property';
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
        
        return {
          id: result.data.Id,
          propertyId: result.data.property_id,
          savedDate: result.data.saved_date,
          notes: result.data.notes || ''
        };
      }
      
      throw new Error('No results returned');
    } catch (error) {
      console.error("Error saving property:", error);
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
        ...(updates.propertyId && { property_id: parseInt(updates.propertyId) }),
        ...(updates.savedDate && { saved_date: updates.savedDate }),
        ...(updates.notes !== undefined && { notes: updates.notes })
      };

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord("saved_property", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          const errorMessage = result.message || 'Failed to update saved property';
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
        
        toast.success('Saved property updated successfully');
        return result.data;
      }
      
      throw new Error('No results returned');
    } catch (error) {
      console.error("Error updating saved property:", error);
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

      const response = await apperClient.deleteRecord("saved_property", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          const errorMessage = result.message || 'Failed to remove saved property';
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
        
        return true;
      }
      
      throw new Error('No results returned');
    } catch (error) {
      console.error("Error removing saved property:", error);
      throw error;
    }
  }
};

export default savedPropertiesService;