// app/context/RangesContext.js
'use client';

import React, { createContext, useState, useContext } from 'react';

// Početni podaci koje si imao u /ranges/page.js
const initialData = [
    { id: 1, title: 'Summer Sale 2024', description: 'Discount range for all summer items.', items: [] },
    { id: 2, title: 'Black Friday Deals', description: 'Special offers available only on Black Friday.', items: [] },
    { id: 3, title: 'New Year Clearance', description: 'End-of-year clearance sale for selected products.', items: [] },
    { id: 4, title: 'VIP Customer Exclusive', description: 'A special range for our most loyal customers.', items: []  },
    { id: 5, title: 'Flash Sale', description: 'Limited time offer, valid for 24 hours.', items: []  },
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