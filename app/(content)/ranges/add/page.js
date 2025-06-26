'use client'

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { ArrowLeft, Search, FileUp, FileDown, Plus, X, SquarePen, Trash2, Save } from 'lucide-react';

import { useRanges } from '@/app/context/RangesContext';

import Ranges_bar from '@/app/components/Ranges_bar';
import Ranges_list from '@/app/components/Ranges_list';
import Search_bar from '@/app/components/Search_bar';
import My_button from '@/app/components/My_button';


const page = () => {
    const router = useRouter(); // Instanca routera
    const { addRange } = useRanges();

    // --- LOKALNO STANJE ZA OVU FORMU ---
    // Stanje za Range Details
    const [rangeTitle, setRangeTitle] = useState('');
    const [rangeDesc, setRangeDesc] = useState('');
    const [startDate, setStartDate] = useState(''); // Koristim string za jednostavnost
    const [endDate, setEndDate] = useState('');

     // --- NOVO STANJE ZA EDITOR ---
    const [items, setItems] = useState([]); // Lista SPREMLJENIH itema
    const [itemSearchTerm, setItemSearchTerm] = useState('');
    const [showEditor, setShowEditor] = useState(false); // Kontrolira vidljivost tablice/editora

    // Stanje za polja za unos NOVOG itema
    const [newItemName, setNewItemName] = useState('');
    const [newItemDesc, setNewItemDesc] = useState('');
    const [newItemEan, setNewItemEan] = useState('0');

    // Ovdje bi išla logika za filtriranje `items` na temelju `itemSearchTerm`...
    const filteredItems = useMemo(() => {
        if (!itemSearchTerm) return items;
        // ... logika filtriranja ...
    }, [items, itemSearchTerm]);

    // --- HANDLER FUNKCIJE ---
    // Dodaje novi item u listu i resetira polja
    const handleAddNewItem = () => {
        if (!newItemName.trim()) {
            alert('Item name is required.'); // Jednostavna validacija
            return;
        }
        const newItem = {
            id: Date.now(), // Jednostavni jedinstveni ID
            name: newItemName,
            description: newItemDesc,
            ean: newItemEan,
        };
        setItems(prevItems => [...prevItems, newItem]);
        
        // Resetiraj polja za unos
        setNewItemName('');
        setNewItemDesc('');
        setNewItemEan('0');
    };

    // Briše item iz liste
    const handleDeleteItem = (idToDelete) => {
        setItems(prevItems => prevItems.filter(item => item.id !== idToDelete));
    };

    // --- NOVA FUNKCIJA ZA SPREMANJE ---
    const handleSaveRange = () => {
        if (!rangeTitle.trim()) {
            alert('Range Title is required!');
            return;
        }

        // 1. Kreiraj novi range objekt
        const newRange = {
            id: Date.now(), // Novi jedinstveni ID
            title: rangeTitle,
            description: rangeDesc,
            // Ovdje možeš dodati i datume i listu itema ako treba
            items: items 
        };

        // 2. Pozovi funkciju iz Contexta da ažuriraš globalno stanje
        addRange(newRange);

        // 3. Preusmjeri korisnika natrag na listu
        router.push('/ranges');
    };

    return (
        // 1. Glavni kontejner - isti kao na /ranges stranici
        <div className="h-full dark:bg-gray-850 p-2 flex flex-col gap-6">


            {/* 2. Prvi kontejner: Navigacija i naslov */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center">
                <Link href="/ranges" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
                    <ArrowLeft size={20} />
                    <span>Back to Ranges</span>
                </Link>

                {/* Vertikalni separator za ljepši izgled */}
                <div className="border-l border-gray-300 dark:border-gray-600 h-6 mx-4"></div>

                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                    Add New Range
                </h1>
            </div>


            {/* 3. Drugi kontejner: Fiksna visina za formu (možda ćemo je trebati povećati ili ukloniti fiksnu visinu) */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-4">
                    Range Details
                </h2>

                {/* Formular unutar kontejnera */}
                <form className="mt-6 space-y-6">
                    
                    {/* Prvi red: Range Title i Description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Polje: Range Title */}
                        <div>
                            <label htmlFor="range-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Range Title*
                            </label>
                            <input
                                type="text"
                                id="range-title"
                                name="range-title"
                                required
                                value={rangeTitle} // <-- POVEŽI VRIJEDNOST
                                onChange={(e) => setRangeTitle(e.target.value)} // <-- POVEŽI PROMJENU
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Enter ranges title"
                            />
                        </div>

                        {/* Polje: Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description
                            </label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={rangeDesc} // <-- POVEŽI VRIJEDNOST
                                onChange={(e) => setRangeDesc(e.target.value)} // <-- POVEŽI PROMJENU
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Enter range description"
                            />
                        </div>
                    </div>

                    {/* Drugi red: Start Date i End Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Polje: Start Date */}
                        <div>
                            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                id="start-date"
                                name="start-date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>

                        {/* Polje: End Date */}
                        <div>
                            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                id="end-date"
                                name="end-date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    </div>
                </form>
            </div>



            {/* 4. Treći kontejner: Editor za Range Items */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex flex-col">
                
                {/* Zaglavlje editora */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 w-full md:w-auto">
                        Range Items ({items.length})
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                        <Search_bar searchTerm={itemSearchTerm} onSearchChange={setItemSearchTerm} placeholder_text={"Search items..."}/>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <My_button variant="outline-dark">
                                <Search className="w-4 h-4 mr-2" />
                                <span>EAN Check</span>
                            </My_button>
                            <My_button variant="outline-dark">
                                <FileUp className="w-4 h-4 mr-2" />
                                <span>Import</span>
                            </My_button>
                            <My_button variant="outline-dark">
                                <FileDown className="w-4 h-4 mr-2" />
                                <span>Export</span>
                            </My_button>
                            {/* Ovaj gumb sada samo prikazuje editor */}
                            <My_button variant="primary" icon={Plus} onClick={() => setShowEditor(true)}>
                                <span>+</span>
                                <span>Add Item</span>
                            </My_button>
                        </div>
                    </div>
                </div>

                {/* Tijelo editora - Tablica i polja za unos */}
                <div className="flex-1 overflow-y-auto">
                    {/* Prikazujemo tablicu samo ako je `showEditor` true ili ako već ima itema */}
                    {(showEditor || items.length > 0) ? (
                        <div className="w-full">
                            {/* Zaglavlje tablice */}
                            <div className="sticky top-0 grid grid-cols-12 gap-4 bg-slate-100 dark:bg-gray-700/50 px-6 py-3 font-semibold text-sm text-slate-600 dark:text-slate-400">
                                <div className="col-span-4">ITEM NAME</div>
                                <div className="hidden md:block md:col-span-4">DESCRIPTION</div>
                                <div className="col-span-4 md:col-span-2">EAN CODE</div>
                                <div className="col-span-4 md:col-span-2 text-right">ACTIONS</div>
                            </div>

                            {/* Lista spremljenih itema */}
                            {items.map(item => (
                                <div key={item.id} className="grid grid-cols-12 gap-4 items-center px-6 py-2 border-b border-slate-200 dark:border-gray-700">
                                    <div className="col-span-4 text-gray-800 dark:text-gray-200">{item.name}</div>
                                    <div className="hidden md:block md:col-span-4 text-gray-600 dark:text-gray-400">{item.description}</div>
                                    <div className="col-span-4 md:col-span-2 text-gray-800 dark:text-gray-200">{item.ean}</div>
                                    <div className="col-span-4 md:col-span-2 flex justify-end">
                                        <button className="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors" onClick={() => handleDeleteItem(item.id)}>
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Red za unos novog itema */}
                            <div className="grid grid-cols-12 gap-4 items-center px-6 py-4 bg-slate-50 dark:bg-gray-900/50">
                                <div className="col-span-4">
                                    <input type="text" placeholder="Enter item name" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm"/>
                                </div>
                                <div className="hidden md:block md:col-span-4">
                                    <input type="text" placeholder="Enter item description" value={newItemDesc} onChange={(e) => setNewItemDesc(e.target.value)} className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm"/>
                                </div>
                                <div className="col-span-4 md:col-span-2">
                                    <input type="number" value={newItemEan} onChange={(e) => setNewItemEan(e.target.value)} className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm"/>
                                </div>
                                <div className="col-span-4 md:col-span-2 flex justify-end items-center gap-2">
                                    <button onClick={handleAddNewItem} className="p-1.5 hover:bg-green-100 dark:hover:bg-green-900/50">
                                        <Plus size={20} />
                                    </button>
                                    {/*<button onClick={() => { setNewItemName(''); setNewItemDesc(''); setNewItemEan('0'); }} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/50">
                                        <X size={20} />
                                    </button>*/}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500 dark:text-gray-400">No items have been added yet.</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Click "+ Add Item" to get started.</p>
                        </div>
                    )}
                </div>

                {/* Footer s gumbima */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end items-center gap-4">
                    <My_button variant="outline-dark">
                        <span>Cancel</span>
                    </My_button>
                    <My_button onClick={handleSaveRange} variant="primary">
                        <Save className="w-5 h-5 mr-2" />
                        <span>Save Range</span>
                    </My_button>
                </div>
            </div>

        </div>
    );
};

export default page