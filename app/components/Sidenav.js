'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import coopLogo from '../(content)/img/logo/logo.png';

import { Home, List, UsersRound, Menu, X, Sun, Moon } from 'lucide-react';

const Sidenav = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const pathname = usePathname();

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

    const NavLink = ({ icon, text, href, active = false }) => (
        <li>
            <Link href={href} passHref>
                <div className={`
                    flex items-center p-3 rounded-lg cursor-pointer overflow-hidden gap-4
                    ${active
                        ? 'bg-gray-100 text-[#05a9d0] font-semibold dark:bg-blue-900/40 dark:text-blue-300'
                        : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800'
                    }
                 `}>
                    <div className="flex-shrink-0 w-10 flex justify-center">
                        {icon}
                    </div>
                    <span className="whitespace-nowrap transition-opacity duration-300 lg:w-0 lg:opacity-0 group-hover:lg:w-auto group-hover:lg:opacity-100">
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
                    transition-all duration-400 ease-in-out
                    lg:w-20 hover:lg:w-64
                    w-64 transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
                `}
            >
                <div className="pt-14 md:pt-0">
                    {/* --- START OF LOGO FIX --- */}
                    <div className=" items-center h-[70px] border-b dark:border-gray-800 overflow-hidden hidden md:block">
                        <Link href="/data" className="w-full flex items-center gap-4 p-3 pl-16 lg:p-5">
                            <div className="flex-shrink-0 w-10 flex justify-center">
                                <Image src={coopLogo} alt="Logo Icon" width={32} height={32} className="flex-shrink-0" />
                            </div>
                            <span className="text-xl font-bold whitespace-nowrap dark:text-white transition-opacity duration-300 lg:w-0 lg:opacity-0 group-hover:lg:w-auto group-hover:lg:opacity-100">
                                VeLoop
                            </span>
                        </Link>
                    </div>
                    {/* --- END OF LOGO FIX --- */}
                    <nav className="p-2 mt-4">
                        <ul className="space-y-2">
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

            </aside>
        </>
    );
};

export default Sidenav;