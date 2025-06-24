import { Search } from 'lucide-react';

const Ranges_bar = () => {
    return (
        // Bijeli kontejner fiksne visine sa sjenom i zaobljenim rubovima
        <div className="h-[75px] w-full bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
            {/* Lijeva strana: Search Bar */}
            <div className="relative">
                {/* Ikona unutar search bara */}
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                
                {/* Input polje */}
                <input
                    type="text"
                    placeholder="Search ranges..."
                    className="w-full max-w-xs pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Desna strana: Gumb */}
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2">
                <span>+</span>
                <span>Add New Range</span>
            </button>
        </div>
    );
};

export default Ranges_bar;