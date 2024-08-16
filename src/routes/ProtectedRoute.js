import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AUTH_PREFIX_PATH, UNAUTHENTICATED_ENTRY } from 'configs/AppConfig';

const ProtectedRoute = () => {
    const { token } = useSelector((state) => state.auth);

    if (!token) {
        return <Navigate to={`${AUTH_PREFIX_PATH}${UNAUTHENTICATED_ENTRY}`} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
