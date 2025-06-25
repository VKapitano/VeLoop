import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const UserSidebar = ({ isOpen, mode, user, onClose, onSave }) => {
    // Internal state to manage form fields
    const [formData, setFormData] = useState({});

    // When the component opens or the user being edited changes, update the form data
    useEffect(() => {
        if (mode === 'edit' && user) {
            setFormData(user);
        } else {
            // Default state for 'add' mode
            setFormData({
                email: '',
                password: '',
                role: 'Viewer', // Default role
                status: 'Active', // Default status
            });
        }
    }, [isOpen, mode, user]);

    // A generic handler for input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    // Determine if the save button should be disabled for 'add' mode
    const isAddButtonDisabled = mode === 'add' && (!formData.email || !formData.password);

    if (!isOpen) {
        return null;
    }

    return (
        // Main container with overlay
        <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Sidebar Panel */}
            <div className="relative z-[60] flex flex-col h-full w-full max-w-md ml-auto bg-white dark:bg-gray-800 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {mode === 'add' ? 'Add New User' : 'Edit User'}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-grow p-6 space-y-6 overflow-y-auto">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    {/* Password Field (only for 'add' mode) */}
                    {mode === 'add' && (
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password || ''}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    )}

                    {/* Role and Status fields (only for 'edit' mode) */}
                    {mode === 'edit' && (
                        <>
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                                <select
                                    name="role"
                                    id="role"
                                    value={formData.role || ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option>Admin</option>
                                    <option>Editor</option>
                                    <option>Viewer</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                <select
                                    name="status"
                                    id="status"
                                    value={formData.status || ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option>Active</option>
                                    <option>Inactive</option>
                                </select>
                            </div>
                        </>
                    )}

                    {/* Footer with Save Button */}
                    <div className="pt-6 border-t dark:border-gray-700">
                        <button
                            type="submit"
                            disabled={isAddButtonDisabled}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed dark:disabled:bg-blue-800"
                        >
                            {mode === 'add' ? 'Add User' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserSidebar;