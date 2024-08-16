import ApiService from '../../auth/FetchInterceptor';

const CoolnessService = {};

CoolnessService.get_statuses = async () => {
    const response = await ApiService.get('/coolness/statuses');
    return response.data;
};

CoolnessService.get_coolness_form = async () => {
    const response = await ApiService.get('/coolness_type');
    return response.data;
};

CoolnessService.create_coolness = async (body) => {
    const response = await ApiService.post('/coolness', body);
    return response.data;
};

CoolnessService.create_coolness_type = async (body) => {
    const response = await ApiService.post('/coolness_type', body);
    return response.data;
};

export default CoolnessService;
