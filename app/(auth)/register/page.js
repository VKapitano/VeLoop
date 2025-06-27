'use client';

import { useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLoaded) return;

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Step 1: Create the user in Clerk
            const result = await signUp.create({
                emailAddress: email,
                password,
                // You can optionally pass unsafe_metadata to store the name
                // so Clerk knows about it from the start.
                unsafeMetadata: {
                    fullName: name,
                }
            });

            // If sign up is successful, Clerk creates a session.
            // We can now create the user in our own database.
            if (result.status === 'complete') {
                const clerkId = result.createdUserId;

                // Step 2: Call our own API to create the user in MongoDB
                const apiResponse = await fetch('/api/create-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        clerkId: clerkId,
                        email: email,
                        name: name,
                    }),
                });

                if (!apiResponse.ok) {
                    // If our API fails, we have an issue. The user exists in Clerk
                    // but not in our DB. We should show an error.
                    throw new Error("Failed to save user data. Please contact support.");
                }

                // Step 3: Set the session as active and redirect
                await setActive({ session: result.createdSessionId });
                router.push('/data'); // Or wherever you want to redirect after registration
            } else {
                // This can happen if email verification is required.
                // For now, we'll treat other states as an error for simplicity.
                console.log(JSON.stringify(result, null, 2));
                setError("Registration failed. It's possible email verification is required.");
            }
        } catch (err) {
            // This will catch errors from Clerk (e.g., weak password) or our API call.
            const errorMessage = err.errors?.[0]?.longMessage || err.message || 'An error occurred during registration.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Your JSX remains exactly the same as you provided it.
    // I've omitted it here for brevity, but you should keep your return (...) block.
    return (
        <div className='dark min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4'>
            <div className='max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                <h1 className='text-2xl font-bold text-center mb-6 dark:text-white'>
                    Create Your Account
                </h1>

                {error && (
                    <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded dark:bg-red-900/30 dark:border-red-700 dark:text-red-300'>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div>
                        <label
                            htmlFor='name'
                            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                        >
                            Full Name
                        </label>
                        <input
                            id='name'
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                            placeholder='John Doe'
                        />
                    </div>

                    <div>
                        <label
                            htmlFor='email'
                            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                        >
                            Email Address
                        </label>
                        <input
                            id='email'
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.targe.value)}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                            placeholder='you@example.com'
                        />
                    </div>

                    <div>
                        <label
                            htmlFor='password'
                            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                        >
                            Password
                        </label>
                        <input
                            id='password'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                            placeholder='••••••••'
                        />
                    </div>

                    <div>
                        <label
                            htmlFor='confirm-password'
                            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                        >
                            Confirm Password
                        </label>
                        <input
                            id='confirm-password'
                            type='password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                            placeholder='••••••••'
                        />
                    </div>

                    <div>
                        <button
                            type='submit'
                            disabled={isLoading}
                            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
                                }`}
                        >
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </div>
                </form>

                <div className='mt-6 text-center'>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Already have an account?{' '}
                        <Link
                            href='/login'
                            className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}