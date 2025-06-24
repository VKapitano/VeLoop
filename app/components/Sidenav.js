'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // 1. Import Link
import { usePathname } from 'next/navigation'; // 1. Import usePathname
import coopLogo from '../(content)/img/logo/logo.png';

import { Home, List, UsersRound, Settings, Menu, X, Sun, Moon } from 'lucide-react';
const Sidenav = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const pathname = usePathname(); // 2. Get the current URL path

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

    // 3. Update NavLink to accept an href and wrap its content in a Link
    const NavLink = ({ icon, text, href, active = false }) => (
        <li>
            <Link href={href} passHref>
                <div className={`
                    flex items-center p-3 rounded-lg cursor-pointer overflow-hidden
                    lg:justify-center group-hover:lg:justify-start group-hover:lg:gap-4
                    ${active
                        ? 'bg-blue-100 text-blue-700 font-semibold dark:bg-blue-900/40 dark:text-blue-300'
                        : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800'
                    }
                 `}>
                    {icon}
                    <span className="whitespace-nowrap transition-all duration-200 lg:w-0 lg:opacity-0 group-hover:lg:w-auto group-hover:lg:opacity-100">
                        {text}
                    </span>
                </div>
            </Link>
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
                    <div className="flex items-center h-[70px] border-b dark:border-gray-800 overflow-hidden">
                        <Link href="/" className="w-full flex items-center gap-4 p-3 pl-16 lg:pl-6 lg:justify-center group-hover:lg:justify-start">
                            <Image src={coopLogo} alt="Logo Icon" width={32} height={32} className="flex-shrink-0" />
                            <span className="text-xl font-bold whitespace-nowrap dark:text-white transition-all duration-200 lg:w-0 lg:opacity-0 group-hover:lg:w-auto group-hover:lg:opacity-100">
                                COOP
                            </span>
                        </Link>
                    </div>
                    <nav className="p-2 mt-4">
                        <ul className="space-y-2">
                            {/* 4. Update the NavLink calls with href and dynamic active state */}
                            <NavLink
                                icon={<Home size={24} className="flex-shrink-0" />}
                                text="Data"
                                href="/data"
                                active={pathname === '/data'}
                            />
                            <NavLink
                                icon={<List size={24} className="flex-shrink-0" />}
                                text="Ranges"
                                href="/ranges"
                                active={pathname === '/ranges'}
                            />
                            <NavLink
                                icon={<UsersRound size={24} className="flex-shrink-0" />}
                                text="Users"
                                href="/users"
                                active={pathname === '/users'}
                            />
                        </ul>
                    </nav>
                </div>

                <div className="p-2 border-t dark:border-gray-800">
                    <ul className="space-y-2">
                        <li>
                            <div
                                onClick={toggleDarkMode}
                                className="flex items-center p-3 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 overflow-hidden lg:justify-center group-hover:lg:justify-start group-hover:lg:gap-4"
                            >
                                {isDarkMode ? <Sun size={24} className="flex-shrink-0" /> : <Moon size={24} className="flex-shrink-0" />}
                                <span className="whitespace-nowrap transition-all duration-200 lg:w-0 lg:opacity-0 group-hover:lg:w-auto group-hover:lg:opacity-100">
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

export default Sidenav;