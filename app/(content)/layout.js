'use client';
import React, { useState, useEffect } from 'react';

import DynamicHeader from '../components/DynamicHeader';
import Sidenav from '../components/Sidenav';

const ContentLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidenav />
            <div className="flex flex-1 flex-col overflow-hidden"> {/* Added overflow-hidden to prevent layout issues */}
                <DynamicHeader title="Ranges" username="User" />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6"> {/* Added padding to main content area */}
                    {children}
                </main>
            </div>
        </div>
    )
};

export default ContentLayout;