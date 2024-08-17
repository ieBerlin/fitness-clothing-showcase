import React from 'react';
import { useParams } from 'react-router-dom';

const AdminDetails: React.FC = () => {
    const { adminId } = useParams<{ adminId: string }>();

    return (
        <div>
            <h1>Admin Details</h1>
            <p>Details for admin with ID: {adminId}</p>
        </div>
    );
};

export default AdminDetails;
