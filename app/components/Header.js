import React from 'react'
import My_button from './My_button';
import Image from 'next/image';
import coopLogo from '../(content)/img/logo/logo.png';
import Link from 'next/link';

import { UserCircle, ChevronDown, LogOut } from 'lucide-react'; // <-- Import LogOut icon
import { logout } from '../actions'; // <-- testni način za logout

const User_button = ({ username }) => {
    return (
        // FIX: Added responsive classes to hide text and chevron on small screens
        <button className="flex items-center gap-2 text-white group bg-gray-800 hover:bg-gray-200 p-2 rounded-lg transition-colors duration-200 ">
            {/* Okrugla placeholder ikona korisnika */}
            <UserCircle size={28} className="text-gray-200 group-hover:text-gray-700" />

            {/* Ime korisnika */}
            <span className="font-medium group-hover:text-gray-700 hidden sm:inline">{username}</span>

            {/* Ikona za padajući izbornik */}
            <ChevronDown size={20} className="text-gray-200 group-hover:text-gray-700 hidden sm:inline" />
        </button>
    )
}

const Header = ({ title, username, onLogout }) => {
    return (
        // FIX: Added responsive padding and reduced title size on mobile
        <header className="h-[70px] bg-gray-200 dark:bg-gray-900 flex items-center justify-between px-4 sm:px-6 shadow-md flex-shrink-0">
            {/* Lijeva strana: Naslov */}
            <h1 className="text-xl sm:text-2xl mx-13 font-bold text-gray-200 truncate">
                {title}
            </h1>

            <Link href="/data" className="flex items-center p-3">
                <Image src={coopLogo} alt="Logo Icon" width={40} height={40} className="block lg:hidden" />
                <span className="text-2xl font-bold whitespace-nowrap dark:text-white pl-5 hidden sm:block lg:hidden">COOP</span>
            </Link>

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