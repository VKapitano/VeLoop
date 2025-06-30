"use client";

import { useState, useEffect } from 'react';
import { Search, Pencil, Trash2 } from 'lucide-react';
import UserSidebar from './UserSidebar';
import ClientOnlyDate from './ClientOnlyDate';
// Note: My_button is not used in this version as we removed the "Add User" flow.
// User creation is handled by the registration page.

const Users = () => {
    // --- STATE MANAGEMENT ---
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Start in a loading state
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // --- DATA FETCHING ---
    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/users');
            if (!response.ok) {
                throw new Error('Failed to fetch users from the server.');
            }
            const data = await response.json();
            setUsers(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Run fetchUsers when the component first loads
    useEffect(() => {
        fetchUsers();
    }, []);

    // --- HANDLERS ---
    const handleOpenSidebar = (user) => {
        setSelectedUser(user);
        setIsSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
        setSelectedUser(null);
    };

    const handleSaveUser = async (userData) => {
        try {
            const response = await fetch(`/api/users/${userData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: userData.role, status: userData.status }),
            });

            if (!response.ok) {
                throw new Error('Failed to update the user.');
            }

            // On success, close the sidebar and refresh the user list to show changes
            handleCloseSidebar();
            fetchUsers();

        } catch (err) {
            console.error(err);
            alert('Error: ' + err.message); // Show an alert on failure
        }
    };

    const handleDeleteClick = (user) => {
        // Note: The API for deleting is not yet built, but the modal logic is here.
        setUserToDelete(user);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return; // Safety check

        try {
            // --- ADDED ---
            // This sends the DELETE request to your new backend endpoint
            const response = await fetch(`/api/users/${userToDelete.id}`, {
                method: 'DELETE',
            });

            // --- ADDED ---
            // This checks if the deletion was successful and shows an error if not
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete the user.');
            }

            // --- MOVED & KEPT ---
            // This still runs, but now only after a successful deletion
            handleCancelDelete();

            // --- ADDED ---
            // This refreshes the user list in the UI to remove the deleted user
            fetchUsers();

        } catch (err) {
            // --- ADDED ---
            // This shows any errors to you in an alert pop-up
            console.error(err);
            alert('Error: ' + err.message);
        }
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false);
        setUserToDelete(null);
    };

    const filteredUsers = users.filter(user =>
        user.emailAddresses[0].emailAddress.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // --- JSX / RENDER ---
    return (
        <div className="flex flex-col gap-6 relative">
            {/* Top section: Search */}
            <div className="h-[75px] w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center justify-between dark:border dark:border-gray-700">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search users by email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full max-w-xs pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Main table section with Loading and Error states */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:border dark:border-gray-700 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center">Loading users...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Role</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Last Login</th>
                                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.emailAddresses[0].emailAddress}</td>
                                        <td className="px-6 py-4">{user.privateMetadata?.role || "Viewer"}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${!user.publicMetadata.status || user.publicMetadata?.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>{user.publicMetadata.status ? user.publicMetadata?.status : "Active"}</span>
                                        </td>
                                        <td className="px-6 py-4"><ClientOnlyDate dateString={user.lastActiveAt} /></td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-4">
                                                <button onClick={() => handleOpenSidebar(user)} className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                                                    <Pencil className="h-5 w-5" />
                                                </button>
                                                <button onClick={() => handleDeleteClick(user)} className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400">
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Render the Sidebar Component (no changes needed to UserSidebar.js itself) */}
            <UserSidebar
                isOpen={isSidebarOpen}
                mode="edit" // Sidebar is only for editing
                user={selectedUser}
                onClose={handleCloseSidebar}
                onSave={handleSaveUser}
            />

            {/* Delete Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCancelDelete}></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Deletion</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            Are you sure you want to delete the user <strong className="dark:text-white">{userToDelete?.email}</strong>? This action cannot be undone.
                        </p>
                        <div className="mt-6 flex justify-end gap-4">
                            <button onClick={handleCancelDelete} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Cancel</button>
                            <button onClick={handleConfirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;