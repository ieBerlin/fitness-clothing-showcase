import React, { useState } from 'react';
import { CameraIcon } from '@heroicons/react/24/outline';

const UpdateProfilePicturePage: React.FC = () => {
    const [profilePicture, setProfilePicture] = useState<string | ArrayBuffer | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Implement upload logic here
        console.log('Profile picture uploaded');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-8 w-full max-w-md">
                <h1 className="text-2xl font-semibold mb-4">Update Profile Picture</h1>
                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-4">
                        <img
                            src={profilePicture || '/images/default-profile.png'}
                            alt="Profile"
                            className="w-full h-full rounded-full border-4 border-gray-300 object-cover"
                        />
                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
                            <CameraIcon className="w-6 h-6" />
                            <input
                                type="file"
                                id="profilePicture"
                                name="profilePicture"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors"
                    >
                        Upload
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfilePicturePage;
