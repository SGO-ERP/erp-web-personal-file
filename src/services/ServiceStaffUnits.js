import ApiService from "../auth/FetchInterceptor";

const ServiceStaffUnits = {};

ServiceStaffUnits.staff_units_id = async function (id) {
    try {
        const response = await ApiService.get(`/staff_unit/${id}/`);

        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export default ServiceStaffUnits;
