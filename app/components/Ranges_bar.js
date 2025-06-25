import { Search } from 'lucide-react';
import My_button from './My_button';

const Ranges_bar = () => {
    return (
        // Kontejner: Dodane tamne pozadine i granice
        <div className="h-[75px] w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center justify-between dark:border dark:border-gray-700">
            {/* Lijeva strana: Search Bar */}
            <div className="relative w-full mr-3">
                {/* Ikona: Dodana tamna boja */}
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />

                {/* Input polje: Dodane tamne stilove */}
                <input
                    type="text"
                    placeholder="Search ranges..."
                    className="w-full max-w-xs pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
            </div>

            {/* Desna strana: Gumb */}
            <My_button variant="primary">
                <span>+</span>
                <span className=''>Add New Range</span>
            </My_button>
        </div>
    );
};

export default Ranges_bar;