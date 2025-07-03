// app/context/RangesContext.js
'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

// Početni podaci koje si imao u /ranges/page.js
/*const initialData = [
    { id: 1, title: 'Summer Sale 2024', description: 'Discount range for all summer items.', startDate: '2025-06-27', endDate: '2025-07-04', items: [{id: 1, name: "new", description: "desc", ean: 0}, {id: 2, name: "new", description: "desc", ean: 0}] },
    { id: 2, title: 'Black Friday Deals', description: 'Special offers available only on Black Friday.', startDate: '2024-06-01', endDate: '2024-08-31', items: [{id: 3, name: "new", description: "desc", ean: 0}, {id: 4, name: "new", description: "desc", ean: 0}, {id: 5, name: "new", description: "desc", ean: 0}] },
    { id: 3, title: 'New Year Clearance', description: 'End-of-year clearance sale for selected products.', startDate: '2024-08-21', endDate: '2024-08-31', items: [{id: 6, name: "new", description: "desc", ean: 0}] },
    { id: 4, title: 'VIP Customer Exclusive', description: 'A special range for our most loyal customers.', startDate: '2021-04-01', endDate: '2024-06-27', items: [{id: 7, name: "new", description: "desc", ean: 0}, {id: 8, name: "new", description: "desc", ean: 0}]  },
    { id: 5, title: 'Flash Sale', description: 'Limited time offer, valid for 24 hours.', startDate: '2024-06-12', endDate: '2024-07-15', items: [{id: 9, name: "new", description: "desc", ean: 0}]  },
];*/

// 1. Kreiraj Context
const RangesContext = createContext(null);

// 2. Kreiraj Provider komponentu
export const RangesProvider = ({ children }) => {
    const [ranges, setRanges] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dohvati podatke s API-ja prilikom prvog učitavanja
    useEffect(() => {
        const fetchRanges = async () => {
            try {
                const response = await fetch('/api/ranges');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                
                // MongoDB vraća _id kao ObjectId, koji treba biti string u Reactu
                // Iako `JSON.parse(JSON.stringify(data))` to rješava na serveru,
                // fetch API i NextResponse.json to već sređuju za nas.
                setRanges(data);

            } catch (error) {
                console.error("Error fetching ranges:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRanges();
    }, []); // Prazan dependency array znači da se ovo pokreće samo jednom

    // --- AŽURIRANE FUNKCIJE ---

    // Funkcija za dodavanje novog range-a
    const addRange = async (newRange) => {
        try {
            const response = await fetch('/api/ranges', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRange),
            });
            if (!response.ok) throw new Error('Failed to add range');
            
            const result = await response.json();
            
            // Optimistično ažuriranje: dodajemo u stanje odmah
            // MongoDB `insertOne` vraća `insertedId`
            setRanges(prevRanges => [...prevRanges, { ...newRange, _id: result.insertedId }]);

        } catch (error) {
            console.error("Error adding range:", error);
        }
    };

    // Funkcija za dohvaćanje jednog "rangea" po ID-u
    const getRangeById = (id) => {
        // Sada tražimo po _id, koji je string
        return ranges.find(range => range._id === id);
    };

    const deleteRange = async (idToDelete) => {
        try {
            const response = await fetch(`/api/ranges/${idToDelete}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                // Ako server javi grešku, nemoj ažurirati stanje
                throw new Error('Failed to delete range on the server.');
            }
            // Ažuriraj stanje na klijentu tek nakon uspješnog brisanja na serveru
            setRanges(prevRanges => prevRanges.filter(range => range._id !== idToDelete));
        } catch (error) {
            console.error("Error deleting range:", error);
            // Ovdje možete dodati logiku za prikaz greške korisniku
        }
    };

    const updateRange = async (id, updatedData) => {
        try {
            const response = await fetch(`/api/ranges/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) {
                throw new Error('Failed to update range on the server.');
            }
            // Ažuriraj stanje na klijentu nakon uspješnog ažuriranja na serveru
            setRanges(prevRanges => 
                prevRanges.map(range => 
                    range._id === id ? { ...range, ...updatedData } : range
                )
            );
        } catch (error) {
            console.error("Error updating range:", error);
            // Ovdje možete dodati logiku za prikaz greške korisniku
        }
    };

    // --- AŽURIRAJ `value` OBJEKT ---
    const value = { ranges, loading, addRange, getRangeById, updateRange, deleteRange }

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