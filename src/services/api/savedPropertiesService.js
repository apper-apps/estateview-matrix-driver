let savedPropertiesData = [];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const savedPropertiesService = {
  async getAll() {
    await delay(200);
    return [...savedPropertiesData];
  },

  async getById(id) {
    await delay(150);
    const savedProperty = savedPropertiesData.find(sp => sp.id === id);
    return savedProperty ? { ...savedProperty } : null;
  },

  async create(savedProperty) {
    await delay(300);
    const newSavedProperty = {
      ...savedProperty,
      id: Date.now().toString()
    };
    savedPropertiesData.push(newSavedProperty);
    return { ...newSavedProperty };
  },

  async update(id, updates) {
    await delay(250);
    const index = savedPropertiesData.findIndex(sp => sp.id === id);
    if (index === -1) {
      throw new Error('Saved property not found');
    }
    savedPropertiesData[index] = { ...savedPropertiesData[index], ...updates };
    return { ...savedPropertiesData[index] };
  },

  async delete(id) {
    await delay(200);
    const index = savedPropertiesData.findIndex(sp => sp.id === id);
    if (index === -1) {
      throw new Error('Saved property not found');
    }
    const deleted = savedPropertiesData.splice(index, 1)[0];
    return { ...deleted };
  }
};

export default savedPropertiesService;