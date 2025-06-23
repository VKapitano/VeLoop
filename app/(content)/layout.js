'use client';
import React, { useState, useEffect } from 'react'; // Added
import Link from 'next/link';
import Image from 'next/image'; // I dalje je dobra praksa koristiti next/image

import { Home, BarChart2, Package, Settings, Menu, X, Sun, Moon } from 'lucide-react';

const ContentLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidenav />
            <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
};

const Header = () => {
    return (
        <div>
            <header className="bg-white shadow-sm">
                <div className="container mx-auto flex justify-between items-center p-4">
                    {/* Logo */}
                    <Link href="/">
                        {/* Za maksimalnu jednostavnost, možemo koristiti i tekstualni logo */}
                        <div className="text-2xl font-bold text-blue-600">
                            MojLogo
                        </div>
                    </Link>
                    {/* Navigacija */}
                    <nav>
                        {/* 'flex' poravnava linkove jedan do drugog
                        'gap-6' dodaje razmak od 6 jedinica (24px) između linkova */}
                        <div className="flex items-center gap-6">
                            <Link href="/o-nama" className="text-gray-600 hover:text-black font-medium">
                                O nama
                            </Link>
                            <Link href="/usluge" className="text-gray-600 hover:text-black font-medium">
                                Usluge
                            </Link>
                            <Link
                                href="/kontakt"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-semibold"
                            >
                                Kontakt
                            </Link>
                        </div>
                    </nav>
                </div>
            </header>
        </div>
    )
};

const Sidenav = () => {
    // State to manage whether the sidenav is open or closed
    const [isOpen, setIsOpen] = useState(false);

    // State to manage dark mode
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Effect to check for saved dark mode preference in localStorage
    useEffect(() => {
        const darkModeSaved = localStorage.getItem('darkMode') === 'true';
        setIsDarkMode(darkModeSaved);
    }, []);

    // Effect to apply/remove the 'dark' class to the body and save preference
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    }, [isDarkMode]);

    const toggleSidenav = () => setIsOpen(!isOpen);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    return (
        <>
            {/* Hamburger Menu Button to toggle Sidenav */}
            {/* This button is positioned to be always visible */}
            <button
                onClick={toggleSidenav}
                // CHANGED: Removed `lg:hidden` to make it visible on all screen sizes
                className="fixed top-5 left-5 z-50 p-2 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                aria-label="Toggle navigation"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay for mobile view - closes sidenav when clicked */}
            {isOpen && (
                <div
                    onClick={toggleSidenav}
                    // CHANGED: Removed `lg:hidden` to make it work on all screen sizes
                    className="fixed inset-0 bg-black/50 z-30"
                    aria-hidden="true"
                ></div>
            )}

            {/* The Sidenav itself */}
            <aside
                className={`
                    fixed top-0 left-0 z-40 w-64 h-screen p-5
                    bg-gray-100 border-r border-gray-200
                    dark:bg-gray-900 dark:border-gray-700
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Logo sekcija */}
                {/*
                <div className="mb-10">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100"></h1>
                </div>
                */}
                <br></br>
                <br></br>
                <br></br>

                {/* Navigaciona sekcija */}
                <nav>
                    <ul className="space-y-3">
                        {/* Primer aktivnog linka */}
                        <li>
                            <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-100 text-blue-700 font-semibold dark:bg-blue-900/40 dark:text-blue-300">
                                <Home size={20} />
                                <span>Početna</span>
                            </div>
                        </li>

                        {/* Primer običnog linka */}
                        <li>
                            <div className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-gray-200 cursor-pointer dark:text-gray-300 dark:hover:bg-gray-800">
                                <BarChart2 size={20} />
                                <span>Analitika</span>
                            </div>
                        </li>

                        {/* Još jedan običan link */}
                        <li>
                            <div className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-gray-200 cursor-pointer dark:text-gray-300 dark:hover:bg-gray-800">
                                <Package size={20} />
                                <span>Proizvodi</span>
                            </div>
                        </li>
                    </ul>
                </nav>

                {/* Sekcija na dnu: Podešavanja i Dark Mode Toggle */}
                <div className="absolute bottom-5 left-5 right-5">
                    <div className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-gray-200 cursor-pointer dark:text-gray-300 dark:hover:bg-gray-800">
                        <Settings size={20} />
                        <span>Podešavanja</span>
                    </div>

                    {/* Dark Mode Toggle Button */}
                    <button
                        onClick={toggleDarkMode}
                        className="w-full flex items-center gap-3 p-2 mt-3 rounded-lg text-gray-600 hover:bg-gray-200 cursor-pointer dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        <span>{isDarkMode ? 'Svetli Režim' : 'Tamni Režim'}</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default ContentLayout

/*
useEffect(() => {
    if (isLoaded && (isSignedIn)) {
        Router.push('/login');
    } else {
        const mainSection = PathnameContext.split('/')[i];

        switch (mainSection) {
            case 'data':
                setPageTitle('Data');
                break;
            case 'user-management':
                setPageTitle('User Management');
                break;
            case 'ranges':
                setPageTitle('Ranges');
                break;
            case 'settings':
                setPageTitle('Settings');
                break;
            default:
                setPageTitle(
                    mainSection.charAt(0).toUpperCase() + mainSection-Silkscreen(1)
                );
        }
    }
})
*/