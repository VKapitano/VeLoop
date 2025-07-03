'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRanges } from '@/app/context/RangesContext';
import { ArrowLeft, Search, FileUp, FileDown, Plus, X, SquarePen, Trash2, Save, Check, Eraser } from 'lucide-react';

import Ranges_bar from '@/app/components/Ranges_bar';
import Ranges_list from '@/app/components/Ranges_list';
import Search_bar from '@/app/components/Search_bar';
import My_button from '@/app/components/My_button';


const RangeForm = ({ mode = 'add', rangeId = null }) => {
    const router = useRouter();

    const { ranges, addRange, getRangeById, updateRange, deleteRange } = useRanges();


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

    const [editingItemId, setEditingItemId] = useState(null);
    const [itemsBeforeEdit, setItemsBeforeEdit] = useState(null);

    const [eanStatuses, setEanStatuses] = useState(null);
    const [isCheckingEans, setIsCheckingEans] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && rangeId) {
            const existingRange = getRangeById(rangeId);
            if (existingRange) {
                setRangeTitle(existingRange.title);
                setRangeDesc(existingRange.description || '');
                setItems(existingRange.items || []);
                setStartDate(existingRange.startDate || '');
                setEndDate(existingRange.endDate || '');
            }
        }
    }, [rangeId, mode, getRangeById]);

    const filteredItems = useMemo(() => {
        if (!itemSearchTerm) return items;
        const lowercasedTerm = itemSearchTerm.toLowerCase();
        return items.filter(item =>
            Object.values(item).some(value =>
                String(value).toLowerCase().includes(lowercasedTerm)
            )
        );
    }, [items, itemSearchTerm]);

    // Dodaje novi item u listu i resetira polja
    const handleAddNewItem = () => {
        if (!newItemName.trim()) {
            alert('Item name is required.');
            return;
        }
        
        // ISPRAVAK: Koristimo crypto.randomUUID() za generiranje
        // jedinstvenog i konzistentnog STRINGA za _id.
        const newItem = {
            _id: crypto.randomUUID(), 
            name: newItemName,
            description: newItemDesc,
            ean: parseInt(newItemEan, 10) || 0,
        };

        setItems(prevItems => [...prevItems, newItem]);
        
        // Resetiraj polja za unos
        setNewItemName('');
        setNewItemDesc('');
        setNewItemEan('0');
    };

    // --- ISPRAVLJENA handleSave FUNKCIJA ---
    const handleSave = () => {
        if (!rangeTitle.trim()) {
            alert('Range Title is required!');
            return;
        }

        if (mode === 'edit') {
            // --- LOGIKA ZA AŽURIRANJE ---
            // Pripremi podatke BEZ _id polja
            const dataToUpdate = {
                title: rangeTitle,
                description: rangeDesc,
                items: items,
                startDate: startDate,
                endDate: endDate,
            };
            // Pozovi updateRange s ISPRAVNIM argumentima: (id, data)
            updateRange(rangeId, dataToUpdate);
        } else {
            // --- LOGIKA ZA DODAVANJE ---
            // Pripremi podatke za NOVI range. NEMA _id polja!
            const newRangeData = {
                title: rangeTitle,
                description: rangeDesc,
                items: items, // Ovdje itemi imaju privremene _id-jeve, što je u redu
                startDate: startDate,
                endDate: endDate,
            };
            // Pošalji samo podatke. Server će se pobrinuti za sve ostalo.
            addRange(newRangeData);
        }

        router.push('/ranges');
    };

    // --- ISPRAVLJENA handleDelete FUNKCIJA ---
    const handleDelete = () => {
        if (mode === 'edit' && rangeId) {
            const isConfirmed = window.confirm(`Are you sure you want to permanently delete the range "${rangeTitle}"?`);
            
            if (isConfirmed) {
                // 4. Pošalji `rangeId` kao string, bez parseInt()
                deleteRange(rangeId); 
                router.push('/ranges');
            }
        }
    };

    // Briše item iz liste
    const handleDeleteItem = (idToDelete, itemName) => {
        // Prikazujemo alert (confirm prozor) za potvrdu
        const isConfirmed = window.confirm(`Are you sure you want to delete the item "${itemName}"?`);

        // Ako korisnik potvrdi, izvrši brisanje
        if (isConfirmed) {
            setItems(prevItems => prevItems.filter(item => item._id !== idToDelete));
        }
    };

    const handleExportItems = () => {
        // Provjeri ima li uopće itema za eksport
        if (items.length === 0) {
            alert("There are no items to export.");
            return;
        }

        // 1. Definiraj zaglavlja stupaca
        const headers = ['ITEM NAME', 'DESCRIPTION', 'EAN CODE'];
        const csvRows = [headers.join(',')]; // Prvi redak je zaglavlje

        // 2. Prođi kroz svaki item i formatiraj ga za CSV redak
        items.forEach(item => {
            // Važno: Osiguraj da vrijednosti koje mogu sadržavati zarez budu unutar navodnika
            const name = `"${item.name.replace(/"/g, '""')}"`;
            const description = `"${item.description.replace(/"/g, '""')}"`;
            const ean = item.ean;

            csvRows.push([name, description, ean].join(','));
        });

        // 3. Spoji sve retke u jedan string, s novim redom kao separatorom
        const csvContent = csvRows.join('\n');

        // 4. Kreiraj Blob i link za preuzimanje
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        
        // Kreiraj privremeni link element
        const link = document.createElement('a');
        if (link.href) {
            URL.revokeObjectURL(link.href);
        }
        link.href = URL.createObjectURL(blob);
        
        // Postavi ime datoteke (koristimo naslov rangea ako postoji)
        const fileName = rangeTitle.trim() ? `${rangeTitle}_items.csv` : 'range_items.csv';
        link.setAttribute('download', fileName);

        // Simuliraj klik na link da se pokrene preuzimanje
        document.body.appendChild(link);
        link.click();

        // Ukloni privremeni link iz DOM-a
        document.body.removeChild(link);
    };

    // Nove handler funkcije

    // Pokreće edit mod i sprema backup
    const handleStartEdit = (item) => {
        setItemsBeforeEdit([...items]); // Spremi trenutnu listu kao backup
        setEditingItemId(item._id);      // Postavi ID itema koji se uređuje
    };

    // Sprema promjene (samo izlazi iz edit moda)
    const handleSaveEdit = () => {
        setEditingItemId(null);
        setItemsBeforeEdit(null); // Očisti backup
    };

    // Otkazuje promjene (vraća backup) i izlazi iz edit moda
    const handleCancelEdit = () => {
        if (itemsBeforeEdit) {
            setItems(itemsBeforeEdit); // Vrati staru listu
        }
        setEditingItemId(null);
        setItemsBeforeEdit(null);
    };

    // Ažurira podatke itema direktno u `items` listi dok korisnik tipka
    const handleItemChange = (itemId, field, value) => {
        const processedValue = field === 'ean' ? (parseInt(value, 10) || 0) : value;

        setItems(prevItems =>
            prevItems.map(item =>
                item._id === itemId ? { ...item, [field]: processedValue } : item
            )
        );
    };

    // --- NOVA FUNKCIJA ZA PROVJERU EAN KODOVA ---
    const handleEanCheck = async () => {
        // Ako su statusi već postavljeni, resetiraj ih i izađi
        if (eanStatuses) {
            setEanStatuses(null);
            return;
        }

        if (items.length === 0) {
            alert("No items to check.");
            return;
        }

        setIsCheckingEans(true); // Započni provjeru
        console.log(`--- Starting EAN Check via API for Range: "${rangeTitle || 'New Range'}" ---`);

        try {
            // Pripremi podatke za slanje na server.
            // Važno: šaljemo samo _id i ean jer je to sve što server treba.
            const itemsToVerify = items.map(item => ({ _id: item._id, ean: item.ean }));

            // Pozovi novu API rutu
            const response = await fetch('/api/ean-check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: itemsToVerify }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to check EANs.');
            }

            const result = await response.json();
            
            // Postavi statuse duplikata koje smo dobili od servera
            setEanStatuses(result.duplicates);

            console.log('API Check Result:', result.duplicates);

        } catch (error) {
            console.error("EAN Check failed:", error);
            alert(`Could not perform EAN check: ${error.message}`);
            setEanStatuses(null); // Resetiraj statuse u slučaju greške
        } finally {
            setIsCheckingEans(false); // Završi provjeru
            console.log('--- EAN Check Complete ---');
        }
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
                    {mode === 'edit' ? `Edit Range: ${rangeTitle}` : 'Add New Range'}
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
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
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
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    </div>
                </form>
            </div>
            {/* 4. Treći kontejner: Editor za Range Items */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex flex-col">
                
                {/* Zaglavlje editora */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap md:flex-row items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 w-full md:w-auto">
                        Range Items ({items.length})
                    </h2>
                    <div className="flex flex-wrap lg:flex-row items-center gap-2 w-full lg:w-auto">
                        <Search_bar searchTerm={itemSearchTerm} onSearchChange={setItemSearchTerm} placeholder_text={"Search items..."}/>
                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                            <My_button variant="outline-dark" onClick={handleEanCheck}>
                                <Search className="w-4 h-4 mr-2" />
                                <span>EAN Check</span>
                            </My_button>
                            {/* <My_button variant="outline-dark">
                                <FileUp className="w-4 h-4 mr-2" />
                                <span>Import</span>
                            </My_button> */}
                            <My_button variant="outline-dark" onClick={handleExportItems}>
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
                            {filteredItems.map(item => {
                                // 1. Dohvati status (true, false, ili undefined) iz `eanStatuses` stanja
                                const hasDuplicate = eanStatuses ? eanStatuses[item._id] : undefined;
                                
                                // 2. Odredi klasu za boju na temelju statusa
                                const rowClass = 
                                    hasDuplicate === true ? 'bg-red-50 dark:bg-red-900/30' :      // Crvena za duplikate
                                    hasDuplicate === false ? 'bg-green-50 dark:bg-green-900/30' : // Zelena za ispravne
                                    '';                                                           // Bez boje ako provjera nije aktivna

                                // 3. Vrati JSX s dinamički dodanom klasom
                                return editingItemId === item._id ? (
                                    // --- PRIKAZ U EDIT MODU ---
                                    // Dodajemo `rowClass` i `transition-colors` na glavni div
                                    <div key={item._id} className={`grid grid-cols-12 gap-4 items-center px-6 py-4 ${rowClass} transition-colors duration-300`}>
                                        <div className="col-span-6 md:col-span-4">
                                            <input type="text" value={item.name} onChange={(e) => handleItemChange(item._id, 'name', e.target.value)} className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm"/>
                                        </div>
                                        <div className="hidden md:block md:col-span-4">
                                            <input type="text" value={item.description} onChange={(e) => handleItemChange(item._id, 'description', e.target.value)} className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm"/>
                                        </div>
                                        <div className="col-span-3 md:col-span-2">
                                            <input type="number" value={item.ean} onChange={(e) => handleItemChange(item._id, 'ean', e.target.value)} className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm"/>
                                        </div>
                                        <div className="col-span-3 md:col-span-2 flex justify-end items-center gap-2">
                                            <button onClick={handleSaveEdit} className="p-1 text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors">
                                                <Check size={20} />
                                            </button>          
                                            <button onClick={handleCancelEdit} className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // --- STANDARDNI PRIKAZ ---
                                    // Dodajemo `rowClass` i `transition-colors` i ovdje
                                    <div key={item._id} className={`grid grid-cols-12 gap-4 items-center px-6 py-2 border-b border-slate-200 dark:border-gray-700 ${rowClass} transition-colors duration-300`}>
                                        <div className="col-span-4 text-gray-800 dark:text-gray-200">{item.name}</div>
                                        <div className="hidden md:block md:col-span-4 text-gray-600 dark:text-gray-400">{item.description}</div>
                                        <div className="col-span-4 md:col-span-2 text-gray-800 dark:text-gray-200">{item.ean}</div>
                                        <div className="col-span-4 md:col-span-2 flex justify-end items-center gap-2">
                                            <button onClick={() => handleStartEdit(item)} className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                                                <SquarePen size={20} />
                                            </button>
                                            <button onClick={() => handleDeleteItem(item._id, item.name)} className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            
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
                                    <button onClick={handleAddNewItem} className="p-1 text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors">
                                        <Plus size={20} />
                                    </button>                    
                                    <button onClick={() => { setNewItemName(''); setNewItemDesc(''); setNewItemEan('0'); setShowEditor(false)}} className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                                        <Eraser size={20} />
                                    </button>
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
                    <My_button 
                    variant="outline-dark"
                    onClick={() => {
                        // Prikazujemo prozor za potvrdu
                        const isConfirmed = window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.');
                        // Ako korisnik potvrdi, preusmjeri ga
                        if (isConfirmed) {
                            router.push('/ranges');
                        }
                    }}
                    >
                        <span>Cancel</span>
                    </My_button>
                    {mode === 'edit' && (
                        <My_button 
                            variant="danger" 
                            onClick={handleDelete}
                        >
                            <Trash2 className="w-5 h-5 mr-2" />
                            <span>Delete Range</span>
                        </My_button>
                    )}
                    <My_button onClick={handleSave} variant="primary">
                        <Save className="w-5 h-5 mr-2" />
                        <span>{mode === 'edit' ? 'Save Changes' : 'Save Range'}</span>
                    </My_button>
                </div>
            </div>
        </div>
    )
}

export default RangeForm