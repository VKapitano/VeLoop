'use client';

import React, { useState, useMemo } from 'react';
import { Search, FileUp, Filter, Pencil, Trash2 } from 'lucide-react';
import My_button from './My_button';
import FilterSidebar from './FilterSidebar';

// --- FIX IS HERE: ADD THESE CONSTANTS BACK ---
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

// --- EDITABLE COLUMNS CONFIG ---
const editableProductCols = ['description', 'societyDescription'];
const editableStoreCols = ['openDate', 'closeDate', 'salesFloorBand'];
const narrowColumnKeys = ['openDate', 'closeDate', 'salesFloorBand'];

// --- DATE HELPER FUNCTIONS ---
const formatDateForInput = (ddmmyyyy) => {
    if (!ddmmyyyy || ddmmyyyy.split('/').length !== 3) return '';
    const [day, month, year] = ddmmyyyy.split('/');
    return `${year}-${month}-${day}`;
};

const formatDateForDisplay = (yyyymmdd) => {
    if (!yyyymmdd || yyyymmdd.split('-').length !== 3) return '';
    const [year, month, day] = yyyymmdd.split('-');
    return `${day}/${month}/${year}`;
};

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
const DataTable = ({ title, data, columns, dataType, onUpdate, onFilterClick, isFilterActive, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingCell, setEditingCell] = useState(null);
    const [selectedRows, setSelectedRows] = useState(new Set());

    const filteredData = useMemo(() => {
        if (!data) return []; // Defensive check
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
            const idsToDelete = Array.from(selectedRows);
            await onDelete(idsToDelete);
            setSelectedRows(new Set());
        }
    };

    const handleRowSelect = (id) => {
        const newSelection = new Set(selectedRows);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedRows(newSelection);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allVisibleIds = new Set(filteredData.map(item => item._id));
            setSelectedRows(allVisibleIds);
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

    const handleCellClick = (index, key) => {
        const isEditable = (dataType === 'products' && editableProductCols.includes(key)) ||
            (dataType === 'stores' && editableStoreCols.includes(key));
        if (isEditable) {
            setEditingCell({ index, key });
        }
    };

    const handleSave = (index, key, value) => {
        let finalValue = value;
        if ((key === 'openDate' || key === 'closeDate') && value) {
            finalValue = formatDateForDisplay(value);
        }
        onUpdate(index, key, finalValue);
        setEditingCell(null);
    };

    const renderCell = (item, column, index) => {
        const isEditable = (dataType === 'products' && editableProductCols.includes(column.key)) ||
            (dataType === 'stores' && editableStoreCols.includes(column.key));
        const isEditing = editingCell?.index === index && editingCell?.key === column.key;
        const value = item[column.key];

        if (isEditing) {
            const isDate = column.key === 'openDate' || column.key === 'closeDate';
            return (
                <input
                    type={isDate ? 'date' : 'text'}
                    defaultValue={isDate ? formatDateForInput(value) : value}
                    onBlur={(e) => handleSave(index, column.key, e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave(index, column.key, e.target.value);
                        if (e.key === 'Escape') setEditingCell(null);
                    }}
                    className="w-full p-1.5 border border-blue-500 rounded-md bg-gray-100 dark:bg-gray-900 focus:ring-1 focus:ring-blue-500 outline-none"
                    autoFocus
                />
            );
        }

        if (isEditable) {
            return (
                <div className="group relative w-full">
                    <input
                        type="text"
                        readOnly
                        value={value}
                        className="w-full cursor-pointer bg-transparent border border-gray-300 dark:border-gray-600 rounded-md p-1.5 pr-8 truncate group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        <Pencil className="w-4 h-4 text-blue-500" />
                    </div>
                </div>
            );
        }

        return value;
    };


    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white w-full md:w-auto">{title}</h2>
                <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="search"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        {selectedRows.size > 0 && (
                            <My_button onClick={handleDeleteClick} variant="danger" className="flex flex-1 md:flex-initial">
                                <Trash2 className="w-4 h-4 mr-2" />
                                <span>Delete ({selectedRows.size})</span>
                            </My_button>
                        )}
                        <My_button onClick={handleExportCSV} variant="outline-blue" className="flex flex-1 md:flex-initial">
                            <FileUp className="w-4 h-4 mr-2" />
                            <span>Export CSV</span>
                        </My_button>
                        <My_button
                            onClick={onFilterClick}
                            variant={isFilterActive ? 'primary' : 'outline-dark'}
                            className="flex flex-1 md:flex-initial"
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            <span>Filter{isFilterActive && 's Active'}</span>
                        </My_button>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="p-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        onChange={handleSelectAll}
                                        checked={filteredData.length > 0 && selectedRows.size === filteredData.length}
                                        ref={input => {
                                            if (input) {
                                                input.indeterminate = selectedRows.size > 0 && selectedRows.size < filteredData.length;
                                            }
                                        }}
                                    />
                                </div>
                            </th>
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    scope="col"
                                    className={`px-6 py-3 font-semibold ${narrowColumnKeys.includes(col.key) ? 'w-48' : ''}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={item._id || index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            checked={selectedRows.has(item._id)}
                                            onChange={() => handleRowSelect(item._id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                </td>
                                {columns.map(col => (
                                    <td
                                        key={col.key}
                                        className={`px-6 py-2 text-gray-900 dark:text-white whitespace-nowrap ${narrowColumnKeys.includes(col.key) ? 'w-48' : ''}`}
                                        onClick={() => handleCellClick(index, col.key)}
                                    >
                                        {renderCell(item, col, index)}
                                    </td>
                                ))}
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

    const handleDelete = async (idsToDelete) => {
        const collectionName = activeTab;

        try {
            const response = await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idsToDelete, collectionName }),
            });

            const result = await response.json();

            if (result.success) {
                if (collectionName === 'products') {
                    setProducts(currentProducts =>
                        currentProducts.filter(p => !idsToDelete.includes(p._id))
                    );
                } else {
                    setStores(currentStores =>
                        currentStores.filter(s => !idsToDelete.includes(s._id))
                    );
                }
                alert(`Successfully deleted ${result.deletedCount} item(s).`);
            } else {
                console.error('Failed to delete items:', result.message);
                alert(`Error: ${result.message || 'Failed to delete items.'}`);
            }
        } catch (error) {
            console.error('Client-side error during deletion:', error);
            alert('An error occurred while trying to delete the items.');
        }
    };

    const handleProductUpdate = (index, key, value) => {
        const updatedProducts = [...products];
        updatedProducts[index] = { ...updatedProducts[index], [key]: value };
        setProducts(updatedProducts);
    };

    const handleStoreUpdate = (index, key, value) => {
        const updatedStores = [...stores];
        updatedStores[index] = { ...updatedStores[index], [key]: value };
        setStores(updatedStores);
    };


    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [filters, setFilters] = useState({});

    const handleOpenSidebar = () => setSidebarOpen(true);
    const handleCloseSidebar = () => setSidebarOpen(false);

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
        handleCloseSidebar();
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
        if (!hasFilters) {
            return stores;
        }

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

    const isFilterActive = Object.keys(filters).length > 0;

    return (
        <div className="w-full">
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="flex space-x-4 sm:space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`py-4 pt-1 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'products'
                            ? 'border-[#05a9d0] text-[#05a9d0] dark:border-[#05a9d0] dark:text-[#05a9d0]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        PRODUCTS
                    </button>
                    <button
                        onClick={() => setActiveTab('stores')}
                        className={`py-4 pt-1 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'stores'
                            ? 'border-[#05a9d0] text-[#05a9d0] dark:border-[#05a9d0] dark:text-[#05a9d0]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        STORES
                    </button>
                </nav>
            </div>

            <div>
                {activeTab === 'products' && (
                    <DataTable
                        title="Products Data"
                        data={filteredProductData}
                        columns={productColumns}
                        dataType="products"
                        onUpdate={handleProductUpdate}
                        onFilterClick={handleOpenSidebar}
                        isFilterActive={isFilterActive}
                        onDelete={handleDelete}
                    />
                )}
                {activeTab === 'stores' && (
                    <DataTable
                        title="Stores Data"
                        data={filteredStoreData}
                        columns={storeColumns}
                        dataType="stores"
                        onUpdate={handleStoreUpdate}
                        onFilterClick={handleOpenSidebar}
                        isFilterActive={isFilterActive}
                        onDelete={handleDelete}
                    />
                )}
            </div>
            <FilterSidebar
                isOpen={isSidebarOpen}
                onClose={handleCloseSidebar}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                dataType={activeTab}
                initialFilters={filters}
            />
        </div>
    );
};

export default DataPage;