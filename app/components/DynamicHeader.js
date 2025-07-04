'use client'; // <-- Ključna direktiva koja ovo čini Client komponentom

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // <-- Next.js hook za čitanje URL-a
/* import { signOut } from 'next-auth/react'; // <-- ozbiljniji način za logout */
import { useClerk } from '@clerk/nextjs'; // <-- Importiramo Clerk hook za odjavu


import Header from './Header';

// Prihvaća props (npr. username) od Server komponente (layouta)
const DynamicHeader = ({ username }) => {
    const pathname = usePathname(); // Dohvaća trenutnu putanju, npr. "/data"
    const [title, setTitle] = useState('');
    const { signOut } = useClerk(); // <-- Dohvaćamo signOut funkciju iz Clerka

    // Efekt koji se pokreće svaki put kad se promijeni URL (pathname)
    useEffect(() => {
        if (pathname.includes('/data')) {
            setTitle('Data');
        } else if (pathname.includes('/ranges')) {
            setTitle('Ranges');
        } else if (pathname.includes('/users')) {
            setTitle('Users');
        } else {
            // Fallback naslov ako je potrebno
            setTitle('Dashboard');
        }
    }, [pathname]);

    // Funkcija koja će se pozvati na klik
    const handleLogout = () => {
        // Poziv Clerk funkcije za odjavu.
        // Ona će očistiti sesiju i preusmjeriti korisnika.
        signOut({ redirectUrl: '/login' });
    };

    // Renderira Header komponentu. Prop 'username' se više ne prosljeđuje
    // jer Header sada koristi 'useUser' hook da dohvati podatke o korisniku.
    return <Header title={title} onLogout={handleLogout} />;
};

export default DynamicHeader;