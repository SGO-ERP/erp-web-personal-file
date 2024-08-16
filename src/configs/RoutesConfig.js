import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from 'configs/AppConfig';
import React from 'react';

export const publicRoutes = [
    {
        key: 'login',
        path: `${AUTH_PREFIX_PATH}/login`,
        component: React.lazy(() => import('views/auth-views/authentication')),
    },
    {
        key: 'error-page-1',
        path: `${AUTH_PREFIX_PATH}/error-page-1`,
        component: React.lazy(() => import('views/auth-views/errors/error-page-1')),
    },
    {
        key: 'error-page-2',
        path: `${AUTH_PREFIX_PATH}/error-page-2`,
        component: React.lazy(() => import('views/auth-views/errors/error-page-2')),
    },
];

export const protectedRoutes = [
    // Duty routes
    {
        key: 'service.userMyProfileData',
        path: `${APP_PREFIX_PATH}/duty/data/me`,
        component: React.lazy(() => import('views/app-views/service/userMyProfileData')),
    },
    {
        key: 'service.data',
        path: `${APP_PREFIX_PATH}/duty/data/:id`,
        component: React.lazy(() => import('views/app-views/service/data')),
    },
];
