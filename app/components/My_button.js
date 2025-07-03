import React from 'react';
import clsx from 'clsx';

const My_button = ({ variant = 'primary', children, className, ...props }) => {
    // 1. Osnovni stilovi zajednički za sve gumbe
    const baseStyles =
        'inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold transition-all duration-200 focus:outline-none whitespace-nowrap';

    // 2. Stilovi specifični za svaku varijantu
    const variantStyles = {
        // Crni obrub
        'outline-dark': 'border border-gray-700 dark:border-gray-600 bg-transparent dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600',

        // Plavi obrub
        'outline-blue': 'border border-blue-600 dark:border-blue-400 bg-transparent dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-600',

        // Plava pozadina (primarna akcija)
        'primary': 'border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',

        // Crvena pozadina (destruktivna akcija)
        'danger': 'border border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };

    // Ako se traži varijanta koja ne postoji, koristi primarnu
    const selectedVariant = variantStyles[variant] || variantStyles.primary;

    return (
        <button
            className={clsx(baseStyles, selectedVariant, className)}
            {...props} // Prosljeđuje onClick, type, itd.
        >
            {children}
        </button>
    );
};

export default My_button;