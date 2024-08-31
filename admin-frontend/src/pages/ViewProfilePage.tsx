import React from 'react';
import { Link } from 'react-router-dom';

const ViewProfilePage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-8 w-full max-w-md">
                <h1 className="text-2xl font-semibold mb-6">Profile Overview</h1>

                {/* Profile Details */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Current Profile Details</h2>
                    <div className="flex flex-col space-y-4">
                        <div>
                            <span className="font-medium text-gray-600">Name:</span>
                            <p className="text-gray-800">John Doe</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Email:</span>
                            <p className="text-gray-800">johndoe@example.com</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Profile Picture:</span>
                            <img
                                src="/images/profile-pic.jpg"
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover mt-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Links to Update Password and Profile Picture */}
                <div className="flex flex-col space-y-4 mb-6">
                    <Link
                        to="/update-profile-picture"
                        className="block bg-blue-600 text-white text-center py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        Update Profile Picture
                    </Link>
                    <Link
                        to="/change-password"
                        className="block bg-blue-600 text-white text-center py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        Change Password
                    </Link>
                </div>

                {/* Current Activities */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Current Activities</h2>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 shadow-md">
                        <ul className="space-y-2">
                            <li className="text-gray-700">Completed course: Advanced React</li>
                            <li className="text-gray-700">Joined discussion: Web Development Trends</li>
                            <li className="text-gray-700">Updated profile: New profile picture</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProfilePage;
