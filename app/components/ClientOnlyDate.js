"use client";

import { useState, useEffect } from 'react';

const formatLastLogin = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const ClientOnlyDate = ({ dateString }) => {
    const [formattedDate, setFormattedDate] = useState(null);

    useEffect(() => {
        // This code only runs on the client, after the component has mounted.
        // By this point, hydration is complete.
        setFormattedDate(formatLastLogin(dateString));
    }, [dateString]);

    // On the initial server render and client hydration, this will return null,
    // ensuring there's no mismatch. Then, useEffect updates it to the correct value.
    return <>{formattedDate}</>;
};

export default ClientOnlyDate;