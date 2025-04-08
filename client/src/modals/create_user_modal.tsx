import React from "react";

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90">
            <div className="bg-white rounded-xl p-6 w-96 shadow-lg relative text-black">
                <h2 className="text-lg font-semibold mb-4">Create New User</h2>
                <label>
                    Username
                </label>
                <input
                    type="text"
                    placeholder="User Name"
                    className="border border-gray-300 px-3 py-2 rounded w-full mb-3"
                />
                <label>
                    Email
                </label>
                <input
                    type="email"
                    placeholder="Email"
                    className="border border-gray-300 px-3 py-2 rounded w-full mb-3"
                />
                <label>
                    Password
                </label>
                <input
                    type="password"
                    placeholder="Password"
                    className="border border-gray-300 px-3 py-2 rounded w-full mb-3"
                />
                <label>
                    Confirm Password
                </label>
                <input
                    type="password"
                    placeholder="Password"
                    className="border border-gray-300 px-3 py-2 rounded w-full mb-3"
                />

                <div className="flex justify-end mt-4">
                    <button
                        className=" bg-red-700 mr-2 px-4 py-2 rounded text-white"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-sky-950 text-white rounded"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateUserModal;
