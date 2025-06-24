'use client';
import React, { useState, useEffect } from 'react';

import DynamicHeader from '../components/DynamicHeader';
import Sidenav from '../components/Sidenav';

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

export default ContentLayout;