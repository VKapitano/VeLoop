'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import My_button from './My_button';

// --- Reusable Form Input Components ---
const FormInput = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {label}
        </label>
        <input
            id={id}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            {...props}
        />
    </div>
);

const FormSelect = ({ label, id, children, ...props }) => (
    <div>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {label}
        </label>
        <select
            id={id}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            {...props}
        >
            {children}
        </select>
    </div>
);


// --- Product Form ---
const ProductForm = ({ onAddItem, onClose }) => {
    const [ean, setEan] = useState('');
    const [society, setSociety] = useState('Central');
    const [localInd, setLocalInd] = useState(0);
    const [metadata, setMetadata] = useState('Unavailable');
    const [description, setDescription] = useState('');
    const [societyDescription, setSocietyDescription] = useState('');

    // Generate a random EAN on component mount
    useEffect(() => {
        setEan(Math.floor(100000 + Math.random() * 900000).toString());
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProduct = { ean: parseInt(ean), society, localInd: parseInt(localInd), metadata, description, societyDescription };
        onAddItem(newProduct);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput label="EAN Code (Auto-generated)" id="ean" type="text" value={ean} readOnly />
            <FormSelect label="Society" id="society" value={society} onChange={e => setSociety(e.target.value)}>
                <option>Central</option><option>West</option><option>East</option><option>South</option><option>North</option>
            </FormSelect>
            <FormInput label="Local Ind" id="localInd" type="number" value={localInd} onChange={e => setLocalInd(e.target.value)} required />
            <FormSelect label="Metadata Source" id="metadata" value={metadata} onChange={e => setMetadata(e.target.value)}>
                <option>Unavailable</option><option>Analytics Model</option>
            </FormSelect>
            <FormInput label="Description" id="description" type="text" value={description} onChange={e => setDescription(e.target.value)} required />
            <FormInput label="Society Description" id="societyDescription" type="text" value={societyDescription} onChange={e => setSocietyDescription(e.target.value)} />
            <My_button type="submit" variant="primary" className="w-full">Add Product</My_button>
        </form>
    );
};


// --- Store Form ---
const StoreForm = ({ onAddItem, onClose }) => {
    const [society, setSociety] = useState('Central');
    const [siteKey, setSiteKey] = useState('');
    const [openDate, setOpenDate] = useState('');
    const [closeDate, setCloseDate] = useState('');
    const [siteLetter, setSiteLetter] = useState('A');
    const [salesFloor, setSalesFloor] = useState('');
    const [salesFloorBand, setSalesFloorBand] = useState('');

    useEffect(() => {
        setSiteKey(Math.floor(100000 + Math.random() * 900000).toString());
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (new Date(openDate) > new Date(closeDate)) {
            alert('Open Date cannot be later than Close Date.');
            return;
        }

        const formatDate = (dateStr) => {
            if (!dateStr) return '';
            const [year, month, day] = dateStr.split('-');
            return `${day}/${month}/${year}`;
        }

        const newStore = {
            society,
            siteKey: parseInt(siteKey),
            openDate: formatDate(openDate),
            closeDate: formatDate(closeDate),
            siteName: `Store ${siteLetter}`,
            salesFloor: parseInt(salesFloor),
            salesFloorBand
        };
        onAddItem(newStore);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormSelect label="Society" id="society" value={society} onChange={e => setSociety(e.target.value)}>
                <option>Central</option><option>West</option><option>East</option><option>South</option><option>North</option>
            </FormSelect>
            <FormInput label="Site Key (Auto-generated)" id="siteKey" type="text" value={siteKey} readOnly />
            <FormInput label="Open Date" id="openDate" type="date" value={openDate} onChange={e => setOpenDate(e.target.value)} required />
            <FormInput label="Close Date" id="closeDate" type="date" value={closeDate} onChange={e => setCloseDate(e.target.value)} required />
            <FormSelect label="Site Name Suffix" id="siteLetter" value={siteLetter} onChange={e => setSiteLetter(e.target.value)}>
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => <option key={letter}>{letter}</option>)}
            </FormSelect>
            <FormInput label="Sales Floor SQ FT" id="salesFloor" type="number" value={salesFloor} onChange={e => setSalesFloor(e.target.value)} required />
            <FormInput label="Sales Floor SQ FT Band" id="salesFloorBand" type="text" value={salesFloorBand} onChange={e => setSalesFloorBand(e.target.value)} required />
            <My_button type="submit" variant="primary" className="w-full">Add Store</My_button>
        </form>
    );
};

// --- Main Sidebar Component ---
const AddDataSidebar = ({ isOpen, onClose, dataType, onAddItem }) => {
    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                            Add New {dataType === 'products' ? 'Product' : 'Store'}
                        </h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2">
                        {dataType === 'products' && <ProductForm onAddItem={onAddItem} onClose={onClose} />}
                        {dataType === 'stores' && <StoreForm onAddItem={onAddItem} onClose={onClose} />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddDataSidebar;