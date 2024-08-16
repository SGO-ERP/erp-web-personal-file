import ApiService from '../auth/FetchInterceptor';
import { AUTH_TOKEN } from '../constants/AuthConstant';

let ServiceStaffFunctionTypeService = {};

ServiceStaffFunctionTypeService.get_service_staff_type = async function () {
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

export default ServiceStaffFunctionTypeService;
