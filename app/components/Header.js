import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { UserCircle, LogOut } from 'lucide-react';

const Header = ({ title, onLogout }) => {
    const { isLoaded, user } = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Effect to close the dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Get the first initial of the user's email for a personalized avatar
    const userInitial = user?.primaryEmailAddress?.emailAddress?.[0]?.toUpperCase();

    return (
        <header className="h-[70px] bg-gray-200 dark:bg-gray-900 flex items-center justify-between px-4 sm:px-6 shadow-md flex-shrink-0">
            {/* Left side: Title */}
            <h1 className="text-xl sm:text-2xl mx-13 lg:mx-4 font-bold text-gray-800 dark:text-gray-200 truncate">
                {title}
            </h1>

            {/* Right side: User Menu */}
            {isLoaded && user && (
                // Added mr-4 to move the component away from the right edge
                <div className="relative mr-4" ref={dropdownRef}>
                    {/* User icon button that toggles the dropdown */}
                    <button
                        onClick={() => setIsDropdownOpen(prev => !prev)}
                        className="flex items-center justify-center h-[44px] w-[44px] bg-gray-700/50 dark:bg-gray-700 rounded-full text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-200"
                        aria-haspopup="true"
                        aria-expanded={isDropdownOpen}
                    >
                        {/* If user initial is available, show it. Otherwise, show generic icon. */}
                        {userInitial ? (
                            <span className="font-bold text-xl">{userInitial}</span>
                        ) : (
                            <UserCircle size={28} className="text-gray-200" />
                        )}
                    </button>

                    {/* Animated Dropdown Menu */}
                    <div
                        className={`absolute top-full right-0 mt-2 w-auto min-w-[240px] origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black ring-opacity-5 transition-all duration-150 ease-out
                                  ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                        role="menu"
                    >
                        <div className="flex items-center justify-between p-3" role="menuitem">
                            {/* User email display */}
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate" title={user.primaryEmailAddress?.emailAddress}>
                                {user.primaryEmailAddress?.emailAddress}
                            </span>
                            {/* Logout button with updated red styling */}
                            <button
                                onClick={onLogout}
                                className="ml-4 p-1 text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full transition-all duration-150 ease-in-out"
                                aria-label="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;