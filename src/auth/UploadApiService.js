import { notification } from 'antd';
import axios from 'axios';
import { S3_BASE_URL } from 'configs/AppConfig';
import { AUTH_TOKEN, REFRESH_TOKEN } from 'constants/AuthConstant';
import { refreshTokenAccess, signOutSuccess } from 'store/slices/authSlice';
import store from '../store';

const unauthorizedCode = [401, 404];

const uploadService = axios.create({
    baseURL: S3_BASE_URL,
    timeout: 60000,
});

// Config
const TOKEN_PAYLOAD_KEY = 'Authorization';

uploadService.interceptors.request.use(
    (config) => {
        const jwtToken = localStorage.getItem(AUTH_TOKEN) || null;
        if (jwtToken) {
            config.headers[TOKEN_PAYLOAD_KEY] = 'Bearer ' + jwtToken;
        }
        return config;
    },
    (error) => {
        // Do something with request error here
        notification.error({
            message: 'Error',
        });
        Promise.reject(error);
    },
);

// API respone interceptor
uploadService.interceptors.response.use(
    (response) => {
        // return response.data.access_token
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        let notificationParam = {
            message: '',
        };

        if (unauthorizedCode.includes(error.response.status) && !originalRequest.sent) {
            try {
                originalRequest.sent = true;
                const token = await store.dispatch(refreshTokenAccess());
                if (token.payload === undefined) {
                    localStorage.removeItem(AUTH_TOKEN);
                    localStorage.removeItem(REFRESH_TOKEN);
                    store.dispatch(signOutSuccess());
                }
                originalRequest.headers['Authorization'] = `Bearer ${token.payload}`;
                notificationParam.message = 'Token is refreshed';
                return axios(originalRequest);
            } catch (error) {
                console.error('error', error);
                localStorage.removeItem(AUTH_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
                store.dispatch(signOutSuccess());
                return Promise.reject(error);
            }
        }

        // if (unauthorizedCode.includes(error.response.status) && !originalRequest._retry) {
        // 	originalRequest._retry = true;
        // 	try {
        // 		const token = await store.dispatch(refreshTokenAccess());
        // 		originalRequest.headers.Authorization = token;
        // 		return axios(originalRequest);
        // 	} catch (error) {
        // 		localStorage.removeItem(AUTH_TOKEN);
        // 		localStorage.removeItem(REFRESH_TOKEN);
        // 		store.dispatch(signOutSuccess());
        // 		notificationParam.message = 'Authentication Fail'
        // 		notificationParam.description = 'Please login again'
        // 		notification.error(notificationParam)
        // 		return Promise.reject(error);
        // 	}
        // }

        if (error.response.status === 404) {
            notificationParam.message = 'Not Found';
        }

        if (error.response.status === 500) {
            notificationParam.message = 'Internal Server Error';
        }

        if (error.response.status === 508) {
            notificationParam.message = 'Time Out';
        }

        // notification.error(notificationParam);

        return Promise.reject(error);
    },
);

export default uploadService;
