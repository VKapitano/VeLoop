import React from 'react'
import My_button from './My_button';

import { UserCircle, ChevronDown, LogOut } from 'lucide-react'; // <-- Import LogOut icon
import { logout } from '../actions'; // <-- testni način za logout

const User_button = ({ username }) => {
    return (
        // FIX: Added responsive classes to hide text and chevron on small screens
        <button className="flex items-center gap-2 text-white group bg-gray-800 hover:bg-gray-200 p-2 rounded-lg transition-colors duration-200">
            {/* Okrugla placeholder ikona korisnika */}
            <UserCircle size={28} className="text-gray-200 group-hover:text-gray-700" />

            {/* Ime korisnika - Hidden on small screens */}
            <span className="font-medium group-hover:text-gray-700 hidden sm:inline">{username}</span>

            {/* Ikona za padajući izbornik - Hidden on small screens */}
            <ChevronDown size={20} className="text-gray-200 group-hover:text-gray-700 hidden sm:inline" />
        </button>
    )
}

const Header = ({ title, username, onLogout }) => {
    return (
        // FIX: Added responsive padding and reduced title size on mobile
        <header className="h-[70px] bg-gray-500 dark:bg-gray-900 flex items-center justify-between px-4 sm:px-6 shadow-md flex-shrink-0">
            {/* Lijeva strana: Naslov */}
            <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
                {title}
            </h1>

            {/* Desna strana: Gumbovi */}
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Gumb za korisnički profil */}
                <User_button username={username} />
                {/* FIX: Logout button now shows an icon on mobile and text on larger screens */}
                <My_button onClick={() => logout()} variant="danger">
                    <span className="sm:hidden">
                        <LogOut size={20} />
                    </span>
                    <span className="hidden sm:inline">
                        Logout
                    </span>
                </My_button>
            </div>
        </header>
    )
}

export default Header