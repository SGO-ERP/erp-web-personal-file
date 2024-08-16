import ApiService from '../auth/FetchInterceptor';
import { AUTH_TOKEN } from '../constants/AuthConstant';

let DocumentStaffFunctionService = {};

DocumentStaffFunctionService.get_document_staff = async function () {
    try {
        const response = await ApiService.get('/document_staff_function?skip=0&limit=10', {
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

DocumentStaffFunctionService.post_document_staff = async function (data) {
    try {
        const response = await ApiService.post(
            '/document_staff_function',
            {
                name: 'name',
                hours_per_week: data.hours_per_week,
                priority: data.priority,
                role_id: data.role_id,
                jurisdiction_id: data.jurisdiction_id,
                hr_document_template_id: data.hr_document_template_id,
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

DocumentStaffFunctionService.delete_document_staff = async function (id) {
    try {
        const response = await ApiService.delete(`/document_staff_function/${id}`, {
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

DocumentStaffFunctionService.post_document_staff_duplicate = async function (id) {
    try {
        const response = await ApiService.post(`/document_staff_function/duplicate/${id}`, {
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

export default DocumentStaffFunctionService;
