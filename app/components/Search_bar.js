// app/components/Search_bar.js

import { Search } from 'lucide-react';

// Prima `searchTerm` i `onSearchChange` kao props
const Search_bar = ({ searchTerm, onSearchChange, placeholder_text }) => {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
                type="search"
                placeholder={placeholder_text}
                value={searchTerm} // Koristi vrijednost iz propsa
                onChange={(e) => onSearchChange(e.target.value)} // Poziva funkciju iz propsa
                className="w-full md:max-w-xs pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
};

export default Search_bar;