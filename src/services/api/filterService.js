import filterData from '../mockData/filters.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const filterService = {
  async getAll() {
    await delay(200);
    return [...filterData];
  },

  async getById(id) {
    await delay(150);
    const filter = filterData.find(f => f.id === id);
    return filter ? { ...filter } : null;
  },

  async create(filter) {
    await delay(300);
    const newFilter = {
      ...filter,
      id: Date.now().toString()
    };
    filterData.push(newFilter);
    return { ...newFilter };
  },

  async update(id, updates) {
    await delay(250);
    const index = filterData.findIndex(f => f.id === id);
    if (index === -1) {
      throw new Error('Filter not found');
    }
    filterData[index] = { ...filterData[index], ...updates };
    return { ...filterData[index] };
  },

  async delete(id) {
    await delay(200);
    const index = filterData.findIndex(f => f.id === id);
    if (index === -1) {
      throw new Error('Filter not found');
    }
    const deleted = filterData.splice(index, 1)[0];
    return { ...deleted };
  }
};

export default filterService;