import ApiService from '../auth/FetchInterceptor';
import { AUTH_TOKEN } from '../constants/AuthConstant';

let IpService = {};

IpService.get_ip = async function () {
    const response = await ApiService.get('/ip', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
        },
    });
    return response.data;
};

export default IpService;
