import { AUTH_TOKEN } from 'constants/AuthConstant';
import ApiService from '../auth/FetchInterceptor';

const NotificationService = {};

NotificationService.getNotifications = async function ({ skip, limit }) {
    try {
        const response = await ApiService.get('/notifications?skip=0&limit=5', {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

NotificationService.get_notifications_details = async function ({ skip, limit }) {
    try {
        const response = await ApiService.get(
            `/notifications/detailed?skip=${skip}&limit=${limit}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
                },
            },
        );

        return response.data;
    } catch (e) {
        console.log(e);
    }
};

NotificationService.get_notifications_info = async function ({ skip, limit }) {
    try {
        const response = await ApiService.get(`/notifications?skip=${skip}&limit=${limit}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
            },
        });

        return response.data;
    } catch (e) {
        console.log(e);
    }
};

NotificationService.delete_notifications_info = async function (id) {
    try {
        const response = await ApiService.delete(`/notifications/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
            },
        });

        return response.data;
    } catch (e) {
        console.log(e);
    }
};

export default NotificationService;
