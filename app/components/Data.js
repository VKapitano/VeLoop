'use client';

import React, { useState, useMemo } from 'react';
import { Search, FileUp, Filter } from 'lucide-react';
import My_button from './My_button';

// --- MOCK DATA ---
// Using static mock data as a starting point, as requested.

const productData = [
    { ean: 4, society: 'Central', localInd: 0, includeInd: 'Yes', metadata: 'Unavailable', description: 'Double Espresso', societyDescription: 'Double Espresso', brandType: 'Manufacturers Brand', societyBrandType: 'Manufacturers Brand', ownBrand: 0 },
    { ean: 16, society: 'Central', localInd: 0, includeInd: 'Yes', metadata: 'Unavailable', description: 'Espresso', societyDescription: 'Espresso', brandType: 'Manufacturers Brand', societyBrandType: 'Manufacturers Brand', ownBrand: 0 },
    { ean: 18, society: 'Central', localInd: 1, includeInd: 'Yes', metadata: 'Analytics Model', description: 'Hot Chocolate', societyDescription: 'Hot Chocolate', brandType: 'Coop Brand', societyBrandType: 'Coop Brand', ownBrand: 1 },
    { ean: 24, society: 'Central', localInd: 0, includeInd: 'Yes', metadata: 'Unavailable', description: 'Co-op Instore Bakery Multibuy 4 for 1.00', societyDescription: '', brandType: 'Coop Brand', societyBrandType: 'Coop Brand', ownBrand: 1 },
    { ean: 25, society: 'Central', localInd: 0, includeInd: 'No', metadata: 'Unavailable', description: 'Saving Stamps', societyDescription: '', brandType: 'Manufacturers Brand', societyBrandType: 'Manufacturers Brand', ownBrand: 0 },
    { ean: 30, society: 'Central', localInd: 0, includeInd: 'Yes', metadata: 'Unavailable', description: 'Pasty Puff Pasty Mince Pie With Brandy Each', societyDescription: '', brandType: 'Coop Brand', societyBrandType: 'Coop Brand', ownBrand: 1 },
    { ean: 62, society: 'Central', localInd: 0, includeInd: 'Yes', metadata: 'Unavailable', description: 'Co-op Tt Triple Choc Cookie Each', societyDescription: '', brandType: 'Coop Brand', societyBrandType: 'Coop Brand', ownBrand: 1 },
    { ean: 80, society: 'Central', localInd: 0, includeInd: 'Yes', metadata: 'Unavailable', description: 'Co-op Tt White Choc&Cranberry Cookie Each', societyDescription: '', brandType: 'Coop Brand', societyBrandType: 'Coop Brand', ownBrand: 1 },
    { ean: 96, society: 'Central', localInd: 1, includeInd: 'Yes', metadata: 'Analytics Model', description: 'Candy King Per Kg', societyDescription: 'Candy King Per Kg', brandType: 'Manufacturers Brand', societyBrandType: 'Manufacturers Brand', ownBrand: 0 },
    { ean: 146, society: 'Central', localInd: 0, includeInd: 'Yes', metadata: 'Unavailable', description: 'Co-op Mixed Iced Doughnuts Each', societyDescription: '', brandType: 'Coop Brand', societyBrandType: 'Coop Brand', ownBrand: 1 },
    { ean: 154, society: 'Central', localInd: 0, includeInd: 'Yes', metadata: 'Unavailable', description: 'Co-op Brown Rustic Roll Each', societyDescription: '', brandType: 'Coop Brand', societyBrandType: 'Coop Brand', ownBrand: 1 },
];

const storeData = [
    { society: 'Central', siteKey: 100071, openDate: '30/12/2014', closeDate: '29/11/2024', siteName: 'Store A', salesFloor: 3000 },
    { society: 'Central', siteKey: 100072, openDate: '30/12/2014', closeDate: '30/12/2999', siteName: 'Store B', salesFloor: 2500 },
    { society: 'Central', siteKey: 100077, openDate: '30/12/2014', closeDate: '30/12/2999', siteName: 'Store C', salesFloor: 3000 },
    { society: 'Central', siteKey: 100078, openDate: '30/12/2014', closeDate: '30/12/2999', siteName: 'Store D', salesFloor: 7730 },
    { society: 'Central', siteKey: 200092, openDate: '30/12/2014', closeDate: '30/12/2999', siteName: 'Store E', salesFloor: 7077 },
    { society: 'Central', siteKey: 200097, openDate: '30/12/2014', closeDate: '30/12/2999', siteName: 'Store F', salesFloor: 980 },
    { society: 'Central', siteKey: 300082, openDate: '30/12/2014', closeDate: '24/01/2020', siteName: 'Store G', salesFloor: 1775 },
    { society: 'Central', siteKey: 300083, openDate: '30/12/2014', closeDate: '30/12/2999', siteName: 'Store H', salesFloor: 2585 },
    { society: 'Central', siteKey: 300086, openDate: '30/12/2014', closeDate: '30/12/2999', siteName: 'Store I', salesFloor: 1946 },
    { society: 'Central', siteKey: 400080, openDate: '30/12/2014', closeDate: '30/12/2999', siteName: 'Store J', salesFloor: 2982 },
    { society: 'Central', siteKey: 400092, openDate: '30/12/2014', closeDate: '30/12/2999', siteName: 'Store K', salesFloor: 3000 },
];

// --- COLUMN DEFINITIONS ---
// To start, only a subset of product columns are shown as requested.
const productColumns = [
    { key: 'ean', label: 'EAN Code' },
    { key: 'society', label: 'Society' },
    { key: 'localInd', label: 'Local Ind' },
    { key: 'metadata', label: 'Metadata Source' },
    { key: 'description', label: 'Description' },
    { key: 'societyDescription', label: 'Society Description' },
];

// All store columns are shown as requested.
const storeColumns = [
    { key: 'society', label: 'Society' },
    { key: 'siteKey', label: 'Site Key' },
    { key: 'openDate', label: 'Open Date' },
    { key: 'closeDate', label: 'Close Date' },
    { key: 'siteName', label: 'Site Name' },
    { key: 'salesFloor', label: 'Sales Floor SQ FT' },
];

/**
 * Reusable DataTable component
 * @param {string} title - The title to display above the table.
 * @param {Array<Object>} data - The array of data to display.
 * @param {Array<Object>} columns - The column definitions.
 * @param {string} dataType - A string identifier for the data type (e.g., 'products').
 */
const DataTable = ({ title, data, columns, dataType }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        const lowercasedTerm = searchTerm.toLowerCase();
        return data.filter(item =>
            Object.values(item).some(value =>
                String(value).toLowerCase().includes(lowercasedTerm)
            )
        );
    }, [data, searchTerm]);

    const handleExportCSV = () => {
        const headers = columns.map(c => c.label).join(',');
        const rows = filteredData.map(item =>
            columns.map(col => {
                let value = item[col.key];
                // Handle commas in data by wrapping in double quotes
                if (typeof value === 'string' && value.includes(',')) {
                    return `"${value}"`;
                }
                return value;
            }).join(',')
        );

        const csvContent = [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-s-8,' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `${dataType}_data.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Custom cell renderer for special cases like the date inputs in the stores table
    const renderCell = (item, column) => {
        const value = item[column.key];
        if (dataType === 'stores' && (column.key === 'openDate' || column.key === 'closeDate')) {
            return (
                <div className="relative">
                    <input
                        type="text"
                        readOnly
                        value={value}
                        className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 text-sm rounded-lg block w-full p-2.5 pr-8"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                        </svg>
                    </div>
                </div>
            );
        }
        return value;
    };


    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 sm:mb-0">{title}</h2>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
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
                    <My_button onClick={handleExportCSV} variant="outline-blue">
                        <FileUp className="w-4 h-4 mr-2" />
                        <span>Export CSV</span>
                    </My_button>
                    <My_button variant="outline-dark">
                        <Filter className="w-4 h-4 mr-2" />
                        <span>Filter</span>
                    </My_button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            {columns.map(col => (
                                <th key={col.key} scope="col" className="px-6 py-3 font-semibold">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                {columns.map(col => (
                                    <td key={col.key} className="px-6 py-4 text-gray-900 dark:text-white whitespace-nowrap">
                                        {renderCell(item, col)}
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
const DataPage = () => {
    const [activeTab, setActiveTab] = useState('products');

    return (
        <div className="w-full">
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'products'
                            ? 'border-gray-500 text-gray-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        PRODUCTS
                    </button>
                    <button
                        onClick={() => setActiveTab('stores')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'stores'
                            ? 'border-gray-500 text-gray-600 dark:text-blue-400'
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
                        data={productData}
                        columns={productColumns}
                        dataType="products"
                    />
                )}
                {activeTab === 'stores' && (
                    <DataTable
                        title="Stores Data"
                        data={storeData}
                        columns={storeColumns}
                        dataType="stores"
                    />
                )}
            </div>
        </div>
    );
};

export default DataPage;