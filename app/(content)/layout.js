'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // 1. Import Link
import { usePathname } from 'next/navigation'; // 1. Import usePathname
import coopLogo from './img/logo/logo.png';

import { Home, List, UsersRound, Settings, Menu, X, Sun, Moon } from 'lucide-react';

import DynamicHeader from '../components/DynamicHeader';
import Sidenav from '../components/Sidenav';

const ContentLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidenav />
            <div className="flex flex-1 flex-col">
                <DynamicHeader title="Ranges" username="User" />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
};

export default ContentLayout;