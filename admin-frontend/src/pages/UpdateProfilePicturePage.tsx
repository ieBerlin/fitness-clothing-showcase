import React from 'react';

const UpdateProfilePicturePage: React.FC = () => {
    return (
        <div>
            <h1>Update Profile Picture</h1>
            <form>
                <label htmlFor="profilePicture">Choose a new profile picture:</label>
                <input type="file" id="profilePicture" name="profilePicture" accept="image/*" />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default UpdateProfilePicturePage;
