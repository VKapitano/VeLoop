// app/(auth)/login/page.js
'use client';

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs'; // Import useSignIn from Clerk
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  // Use the Clerk hook
  const { isLoaded, signIn, setActive } = useSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // This is the only part that changes.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) {
      // Clerk's hook is not ready yet, do nothing.
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Step 1: Start the sign-in process with Clerk
      const result = await signIn.create({
        identifier: email, // 'identifier' can be email or username
        password,
      });

      // Step 2: Check the result status
      if (result.status === 'complete') {
        // If sign-in is complete, set the active session for the user
        await setActive({ session: result.createdSessionId });
        // And redirect them to the dashboard or main page
        router.push('/data');
      } else {
        // This can happen for cases like multi-factor authentication.
        // For this simple case, we'll log it and show a generic error.
        console.log(JSON.stringify(result, null, 2));
        setError('Something went wrong during login. Please try again.');
      }
    } catch (err) {
      // This will catch any errors from Clerk, such as "invalid password"
      const errorMessage = err.errors?.[0]?.longMessage || 'Invalid email or password.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Your JSX (the return statement) stays exactly the same.
  // I have omitted it for brevity. Just replace the handleSubmit function.
  return (
    <div className='dark min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4'>
      <div className='max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold text-center mb-6 dark:text-white'>
          Login to Your Account
        </h1>

        {error && (
          <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded dark:bg-red-900/30 dark:border-red-700 dark:text-red-300'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
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
              onChange={(e) => setEmail(e.target.value)}
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

          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <input
                id='remember-me'
                type='checkbox'
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded'
              />
              <label
                htmlFor='remember-me'
                className='ml-2 block text-sm text-gray-700 dark:text-gray-300'
              >
                Remember me
              </label>
            </div>

            <div className='text-sm'>
              <a href='#' className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'>
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={isLoading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Don&apos;t have an account?{' '}
            <Link
              href='/register'
              className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
            >
              Register
            </Link>
          </p>
        </div>

        {/* You can now safely remove this testing info box! */}
        <div className='mt-8 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-md text-sm dark:text-gray-300'>
          <p className='font-medium text-red-500'>For testing, use these credentials:</p>
          <p className='text-red-500'>Email: test@example.com</p>
          <p className='text-red-500'>Password: password123</p>
        </div>
      </div>
    </div>
  );
}