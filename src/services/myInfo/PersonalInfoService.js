import ApiService from '../../auth/FetchInterceptor';

let PersonalInfoService = {};

PersonalInfoService.get_personal_info = async (userId) => {
    const response = await ApiService.get(`/personal/personal_profile/profile/${userId}`);
    return response.data;
};

PersonalInfoService.create_biographic_info = async (body) => {
    const response = await ApiService.post('/personal/biographic_info/', body);
    return response.data;
};

PersonalInfoService.update_biographic_info = async (userId, body) => {
    const response = await ApiService.put(`/personal/biographic_info/${userId}/`, body);
    return response.data;
};

PersonalInfoService.create_passport_info = async (body) => {
    const response = await ApiService.post('/personal/passport/', body);
    return response.data;
};

PersonalInfoService.update_passport_info = async (userId, body) => {
    const response = await ApiService.put(`/personal/passport/${userId}/`, body);
    return response.data;
};

PersonalInfoService.create_identification_card = async (body) => {
    const response = await ApiService.post('/personal/identification_card/', body);
    return response.data;
};

PersonalInfoService.update_identification_card = async (userId, body) => {
    const response = await ApiService.put(`/personal/identification_card/${userId}/`, body);
    return response.data;
};

PersonalInfoService.create_sport_degrees = async (body) => {
    const response = await ApiService.post('/personal/sport_degree/', body);
    return response.data;
};

PersonalInfoService.update_document_driving_license = async (body, itemId) => {
    const response = await ApiService.put(
        `/personal/driving_license/${itemId}/document_link/`,
        body,
    );
    return response.data;
};

PersonalInfoService.create_driving_license = async (body) => {
    const response = await ApiService.post('/personal/driving_license/', body);
    return response.data;
};

PersonalInfoService.update_driving_license = async (userId, body) => {
    const response = await ApiService.put(`/personal/driving_license/${userId}/`, body);
    return response.data;
};

PersonalInfoService.create_sport_achievements = async (body) => {
    const response = await ApiService.post('/personal/sport_achievement', body);
    return response.data;
};

PersonalInfoService.update_sport_degree = async (body, itemId) => {
    const response = await ApiService.put(`/personal/sport_degree/${itemId}`, body);
    return response.data;
};

PersonalInfoService.delete_sport_degree = async (itemId) => {
    const response = await ApiService.delete(`/personal/sport_degree/${itemId}`);
    return response.data;
};

PersonalInfoService.update_sport_achievement = async (body, itemId) => {
    const response = await ApiService.put(`/personal/sport_achievement/${itemId}`, body);
    return response.data;
};

PersonalInfoService.delete_sport_achievement = async (itemId) => {
    const response = await ApiService.delete(`/personal/sport_achievement/${itemId}`);
    return response.data;
};

PersonalInfoService.get_name_change_history = async (userId) => {
    const response = await ApiService.get(`/history/name_change/user/${userId}`);
    return response.data;
};

PersonalInfoService.post_name_change_history = async (body) => {
    const response = await ApiService.post('/history/name_change', body);
    return response.data;
};

PersonalInfoService.get_family_statuses = async () => {
    const response = await ApiService.get('/personal/family_status');
    return response.data;
};

PersonalInfoService.update_financial_info = async (infoId, body) => {
    const response = await ApiService.put(`/personal/user_financial_info/${infoId}/`, body);
    return response.data;
};

PersonalInfoService.delete_name_change_history = async (itemId) => {
    const response = await ApiService.delete(`/history/name_change/${itemId}/`);
    return response.data;
};

PersonalInfoService.update_name_change_history  = async (body, itemId) => {
    const response = await ApiService.put(`/history/name_change/${itemId}`, body);
    return response.data;
};

PersonalInfoService.post_financial_info = async (body) => {
    const response = await ApiService.post(`/personal/user_financial_info`, body);
    return response.data;
};

export default PersonalInfoService;
