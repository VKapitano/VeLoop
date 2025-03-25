// app/(dashboard)/page.js
'use client';

import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear the auth test cookie by setting it to expire in the past
    document.cookie =
      'auth-test=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';

    // Redirect to login page
    router.push('/login');
  };

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold'>Dashboard</h1>
          <button
            onClick={handleLogout}
            className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition'
          >
            Logout
          </button>
        </div>

        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-4'>
            Welcome to your dashboard
          </h2>
          <p className='text-gray-600'>
            This is a protected page. You're seeing this because you're "logged
            in" with our test auth cookie.
          </p>

          <div className='mt-6 p-4 bg-blue-50 rounded-md'>
            <p className='text-sm text-blue-800'>
              <strong>Note:</strong> In a real application, this page would
              display user-specific content and the logout functionality would
              use a proper auth system like NextAuth.js.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
