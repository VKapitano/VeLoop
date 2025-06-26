import Link from 'next/link';
import My_button from './My_button';
import Search_bar from './Search_bar';

const Ranges_bar = ( {searchTerm, onSearchChange} ) => {
    return (
        // Kontejner: Dodane tamne pozadine i granice
        <div className="h-[75px] w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center justify-between dark:border dark:border-gray-700">
            
            {/* Lijeva strana: KORISTIMO NOVU KOMPONENTU */}
            <div className="flex-1 mr-4"> {/* Dodan flex-1 da zauzme dostupan prostor */}
                <Search_bar 
                    searchTerm={searchTerm} 
                    onSearchChange={onSearchChange}
                    placeholder_text={"Search ranges..."}
                />
            </div>

            {/* Desna strana: Gumb */}
            <Link href="/ranges/add" passHref>
                <My_button variant="primary">
                    <span>+</span>
                    <span className='hidden md:block'>Add New Range</span>
                </My_button>
            </Link>
        </div>
    );
};

export default Ranges_bar;