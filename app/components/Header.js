import React from 'react'

import { UserCircle, ChevronDown } from 'lucide-react';

const User_button = ({ username }) => {
    return (
        <button className="flex items-center gap-2 text-white hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200">
            {/* Okrugla placeholder ikona korisnika */}
            <UserCircle size={28} className="text-gray-400" />

            {/* Ime korisnika */}
            <span className="font-medium">{username}</span>

            {/* Ikona za padajući izbornik */}
            <ChevronDown size={20} className="text-gray-500" />
        </button>
    )
}

const Header = ({ title, username, onLogout }) => {
  return (
        <header className="h-[70px] bg-gray-900 flex items-center justify-between px-6 shadow-md">
            {/* Lijeva strana: Naslov */}
            <h1 className="text-2xl font-bold text-white">
                {title}
            </h1>

            {/* Desna strana: Gumbovi */}
            <div className="flex items-center gap-4">
                {/* Gumb za korisnički profil */}
                <User_button username={ username } />
                <button onClick={onLogout} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                    Logout
                </button>
            </div>
        </header>
    )
}

export default Header