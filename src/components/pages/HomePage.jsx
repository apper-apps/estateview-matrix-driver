import React from 'react';
import SearchBar from '@/components/SearchBar';
import FilterSidebar from '@/components/FilterSidebar';
import ContactForm from '@/components/organisms/ContactForm';

function HomePage() {
  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Search and Filter Section */}
      <div className="relative flex flex-col md:flex-row">
        <div className="md:w-1/4 p-4 border-r border-gray-200 bg-white shadow-sm">
          <FilterSidebar />
        </div>
        <div className="md:w-3/4 p-4">
          <SearchBar />
          {/* Main content area for search results, etc. 
              Currently empty as per mock, but would be populated by actual properties */}
          <div className="mt-8 text-center text-gray-500">
            <p>Search results will appear here...</p>
            <p>(Mock property data is available in `src/services/mockData/properties.json`)</p>
          </div>
        </div>
      </div>

      {/* Main Feature Section - Now a ContactForm Organism */}
      <ContactForm />
    </div>
  );
}

export default HomePage;