import ApiService from '../auth/FetchInterceptor';
import { AUTH_TOKEN } from '../constants/AuthConstant';

const StaffDivisionService = {};

StaffDivisionService.post_service_staff_parent = async function (id) {
    try {
        const response = await ApiService.get(`/staff_division/division_parents/${id}`, {
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

StaffDivisionService.get_department = async function (id) {
    try {
        const response = await ApiService.get(`/staff_division/get-department-of/${id}`, {
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

StaffDivisionService.staff_division_name = async function (id) {
    try {
        const response = await ApiService.get(`/staff_division/name/${id}/`);

        return response.data;
    } catch (e) {
        console.error(e);
    }
};

StaffDivisionService.staff_division_ids = async function (id) {
    try {
        const response = await ApiService.get(`/staff_division/ids/${id}/`);

        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export default StaffDivisionService;
