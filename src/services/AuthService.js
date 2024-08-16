import fetch from 'auth/FetchInterceptor';
import axios from 'axios';
import ApiService from '../auth/FetchInterceptor';
import { env } from '../configs/EnvironmentConfig.js';
import { AUTH_TOKEN, REFRESH_TOKEN } from '../constants/AuthConstant';

const AuthService = {};

AuthService.login = async function (email, password) {
    const response = await ApiService.post(
        '/auth/login',
        {
            email: email,
            password: password,
        },
        {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
        },
    );
    return response;
};

AuthService.refreshToken = async () => {
    const response = await axios.get(`${env.API_BASE_URL}/auth/refresh`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem(REFRESH_TOKEN)}`,
        },
    });
    localStorage.setItem(AUTH_TOKEN, response.data.access_token);
    localStorage.setItem(REFRESH_TOKEN, response.data.refresh_token);
    return response;
};

AuthService.register = function (data) {
    return fetch({
        url: '/auth/register',
        method: 'post',
        data: data,
    });
};

export default AuthService;
