"use client";

import { useState } from 'react';
import { Search, Pencil, Trash2 } from 'lucide-react';
import My_button from './My_button';
import UserSidebar from './UserSidebar';
import ClientOnlyDate from './ClientOnlyDate';

const initialUsers = [
    {
        id: 1,
        email: 'john.doe@example.com',
        role: 'Admin',
        status: 'Active',
        lastLogin: '2023-10-26T10:00:00Z',
    },
    {
        id: 2,
        email: 'jane.smith@example.com',
        role: 'Editor',
        status: 'Active',
        lastLogin: '2023-10-25T14:30:00Z',
    },
    {
        id: 3,
        email: 'sam.wilson@example.com',
        role: 'Viewer',
        status: 'Inactive',
        lastLogin: '2023-09-15T09:15:00Z',
    },
    {
        id: 4,
        email: 'sara.jones@example.com',
        role: 'Editor',
        status: 'Active',
        lastLogin: '2023-10-26T11:45:00Z',
    },
];

const Users = () => {
    const [users, setUsers] = useState(initialUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sidebarMode, setSidebarMode] = useState('add');
    const [selectedUser, setSelectedUser] = useState(null);

    // NEW: State to hold the search query from the input field
    const [searchQuery, setSearchQuery] = useState('');

    // --- Handlers ---
    const handleOpenSidebar = (mode, user = null) => {
        setSidebarMode(mode);
        setSelectedUser(user);
        setIsSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
        setSelectedUser(null);
    };

    const handleSaveUser = (userData) => {
        if (sidebarMode === 'add') {
            const newUser = {
                ...userData,
                id: Date.now(),
                lastLogin: new Date().toISOString(),
            };
            // Add to the main list (initialUsers is just for the start)
            const updatedUsers = [...users, newUser];
            setUsers(updatedUsers);
        } else if (sidebarMode === 'edit') {
            setUsers(users.map(user =>
                user.id === userData.id ? { ...user, ...userData } : user
            ));
        }
        handleCloseSidebar();
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (userToDelete) {
            setUsers(users.filter((user) => user.id !== userToDelete.id));
            setIsModalOpen(false);
            setUserToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false);
        setUserToDelete(null);
    };

    // NEW: Filter the users based on the search query before rendering
    // This creates a new array `filteredUsers` that the table will use.
    // It's case-insensitive.
    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6 relative">
            {/* Top section: Search and Add User button */}
            <div className="h-[75px] w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center justify-between dark:border dark:border-gray-700">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    {/* UPDATED: Connect the input to our state */}
                    <input
                        type="text"
                        placeholder="Search users by email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full max-w-xs pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                </div>
                <My_button variant="primary" onClick={() => handleOpenSidebar('add')}>
                    <span>+</span>
                    <span className="hidden md:block ml-2">Add User</span>
                </My_button>
            </div>

            {/* Main table section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:border dark:border-gray-700 overflow-hidden">
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
                            {/* UPDATED: Map over the filteredUsers array instead of the original users array */}
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.email}</td>
                                    <td className="px-6 py-4">{user.role}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>{user.status}</span>
                                    </td>
                                    <td className="px-6 py-4"><ClientOnlyDate dateString={user.lastLogin} /></td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-4">
                                            <button onClick={() => handleOpenSidebar('edit', user)} className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
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
            </div>

            {/* Render the Sidebar Component */}
            <UserSidebar
                isOpen={isSidebarOpen}
                mode={sidebarMode}
                user={selectedUser}
                onClose={handleCloseSidebar}
                onSave={handleSaveUser}
            />

            {/* Delete Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center">
                    {/* Overlay with the desired "fogged" effect */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleCancelDelete}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Deletion</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            Are you sure you want to delete the user <strong className="dark:text-white">{userToDelete?.email}</strong>? This action cannot be undone.
                        </p>
                        <div className="mt-6 flex justify-end gap-4">
                            <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;