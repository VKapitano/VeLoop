'use client';

import React, { useState, useMemo } from 'react';

import Ranges_bar from '../../components/Ranges_bar'
import Ranges_list from '../../components/Ranges_list'
import Search_bar from '@/app/components/Search_bar'

const initialData = [
    { id: 1, title: 'Summer Sale 2024', description: 'Discount range for all summer items.' },
    { id: 2, title: 'Black Friday Deals', description: 'Special offers available only on Black Friday.' },
    { id: 3, title: 'New Year Clearance', description: 'End-of-year clearance sale for selected products.' },
    { id: 4, title: 'VIP Customer Exclusive', description: 'A special range for our most loyal customers.' },
    { id: 5, title: 'Flash Sale', description: 'Limited time offer, valid for 24 hours.' },
];



const page = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        if (!searchTerm) return initialData;
        const lowercasedTerm = searchTerm.toLowerCase();
        return initialData.filter(item =>
            Object.values(item).some(value =>
                String(value).toLowerCase().includes(lowercasedTerm)
            )
        );
    }, [searchTerm]);

    return (
        <div className="h-full dark:bg-gray-850 p-2 flex flex-col gap-6">
            <Ranges_bar 
                searchTerm={searchTerm} 
                onSearchChange={setSearchTerm} 
            />
            
            {/* Ranges_list prima već filtrirane podatke */}
            <Ranges_list data={filteredData} />
        </div>
    )
}

export default page