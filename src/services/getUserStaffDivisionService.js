import ApiService from '../auth/FetchInterceptor';

const UserStaffDivision = {};

UserStaffDivision.get_user_staff_division = async function (staffId) {
    try {
        const response = await ApiService.get(`/staff_division/${staffId}/`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export default UserStaffDivision;
