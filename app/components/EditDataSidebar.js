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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-700"
            {...props}
        />
    </div>
);

const formatDateForInput = (ddmmyyyy) => {
    if (!ddmmyyyy || typeof ddmmyyyy !== 'string' || ddmmyyyy.split('/').length !== 3) return '';
    const [day, month, year] = ddmmyyyy.split('/');
    return `${year}-${month}-${day}`;
};

// --- Edit Product Form ---
const EditProductForm = ({ item, onSave }) => {
    const [description, setDescription] = useState('');
    const [societyDescription, setSocietyDescription] = useState('');

    useEffect(() => {
        if (item) {
            setDescription(item.description || '');
            setSocietyDescription(item.societyDescription || '');
        }
    }, [item]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...item, description, societyDescription });
    };

    if (!item) return null;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput label="EAN Code" id="ean" type="text" value={item.ean} readOnly disabled />
            <FormInput label="Society" id="society" type="text" value={item.society} readOnly disabled />
            <FormInput label="Description" id="description" type="text" value={description} onChange={e => setDescription(e.target.value)} required />
            <FormInput label="Society Description" id="societyDescription" type="text" value={societyDescription} onChange={e => setSocietyDescription(e.target.value)} />
            <My_button type="submit" variant="primary" className="w-full">Save Changes</My_button>
        </form>
    );
};

// --- Edit Store Form ---
const EditStoreForm = ({ item, onSave }) => {
    const [openDate, setOpenDate] = useState('');
    const [closeDate, setCloseDate] = useState('');
    const [salesFloorBand, setSalesFloorBand] = useState('');

    useEffect(() => {
        if (item) {
            setOpenDate(formatDateForInput(item.openDate) || '');
            setCloseDate(formatDateForInput(item.closeDate) || '');
            setSalesFloorBand(item.salesFloorBand || '');
        }
    }, [item]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (new Date(openDate) > new Date(closeDate)) {
            alert('Open Date cannot be later than Close Date.');
            return;
        }
        const formatDateForDisplay = (yyyymmdd) => {
            if (!yyyymmdd) return '';
            const [year, month, day] = yyyymmdd.split('-');
            return `${day}/${month}/${year}`;
        }
        onSave({ ...item, openDate: formatDateForDisplay(openDate), closeDate: formatDateForDisplay(closeDate), salesFloorBand });
    };

    if (!item) return null;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput label="Site Key" id="siteKey" type="text" value={item.siteKey} readOnly disabled />
            <FormInput label="Site Name" id="siteName" type="text" value={item.siteName} readOnly disabled />
            <FormInput label="Open Date" id="openDate" type="date" value={openDate} onChange={e => setOpenDate(e.target.value)} required />
            <FormInput label="Close Date" id="closeDate" type="date" value={closeDate} onChange={e => setCloseDate(e.target.value)} required />
            <FormInput label="Sales Floor SQ FT Band" id="salesFloorBand" type="text" value={salesFloorBand} onChange={e => setSalesFloorBand(e.target.value)} required />
            <My_button type="submit" variant="primary" className="w-full">Save Changes</My_button>
        </form>
    );
};

// --- Main Sidebar Component ---
const EditDataSidebar = ({ isOpen, onClose, dataType, itemToEdit, onSave }) => {
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
                            Edit {dataType === 'products' ? 'Product' : 'Store'}
                        </h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2">
                        {dataType === 'products' && <EditProductForm item={itemToEdit} onSave={onSave} />}
                        {dataType === 'stores' && <EditStoreForm item={itemToEdit} onSave={onSave} />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditDataSidebar;