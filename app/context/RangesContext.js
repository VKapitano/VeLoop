// app/context/RangesContext.js
'use client';

import React, { createContext, useState, useContext } from 'react';

// Početni podaci koje si imao u /ranges/page.js
const initialData = [
    { id: 1, title: 'Summer Sale 2024', description: 'Discount range for all summer items.', startDate: '2025-06-27', endDate: '2025-07-04', items: [] },
    { id: 2, title: 'Black Friday Deals', description: 'Special offers available only on Black Friday.', startDate: '2024-06-01', endDate: '2024-08-31', items: [] },
    { id: 3, title: 'New Year Clearance', description: 'End-of-year clearance sale for selected products.', startDate: '2024-08-21', endDate: '2024-08-31', items: [] },
    { id: 4, title: 'VIP Customer Exclusive', description: 'A special range for our most loyal customers.', startDate: '2021-04-01', endDate: '2024-06-27', items: []  },
    { id: 5, title: 'Flash Sale', description: 'Limited time offer, valid for 24 hours.', startDate: '2024-06-12', endDate: '2024-07-15', items: []  },
];

// 1. Kreiraj Context
const RangesContext = createContext();

// 2. Kreiraj Provider komponentu
export const RangesProvider = ({ children }) => {
    const [ranges, setRanges] = useState(initialData);

    // Funkcija za dodavanje novog range-a
    const addRange = (newRange) => {
        setRanges(prevRanges => [...prevRanges, newRange]);
    };

    const value = { ranges, addRange };

    return (
        <RangesContext.Provider value={value}>
            {children}
        </RangesContext.Provider>
    );
};

// 3. Kreiraj custom hook za lakše korištenje
export const useRanges = () => {
    const context = useContext(RangesContext);
    if (context === undefined) {
        throw new Error('useRanges must be used within a RangesProvider');
    }
    return context;
};