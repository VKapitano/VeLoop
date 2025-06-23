'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import coopLogo from './img/logo/logo.png';

import { Home, BarChart2, Package, Settings, Menu, X, Sun, Moon } from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-white shadow-sm dark:bg-gray-800 dark:border-b dark:border-gray-700">
            <div className="container mx-auto flex justify-between items-center p-4">
                <Link href="/">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        MojLogo
                    </div>
                </Link>
                <nav>
                    <div className="flex items-center gap-6">
                        <Link href="/o-nama" className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white font-medium">
                            O nama
                        </Link>
                        <Link href="/usluge" className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white font-medium">
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
    );
};

const ContentLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidenav />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
};

const Sidenav = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const darkModeSaved = localStorage.getItem('darkMode') === 'true';
        if (darkModeSaved) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            if (newMode) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('darkMode', 'true');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('darkMode', 'false');
            }
            return newMode;
        });
    };

    const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);

    const NavLink = ({ icon, text, active = false }) => (
        <li>
            <div className={`
                flex items-center gap-4 p-3 rounded-lg cursor-pointer
                ${active
                    ? 'bg-blue-100 text-blue-700 font-semibold dark:bg-blue-900/40 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800'
                }
             `}>
                {icon}
                <span className="whitespace-nowrap lg:opacity-0 group-hover:lg:opacity-100 transition-opacity duration-200">
                    {text}
                </span>
            </div>
        </li>
    );

    return (
        <>
            <button
                onClick={toggleMobileMenu}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                aria-label="Toggle navigation"
            >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {isMobileOpen && (
                <div
                    onClick={toggleMobileMenu}
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    aria-hidden="true"
                ></div>
            )}

            <aside
                className={`
                    group fixed lg:relative lg:left-0 top-0 z-40 h-screen
                    bg-white border-r border-gray-200
                    dark:bg-gray-950 dark:border-gray-800
                    
                    flex flex-col justify-between
                    
                    transition-all duration-300 ease-in-out
                    
                    /* Desktop State */
                    lg:w-20 hover:lg:w-64
                    
                    /* Mobile State - THIS IS THE FIXED PART */
                    w-64 transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
                `}
            >
                <div>
                    <div className="flex items-center justify-center h-20 border-b dark:border-gray-800">
                        <div className="w-full flex items-center justify-center gap-4 p-3">
                            {/* NOTE: Make sure you have a logo-icon.svg in your /public folder, or change the src */}
                            <Image src={coopLogo} alt="Logo Icon" width={32} height={32} />
                            <span className="text-xl font-bold whitespace-nowrap lg:opacity-0 group-hover:lg:opacity-100 transition-opacity duration-200 dark:text-white">
                                MojLogo
                            </span>
                        </div>
                    </div>
                    <nav className="p-2 mt-4">
                        <ul className="space-y-2">
                            <NavLink icon={<Home size={24} />} text="Početna" active />
                            <NavLink icon={<BarChart2 size={24} />} text="Analitika" />
                            <NavLink icon={<Package size={24} />} text="Proizvodi" />
                        </ul>
                    </nav>
                </div>

                <div className="p-2 border-t dark:border-gray-800">
                    <ul className="space-y-2">
                        <li>
                            <div
                                onClick={toggleDarkMode}
                                className="flex items-center gap-4 p-3 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
                                <span className="whitespace-nowrap lg:opacity-0 group-hover:lg:opacity-100 transition-opacity duration-200">
                                    {isDarkMode ? 'Svetli Režim' : 'Tamni Režim'}
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    );
};

export default ContentLayout;