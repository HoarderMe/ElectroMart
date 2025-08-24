import React from 'react';
import { useAuth } from '../context/authContext';

const Logout = () => {
    const { logout } = useAuth();

    return (
        <button 
            onClick={logout}
            className="text-red-600 hover:text-red-800 font-medium"
        >
            Logout
        </button>
    );
};

export default Logout;