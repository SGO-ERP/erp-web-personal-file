import ApiService from '../auth/FetchInterceptor';
import { AUTH_TOKEN } from '../constants/AuthConstant';

const GroupsService = {};

GroupsService.get_by_id = async function (id) {
    try {
        const response = await ApiService.get(`/staff_division/${id}/`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
            },
        });
        return response.data;
    } catch (e) {
        console.error(e);
    }
};
export default GroupsService;
