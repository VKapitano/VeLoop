'use client'; // <-- Ključna direktiva koja ovo čini Client komponentom

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // <-- Next.js hook za čitanje URL-a
import { signOut } from 'next-auth/react'; // <-- ozbiljniji način za logout

import Header from './Header';

// Prihvaća props (npr. username) od Server komponente (layouta)
const DynamicHeader = ({ username }) => {
    const pathname = usePathname(); // Dohvaća trenutnu putanju, npr. "/data"
    const [title, setTitle] = useState('');

    // Efekt koji se pokreće svaki put kad se promijeni URL (pathname)
    useEffect(() => {
        if (pathname.includes('/data')) {
            setTitle('Data');
        } else if (pathname.includes('/ranges')) {
            setTitle('Ranges');
        } else {
            // Fallback naslov ako je potrebno
            setTitle('Dashboard');
        }
    }, [pathname]);

     // Funkcija koja će se pozvati na klik
    const handleLogout = () => {
        // Poziv NextAuth funkcije za odjavu.
        // Ona će očistiti kolačić i preusmjeriti korisnika.
        // signOut({ callbackUrl: '/login' }); // <-- Možete specificirati gdje da preusmjeri korisnika nakon odjave
    };

    // Renderira originalnu "glupu" Header komponentu s dinamičkim naslovom
    return <Header title={title} username={username} onLogout={handleLogout} />;
};

export default DynamicHeader;