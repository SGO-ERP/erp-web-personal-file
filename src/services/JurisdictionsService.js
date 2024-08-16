import ApiService from '../auth/FetchInterceptor';
import { AUTH_TOKEN } from '../constants/AuthConstant';

let JurisdictionsService = {};

JurisdictionsService.get_jurisdictions = async function () {
    try {
        const response = await ApiService.get('/jurisdictions?skip=0&limit=100', {
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

export default JurisdictionsService;
