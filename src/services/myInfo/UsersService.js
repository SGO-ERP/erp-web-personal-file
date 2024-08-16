import ApiService from '../../auth/FetchInterceptor';

let UsersService = {};

UsersService.get_user_by_id = async function (userId) {
    try {
        const response = await ApiService.get(`/users/${userId}`);
        const data = response.data;
        return data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

UsersService.get_personal_info = async (userId) => {
    const response = await ApiService.get(`/personal/personal_profile/profile/${userId}`);
    return response.data;
};

UsersService.get_family_status = async (userId) => {
    const response = await ApiService.get(`/personal/family_status/user/${userId}`);
    return response.data;
};

UsersService.get_userStats_by_id = async (userId) => {
    const response = await ApiService.get(`/user-stats/${userId}/`);
    return response.data;
};

UsersService.update_user_by_id = async (userId, body) => {
    const response = await ApiService.patch(`/users/${userId}/`, body);
    return response.data;
};

UsersService.checkUserHasDocument = async (userId, documentId) => {
    console.log('userId: ', userId);
    const response = await ApiService.get(
        `/users/${userId}/templates?hr_document_template_id=${documentId}`,
    );
    return response.data;
};

UsersService.get_filter_users = async ({ filter, skip, limit }) => {
    const response = await ApiService.get(`/users?filter=${filter}&skip=${skip}&limit=${limit}`);
    return response.data;
};

export default UsersService;
