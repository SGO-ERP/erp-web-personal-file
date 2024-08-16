import ApiService from '../auth/FetchInterceptor';
import { AUTH_TOKEN } from '../constants/AuthConstant';

let ActionsService = {};

ActionsService.get_actions = async function () {
    const response = await ApiService.get('/actions', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
        },
    });
    return response.data;
};

export default ActionsService;
