import { SquarePen, Trash2 } from 'lucide-react';
import My_button from './My_button';

const fakeData = [
    { id: 1, title: 'Summer Sale 2024', description: 'Discount range for all summer items.' },
    { id: 2, title: 'Black Friday Deals', description: 'Special offers available only on Black Friday.' },
    { id: 3, title: 'New Year Clearance', description: 'End-of-year clearance sale for selected products.' },
    { id: 4, title: 'VIP Customer Exclusive', description: 'A special range for our most loyal customers.' },
    { id: 5, title: 'Flash Sale', description: 'Limited time offer, valid for 24 hours.' },
];

const Ranges_list = ({ children }) => {
    return (
        // Glavni kontejner: Dodane tamne pozadine i granice
        <div className="flex-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden flex flex-col dark:border dark:border-gray-700">

            {/* 1. Zaglavlje: Dodane tamne pozadine, granice i boje teksta */}
            <div className="grid grid-cols-12 gap-4 bg-slate-50 dark:bg-gray-700/50 border-b border-slate-200 dark:border-gray-700 px-6 py-3">
                <div className="col-span-4 font-semibold text-sm text-slate-600 dark:text-slate-400">TITLE</div>
                <div className="col-span-6 font-semibold text-sm text-slate-600 dark:text-slate-400">DESCRIPTION</div>
                <div className="col-span-2 font-semibold text-sm text-slate-600 dark:text-slate-400 text-right">ACTIONS</div>
            </div>

            {/* 2. Tijelo liste (skrolabilno) */}
            <div className="flex-1 overflow-y-auto">
                {fakeData.map((item, index) => (
                    <div
                        key={item.id}
                        // Redak: Dodana tamna boja granice i uklonjena donja granica za zadnji element
                        className="grid grid-cols-12 gap-4 items-center px-6 py-4 border-b border-slate-200 dark:border-gray-700 last:border-b-0"
                    >
                        {/* Stupac: TITLE - Dodana tamna boja teksta */}
                        <div className="col-span-4">
                            <p className="text-blue-600 dark:text-blue-400 font-medium">{item.title}</p>
                        </div>

                        {/* Stupac: DESCRIPTION - Dodana tamna boja teksta */}
                        <div className="col-span-6">
                            <p className="text-gray-800 dark:text-gray-300">{item.description}</p>
                        </div>

                        {/* Stupac: ACTIONS - Dodane tamne boje za ikone */}
                        <div className="col-span-2 flex justify-end items-center gap-4">
                            <button className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                                <SquarePen size={20} />
                            </button>
                            <button className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Ranges_list;