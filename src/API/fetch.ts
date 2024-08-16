import { API_BASE_URL } from 'configs/AppConfig';
import { AUTH_TOKEN, REFRESH_TOKEN } from 'constants/AuthConstant';
import { isTokenExpired, isTokenValid } from '../utils/helpers/auth';

export const _fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    let accessToken = localStorage.getItem(AUTH_TOKEN);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (accessToken && (!isTokenValid(accessToken) || isTokenExpired(accessToken))) {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`,
            },
        });

        if (!refreshResponse.ok) {
            throw new Error('Failed to refresh accessToken');
        }

        const data = await refreshResponse.json();

        localStorage.setItem(AUTH_TOKEN, data.access_token);

        accessToken = data.access_token;
    }

    const headers = {
        ...init?.headers,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    };

    return fetch(input, {
        ...init,
        headers,
    });
};
