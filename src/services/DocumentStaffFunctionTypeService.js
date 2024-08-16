import ApiService from '../auth/FetchInterceptor';
import { AUTH_TOKEN } from '../constants/AuthConstant';

let DocumentStaffFunctionTypeService = {};

DocumentStaffFunctionTypeService.get_document_staff_type = async function () {
    try {
        const response = await ApiService.get('/document_function_type?skip=0&limit=10', {
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

DocumentStaffFunctionTypeService.post_document_staff_constructor = async function (data) {
    try {
        const response = await ApiService.post(
            '/document_staff_function/constructor/',
            {
                name: data.name,
                hours_per_week: data.hours_per_week,
                priority: data.priority,
                role_id: data.role_id,
                jurisdiction_id: data.jurisdiction_id,
                hr_document_template_id: data.hr_doc_id,
                staff_unit_id: data.staff_unit_id,
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

DocumentStaffFunctionTypeService.post_document_staff_function = async function (data) {
    try {
        const response = await ApiService.post(
            '/document_staff_function/',
            {
                name: data.name,
                hours_per_week: data.hours_per_week,
                priority: data.priority,
                role_id: data.role_id,
                jurisdiction_id: data.jurisdiction_id,
                hr_document_template_id: data.hr_doc_id,
                staff_unit_id: data.staff_unit_id,
                is_direct_supervisor: data.is_direct_supervisor,
                category: data.category,
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

DocumentStaffFunctionTypeService.add_document_staff_function = (position, staff_function_ids) => {
    try {
        return ApiService.post('/staff_unit/add-document-staff-function/position', {
            position,
            staff_function_ids,
        });
    } catch (e) {
        console.error(e);
    }
};

export default DocumentStaffFunctionTypeService;
