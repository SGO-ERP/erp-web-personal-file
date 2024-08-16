import ApiService from '../../auth/FetchInterceptor';

let HRVacancyService = {};

HRVacancyService.getByDepartmentId = async function (id) {
    try {
        const response = await ApiService.get(`/hr_vacancies/department/${id}`);
        return response.data;
    } catch (e) {
        console.log(e);
    }
};

HRVacancyService.getCandidatesOfVacancy = async function (id) {
    try {
        const response = await ApiService.get(`/hr_vacancies/${id}/candidates`);
        return response.data;
    } catch (e) {
        console.log(e);
    }
};

HRVacancyService.getStaffDivisionDepartments = async function (skip, limit) {
    try {
        const response = await ApiService.get(
            `/staff_division/departments/?skip=${skip}&limit=${limit}`,
        );
        return response.data;
    } catch (e) {
        console.log(e);
    }
};

HRVacancyService.respond = async function (id) {
    const response = await ApiService.post(`/hr_vacancies/${id}/respond`);
    return response.data;
};

export default HRVacancyService;
