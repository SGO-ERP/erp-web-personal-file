import ApiService from '../auth/FetchInterceptor';
import { AUTH_TOKEN } from '../constants/AuthConstant';

const ServiceStaffFunctionService = {};

ServiceStaffFunctionService.get_service_staff = async function () {
    try {
        const response = await ApiService.get('/service_staff_function?skip=0&limit=10', {
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

ServiceStaffFunctionService.get_staff_unit_id = async function (id) {
    try {
        const response = await ApiService.get(`/document_staff_function/staff_unit/${id}`);

        return response.data;
    } catch (e) {
        console.error(e);
    }
};

ServiceStaffFunctionService.get_service_staff_type = async function () {
    try {
        const response = await ApiService.get('/service_staff_function_type?skip=0&limit=10', {
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

ServiceStaffFunctionService.post_service_staff = async function (data) {
    try {
        const response = await ApiService.post(
            '/service_staff_function',
            {
                name: data.name,
                hours_per_week: data.hours_per_week,
                type_id: data.type_id,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
                },
            },
        );
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

ServiceStaffFunctionService.delete_service_staff = async function (id) {
    try {
        const response = await ApiService.delete(`/service_staff_function/${id}`, {
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

ServiceStaffFunctionService.post_service_staff_duplicate = async function (id) {
    try {
        const response = await ApiService.post(`/service_staff_function/duplicate/${id}`, {
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

export default ServiceStaffFunctionService;
