import ApiService from "../../auth/FetchInterceptor";

let SportTypeService = {};

SportTypeService.get_document_staff_type = async function () {
    try {
        const response = await ApiService.get("/personal/sport_type");
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

SportTypeService.get_document_staff_type_id = async function (id) {
    try {
        const response = await ApiService.get(`/personal/sport_type/${id}`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

SportTypeService.create_document_staff_type = async function (params) {
    try {
        const response = await ApiService.post("/personal/sport_type", params);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

SportTypeService.get_sport_degree_type = async function () {
    try {
        const response = await ApiService.get("/personal/sport_degree_type");
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

SportTypeService.get_sport_degree_type_id = async function (id) {
    try {
        const response = await ApiService.get(`/personal/sport_degree_type/${id}`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

SportTypeService.create_sport_degree_type = async function (params) {
    try {
        const response = await ApiService.post("/personal/sport_degree_type", params);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export default SportTypeService;
