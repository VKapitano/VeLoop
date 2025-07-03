'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { SquarePen, Trash2, ArrowUp, ArrowDown, Search} from 'lucide-react';
import My_button from './My_button';

import { useRanges } from '../context/RangesContext';

const Ranges_list = ({ data }) => {
    // 1. Stanje za sortirane podatke
    const [sortedData, setSortedData] = useState([]);
    // 2. Stanje za smjer sortiranja ('asc' za uzlazno, 'desc' za silazno)
    const [sortDirection, setSortDirection] = useState('asc'); // Po defaultu abecedno

    const { deleteRange } = useRanges();

    // 3. Efekt koji sortira podatke kad se promijeni smjer
    useEffect(() => {
        const dataToSort = [...data]; // Kreiramo kopiju da ne mutiramo originalni niz

        dataToSort.sort((a, b) => {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();
            
            if (titleA < titleB) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (titleA > titleB) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });

        setSortedData(dataToSort);
    }, [sortDirection, data]); // Ponovno se pokreće samo kad se `sortDirection` promijeni

    // 4. Funkcija za promjenu smjera sortiranja
    const handleSort = () => {
        setSortDirection(prevDirection => (prevDirection === 'asc' ? 'desc' : 'asc'));
    };

    const handleDelete = (rangeId, rangeTitle) => {
        // Prikazujemo alert (confirm prozor) za potvrdu
        const isConfirmed = window.confirm(`Are you sure you want to delete the range "${rangeTitle}"?`);

        // Ako korisnik potvrdi, pozovi funkciju iz contexta
        if (isConfirmed) {
            deleteRange(rangeId);
        }
    };

    return (
        // Glavni kontejner: Dodane tamne pozadine i granice
        <div className="flex-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden flex flex-col dark:border dark:border-gray-700">

            {/* 1. Zaglavlje: Dodane tamne pozadine, granice i boje teksta */}
            <div className="grid grid-cols-24 gap-4 bg-slate-50 dark:bg-gray-700/50 border-b border-slate-200 dark:border-gray-700 px-6 py-3">
                <div 
                    className="col-span-16 sm:col-span-8 lg:col-span-6 font-semibold text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    onClick={handleSort}
                    >
                    <span>TITLE</span>
                    {/* Prikazujemo odgovarajuću strelicu */}
                    {sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} 
                    />}
                </div>
                <div className="hidden lg:block lg:col-span-8 font-semibold text-sm text-slate-600 dark:text-slate-400">DESCRIPTION</div>
                <div className="hidden sm:flex sm:col-span-3 lg:col-span-2 justify-center font-semibold text-sm text-slate-600 dark:text-slate-400">ITEMS</div>
                <div className="hidden sm:flex sm:col-span-5 lg:col-span-3 justify-center font-semibold text-sm text-slate-600 dark:text-slate-400">START DATE</div>
                <div className="hidden sm:flex sm:col-span-5 lg:col-span-3 justify-center font-semibold text-sm text-slate-600 dark:text-slate-400">END DATE</div>
                <div className="col-span-8 sm:col-span-3 lg:col-span-2 font-semibold text-sm text-slate-600 dark:text-slate-400 text-right">ACTIONS</div>
            </div>

            {/* 2. Tijelo liste (skrolabilno) */}
            <div className="flex-1 overflow-y-auto">
                {sortedData.map((item, index) => (
                    <div
                        key={item._id}
                        // Redak: Dodana tamna boja granice i uklonjena donja granica za zadnji element
                        className="grid grid-cols-24 gap-4 items-center px-6 py-4 border-b border-slate-200 dark:border-gray-700 last:border-b-0"
                    >
                        {/* Stupac: TITLE - Dodana tamna boja teksta */}
                        <div className="col-span-16 sm:col-span-8 lg:col-span-6">
                            <p className="text-blue-600 dark:text-blue-400 font-medium truncate">
                                <Link href={`/ranges/edit/${item._id}`}>
                                    {item.title}
                                </Link>
                            </p>
                        </div>

                        {/* Stupac: DESCRIPTION - Dodana tamna boja teksta */}
                        <div className="hidden lg:block lg:col-span-8">
                            <p className="text-gray-800 dark:text-gray-300 truncate">{item.description}</p>
                        </div>

                        {/* Stupac: ITEMS - Dodana tamna boja teksta */}
                        <div className="hidden sm:flex sm:col-span-3 lg:col-span-2 justify-center">
                            <p className="text-gray-800 dark:text-gray-300">{item.items.length}</p>
                        </div>

                        {/* Stupac: DATE - Dodana tamna boja teksta */}
                        <div className="hidden sm:flex sm:col-span-5 lg:col-span-3 justify-center">
                            <p className="text-gray-800 dark:text-gray-300">{item.startDate}</p>
                        </div>
                        <div className="hidden sm:flex sm:col-span-5 lg:col-span-3 justify-center">
                            <p className="text-gray-800 dark:text-gray-300">{item.endDate}</p>
                        </div>

                        {/* Stupac: ACTIONS - Dodane tamne boje za ikone */}
                        <div className="col-span-8 sm:col-span-3 lg:col-span-2 flex justify-end items-center gap-4">
                            <button className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                                <Link href={`/ranges/edit/${item._id}`}>
                                    <SquarePen size={20} />
                                </Link>
                            </button>
                            <button onClick={() => handleDelete(item._id, item.title)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors">
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