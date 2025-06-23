import React from 'react'
import Link from 'next/link';
import Image from 'next/image'; // I dalje je dobra praksa koristiti next/image

import { Home, BarChart2, Package, Users, Settings } from 'lucide-react';

import DynamicHeader from '../components/DynamicHeader';

const ContentLayout = ({ children }) => {
  return (
        <div className="flex h-screen bg-gray-800">
            <Sidenav />
            <div className="flex flex-1 flex-col">
                <DynamicHeader title="Ranges" username="Vedran Kapitanović"/>
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
};

/* stari hader - nije u upotrebi*/
const Header1 = () => {
    return (
        <div>
            <header className="bg-gray-900 shadow-sm">
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
    return (
        // <aside> je i dalje dobar semantički izbor
    // Stilovi su isti kao u prethodnom primeru i definišu izgled kontejnera
    <aside className="w-64 h-screen bg-gray-800 border-r border-gray-900 p-5">
      
      {/* Logo sekcija */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-800">Moj Panel</h1>
      </div>

      {/* Navigaciona sekcija */}
      <nav>
        {/* Koristimo običnu listu i divove umesto linkova */}
        <ul className="space-y-3">
          
          {/* Primer aktivnog linka (čisto vizuelno) */}
          <li>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-100 text-blue-700 font-semibold">
              <Home size={20} />
              <span>Početna</span>
            </div>
          </li>

          {/* Primer običnog linka */}
          <li>
            <div className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-gray-200 cursor-pointer">
              <BarChart2 size={20} />
              <span>Analitika</span>
            </div>
          </li>

          {/* Još jedan običan link */}
          <li>
            <div className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-gray-200 cursor-pointer">
              <Package size={20} />
              <span>Proizvodi</span>
            </div>
          </li>

          {/* ...možeš dodati još stavki po potrebi... */}

        </ul>
      </nav>

       {/* Opcioni deo na dnu, npr. podešavanja */}
       <div className="absolute bottom-5">
         <div className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-gray-200 cursor-pointer">
            <Settings size={20} />
            <span>Podešavanja</span>
         </div>
       </div>

    </aside>
    )
}

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