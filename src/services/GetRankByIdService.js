import ApiService from '../auth/FetchInterceptor';

const UserRankById = {};

UserRankById.get_user_rankById = async function (id) {
    try {
        const response = await ApiService.get(`/user/${id}/`);

        return response.data;
    } catch (e) {
        console.error(e);
    }
};

UserRankById.get_user_positionId = async function (id) {
    try {
        const response = await ApiService.get(`/histories/${id}/`);

        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export default UserRankById;
