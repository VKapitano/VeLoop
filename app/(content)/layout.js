'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import coopLogo from './img/logo/logo.png';

import { Home, BarChart2, Package, Users, Settings, Menu, X, Sun, Moon } from 'lucide-react';

import DynamicHeader from '../components/DynamicHeader';

const ContentLayout = ({ children }) => {
  return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidenav />
            <div className="flex flex-1 flex-col">
                <DynamicHeader title="Ranges" username="User"/>
                <main className="flex-1 overflow-y-auto">
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