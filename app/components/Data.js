'use client';

import React, { useState, useMemo } from 'react';
import { Search, FileUp, Filter, Pencil, Trash2, PlusCircle } from 'lucide-react';
import My_button from './My_button';
import FilterSidebar from './FilterSidebar';
import AddDataSidebar from './AddDataSidebar';
import EditDataSidebar from './EditDataSidebar'; // <-- IMPORT THE NEW COMPONENT

// --- COLUMN DEFINITIONS ---
const productColumns = [
    { key: 'ean', label: 'EAN Code' },
    { key: 'society', label: 'Society' },
    { key: 'localInd', label: 'Local Ind' },
    { key: 'metadata', label: 'Metadata Source' },
    { key: 'description', label: 'Description' },
    { key: 'societyDescription', label: 'Society Description' },
];

const storeColumns = [
    { key: 'society', label: 'Society' },
    { key: 'siteKey', label: 'Site Key' },
    { key: 'openDate', label: 'Open Date' },
    { key: 'closeDate', label: 'Close Date' },
    { key: 'siteName', label: 'Site Name' },
    { key: 'salesFloor', label: 'Sales Floor SQ FT' },
    { key: 'salesFloorBand', label: 'Sales Floor SQ FT Band' },
];

// --- REMOVED EDITABLE COLUMNS CONFIG ---
// This is no longer needed as the Edit sidebar handles what's editable.
const narrowColumnKeys = ['openDate', 'closeDate', 'salesFloorBand'];

// --- DATE HELPER FUNCTION (no longer needed here) ---
const parseDateDDMMYYYY_UTC = (dateString) => {
    if (!dateString || typeof dateString !== 'string') return null;
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts.map(Number);
    return new Date(Date.UTC(year, month - 1, day));
};

/**
 * Reusable DataTable component
 */
const DataTable = ({ title, data, columns, dataType, onEditClick, onFilterClick, isFilterActive, onDelete, onAddClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState(new Set());

    const filteredData = useMemo(() => {
        if (!data) return [];
        if (!searchTerm) return data;
        const lowercasedTerm = searchTerm.toLowerCase();
        return data.filter(item =>
            Object.values(item).some(value =>
                String(value).toLowerCase().includes(lowercasedTerm)
            )
        );
    }, [data, searchTerm]);

    const handleDeleteClick = async () => {
        if (selectedRows.size === 0) return;
        if (window.confirm(`Are you sure you want to delete ${selectedRows.size} item(s)? This action cannot be undone.`)) {
            await onDelete(Array.from(selectedRows));
            setSelectedRows(new Set());
        }
    };

    const handleRowSelect = (id) => {
        const newSelection = new Set(selectedRows);
        newSelection.has(id) ? newSelection.delete(id) : newSelection.add(id);
        setSelectedRows(newSelection);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(new Set(filteredData.map(item => item._id)));
        } else {
            setSelectedRows(new Set());
        }
    };

    const handleExportCSV = () => {
        const headers = columns.map(c => c.label).join(',');
        const rows = filteredData.map(item =>
            columns.map(col => {
                let value = item[col.key];
                if (typeof value === 'string' && value.includes(',')) {
                    return `"${value}"`;
                }
                return value;
            }).join(',')
        );
        const csvContent = 'sep=,\n' + [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `${dataType}_data.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white w-full md:w-auto">{title}</h2>
                <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Search className="w-5 h-5 text-gray-400" /></div>
                        <input type="search" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="flex items-center justify-end md:justify-start gap-2 w-full md:w-auto">
                        <My_button onClick={onAddClick} variant="primary" className="flex items-center">
                            <PlusCircle className="w-4 h-4 md:mr-2" />
                            <span className="hidden md:inline">Add</span>
                        </My_button>
                        {selectedRows.size > 0 && (<My_button onClick={handleDeleteClick} variant="danger" className="flex items-center"><Trash2 className="w-4 h-4 md:mr-2" /><span className="hidden md:inline">Delete ({selectedRows.size})</span></My_button>)}
                        <My_button onClick={handleExportCSV} variant="outline-blue" className="flex items-center"><FileUp className="w-4 h-4 md:mr-2" /><span className="hidden md:inline">Export CSV</span></My_button>
                        <My_button onClick={onFilterClick} variant={isFilterActive ? 'primary' : 'outline-dark'} className="flex items-center"><Filter className="w-4 h-4 md:mr-2" /><span className="hidden md:inline">Filter{isFilterActive && 's Active'}</span></My_button>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="p-4">
                                <div className="flex items-center">
                                    <input type="checkbox" onChange={handleSelectAll} checked={filteredData.length > 0 && selectedRows.size === filteredData.length} ref={input => { if (input) input.indeterminate = selectedRows.size > 0 && selectedRows.size < filteredData.length; }} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                            </th>
                            {columns.map(col => (<th key={col.key} scope="col" className={`px-6 py-3 font-semibold ${narrowColumnKeys.includes(col.key) ? 'w-48' : ''}`}>{col.label}</th>))}
                            <th scope="col" className="px-6 py-3 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item) => (
                            <tr key={item._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input type="checkbox" checked={selectedRows.has(item._id)} onChange={() => handleRowSelect(item._id)} onClick={(e) => e.stopPropagation()} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    </div>
                                </td>
                                {columns.map(col => (
                                    <td key={col.key} className={`px-6 py-2 text-gray-900 dark:text-white whitespace-nowrap ${narrowColumnKeys.includes(col.key) ? 'w-48' : ''}`}>
                                        {item[col.key]}
                                    </td>
                                ))}
                                <td className="px-6 py-2 text-right">
                                    <button onClick={() => onEditClick(item)} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:text-blue-400">
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


/**
 * Main page component with tab navigation
 */
const DataPage = ({ initialProducts, initialStores }) => {
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState(initialProducts || []);
    const [stores, setStores] = useState(initialStores || []);
    const [isAddSidebarOpen, setAddSidebarOpen] = useState(false);
    const [isFilterSidebarOpen, setFilterSidebarOpen] = useState(false);
    const [isEditSidebarOpen, setEditSidebarOpen] = useState(false); // <-- NEW STATE
    const [itemToEdit, setItemToEdit] = useState(null); // <-- NEW STATE
    const [filters, setFilters] = useState({});

    // --- NEW HANDLERS FOR EDIT SIDEBAR ---
    const handleEditClick = (item) => {
        setItemToEdit(item);
        setEditSidebarOpen(true);
    };

    const handleCloseEditSidebar = () => {
        setEditSidebarOpen(false);
        setItemToEdit(null);
    };

    const handleAddItem = async (newItem) => {
        const collectionName = activeTab;
        try {
            const response = await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ collectionName, newItem }) });
            const result = await response.json();
            if (result.success) {
                const setData = collectionName === 'products' ? setProducts : setStores;
                setData(currentData => [...currentData, result.item]);
                setAddSidebarOpen(false);
                alert('Successfully added!');
            } else {
                alert(`Error: ${result.message || 'Failed to add item.'}`);
            }
        } catch (error) {
            console.error("Creation failed:", error);
            alert('An error occurred while adding the item.');
        }
    };

    const handleDelete = async (idsToDelete) => {
        const collectionName = activeTab;
        try {
            const response = await fetch('/api/data', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idsToDelete, collectionName }) });
            const result = await response.json();
            if (result.success) {
                const setData = collectionName === 'products' ? setProducts : setStores;
                setData(currentData => currentData.filter(item => !idsToDelete.includes(item._id)));
                alert(`Successfully deleted ${result.deletedCount} item(s).`);
            } else {
                alert(`Error: ${result.message || 'Failed to delete items.'}`);
            }
        } catch (error) {
            console.error("Deletion failed:", error);
            alert('An error occurred while trying to delete the items.');
        }
    };

    // --- MODIFIED UPDATE HANDLER ---
    const handleUpdate = async (updatedItem) => {
        const collectionName = activeTab;
        const currentData = collectionName === 'products' ? products : stores;
        const setData = collectionName === 'products' ? setProducts : setStores;

        // Optimistically update the UI
        const updatedData = currentData.map(item => item._id === updatedItem._id ? updatedItem : item);
        setData(updatedData);
        handleCloseEditSidebar();

        // Separate the _id from the fields to update
        const { _id, ...updateFields } = updatedItem;

        try {
            const response = await fetch('/api/data', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collectionName, id: _id, updates: updateFields })
            });
            const result = await response.json();
            if (!result.success) {
                // If the update failed, revert the UI and show an error
                setData(currentData);
                alert(`Error: Could not save your change. ${result.message}`);
            }
        } catch (error) {
            console.error("Update failed:", error);
            setData(currentData); // Revert on error
            alert('An error occurred. Could not save your change.');
        }
    };

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
        setFilterSidebarOpen(false);
    };

    const handleResetFilters = () => {
        setFilters({});
    };

    const filteredProductData = useMemo(() => {
        if (!products) return [];
        return products.filter(item => {
            if (filters.localInd && String(item.localInd) !== filters.localInd) return false;
            if (filters.metadata && item.metadata !== filters.metadata) return false;
            return true;
        });
    }, [products, filters]);

    const filteredStoreData = useMemo(() => {
        if (!stores) return [];
        const hasFilters = filters.minSalesFloor || filters.maxSalesFloor || filters.startDate || filters.endDate;
        if (!hasFilters) return stores;
        return stores.filter(item => {
            const minSales = parseInt(filters.minSalesFloor, 10);
            const maxSales = parseInt(filters.maxSalesFloor, 10);
            if (!isNaN(minSales) && item.salesFloor < minSales) return false;
            if (!isNaN(maxSales) && item.salesFloor > maxSales) return false;
            const filterStartDate = filters.startDate ? new Date(filters.startDate) : null;
            const filterEndDate = filters.endDate ? new Date(filters.endDate) : null;
            if (filterStartDate || filterEndDate) {
                const itemOpenDate = parseDateDDMMYYYY_UTC(item.openDate);
                const itemCloseDate = parseDateDDMMYYYY_UTC(item.closeDate);
                if (!itemOpenDate || !itemCloseDate) return false;
                if (filterStartDate && itemOpenDate < filterStartDate) return false;
                if (filterEndDate && itemCloseDate > filterEndDate) return false;
            }
            return true;
        });
    }, [stores, filters]);

    return (
        <div className="w-full">
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="flex space-x-4 sm:space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('products')} className={`py-4 pt-1 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'products' ? 'border-[#05a9d0] text-[#05a9d0] dark:border-[#05a9d0] dark:text-[#05a9d0]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'}`}>PRODUCTS</button>
                    <button onClick={() => setActiveTab('stores')} className={`py-4 pt-1 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'stores' ? 'border-[#05a9d0] text-[#05a9d0] dark:border-[#05a9d0] dark:text-[#05a9d0]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'}`}>STORES</button>
                </nav>
            </div>

            <div>
                {activeTab === 'products' && (
                    <DataTable title="Products Data" data={filteredProductData} columns={productColumns} dataType="products" onEditClick={handleEditClick} onFilterClick={() => setFilterSidebarOpen(true)} isFilterActive={Object.keys(filters).length > 0} onDelete={handleDelete} onAddClick={() => setAddSidebarOpen(true)} />
                )}
                {activeTab === 'stores' && (
                    <DataTable title="Stores Data" data={filteredStoreData} columns={storeColumns} dataType="stores" onEditClick={handleEditClick} onFilterClick={() => setFilterSidebarOpen(true)} isFilterActive={Object.keys(filters).length > 0} onDelete={handleDelete} onAddClick={() => setAddSidebarOpen(true)} />
                )}
            </div>

            <AddDataSidebar isOpen={isAddSidebarOpen} onClose={() => setAddSidebarOpen(false)} dataType={activeTab} onAddItem={handleAddItem} />
            <FilterSidebar isOpen={isFilterSidebarOpen} onClose={() => setFilterSidebarOpen(false)} onApply={handleApplyFilters} onReset={handleResetFilters} dataType={activeTab} initialFilters={filters} />
            {/* --- RENDER THE NEW EDIT SIDEBAR --- */}
            <EditDataSidebar isOpen={isEditSidebarOpen} onClose={handleCloseEditSidebar} dataType={activeTab} itemToEdit={itemToEdit} onSave={handleUpdate} />
        </div>
    );
};

export default DataPage;