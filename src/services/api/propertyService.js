import propertyData from '../mockData/properties.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const propertyService = {
  async getAll() {
    await delay(300);
    return [...propertyData];
  },

  async getById(id) {
    await delay(200);
    const property = propertyData.find(p => p.id === id);
    return property ? { ...property } : null;
  },

  async create(property) {
    await delay(400);
    const newProperty = {
      ...property,
      id: Date.now().toString(),
      listedDate: new Date().toISOString()
    };
    propertyData.push(newProperty);
    return { ...newProperty };
  },

  async update(id, updates) {
    await delay(350);
    const index = propertyData.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }
    propertyData[index] = { ...propertyData[index], ...updates };
    return { ...propertyData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = propertyData.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }
    const deleted = propertyData.splice(index, 1)[0];
    return { ...deleted };
  }
};

export default propertyService;