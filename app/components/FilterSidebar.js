// app/components/FilterSidebar.js
'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import My_button from './My_button';

const FilterSidebar = ({ isOpen, onClose, onApply, onReset, dataType, initialFilters }) => {
    // Interno stanje za upravljanje formom unutar sidebara
    const [localFilters, setLocalFilters] = useState(initialFilters);

    // Sinkroniziraj lokalno stanje s glavnim stanjem kad se sidebar otvori
    useEffect(() => {
        setLocalFilters(initialFilters);
    }, [isOpen, initialFilters]);

    // Generički handler za promjene
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLocalFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    
    // Handler za radio gumbe
    const handleRadioChange = (name, value) => {
        setLocalFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyClick = () => {
        onApply(localFilters);
    };

    const handleResetClick = () => {
        onReset(); // Pozovi funkciju za reset iz roditelja
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            {/* Panel */}
            <div className="relative z-10 flex flex-col h-full w-full max-w-md ml-auto bg-white dark:bg-gray-800 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {dataType === 'products' ? 'Filter Products Data' : 'Filter Stores Data'}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Formular s filterima */}
                <div className="flex-grow p-6 space-y-6 overflow-y-auto">
                    {dataType === 'products' ? (
                        <>
                            {/* Filter za Local Ind */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Local Ind</h3>
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="radio" name="localInd" value="1" checked={localFilters.localInd === '1'} onChange={() => handleRadioChange('localInd', '1')} />
                                        <span>Yes</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="radio" name="localInd" value="0" checked={localFilters.localInd === '0'} onChange={() => handleRadioChange('localInd', '0')} />
                                        <span>No</span>
                                    </label>
                                </div>
                            </div>
                            
                            {/* Filter za Metadata Source */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Metadata Source</h3>
                                <div className="flex flex-col space-y-2">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="radio" name="metadata" value="Unavailable" checked={localFilters.metadata === 'Unavailable'} onChange={() => handleRadioChange('metadata', 'Unavailable')} />
                                        <span>Unavailable</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="radio" name="metadata" value="Analytics Model" checked={localFilters.metadata === 'Analytics Model'} onChange={() => handleRadioChange('metadata', 'Analytics Model')} />
                                        <span>Analytics Model</span>
                                    </label>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Filter za Sales Floor */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Sales Floor SQ FT</h3>
                                <div className="flex items-center gap-4">
                                    <input type="number" name="minSalesFloor" placeholder="From" value={localFilters.minSalesFloor || ''} onChange={handleChange} className="w-full mt-1 ..."/>
                                    <input type="number" name="maxSalesFloor" placeholder="To" value={localFilters.maxSalesFloor || ''} onChange={handleChange} className="w-full mt-1 ..."/>
                                </div>
                            </div>

                            {/* Filter za Datume */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Date Range</h3>
                                <div className="flex items-center gap-4">
                                    <input type="date" name="startDate" value={localFilters.startDate || ''} onChange={handleChange} className="w-full mt-1 ..."/>
                                    <input type="date" name="endDate" value={localFilters.endDate || ''} onChange={handleChange} className="w-full mt-1 ..."/>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer s gumbima */}
                <div className="p-4 border-t dark:border-gray-700 flex items-center justify-end gap-4">
                    <My_button variant="outline-dark" onClick={handleResetClick}>Reset</My_button>
                    <My_button variant="primary" onClick={handleApplyClick}>Apply</My_button>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;