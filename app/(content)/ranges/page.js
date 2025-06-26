'use client';

import React, { useState, useMemo } from 'react';

import { useRanges } from '../../context/RangesContext';

import Ranges_bar from '../../components/Ranges_bar'
import Ranges_list from '../../components/Ranges_list'
import Search_bar from '@/app/components/Search_bar'


const page = () => {
    const { ranges } = useRanges();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        if (!searchTerm) return ranges;
        const lowercasedTerm = searchTerm.toLowerCase();
        return ranges.filter(item =>
            Object.values(item).some(value =>
                String(value).toLowerCase().includes(lowercasedTerm)
            )
        );
    }, [searchTerm, ranges]);

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