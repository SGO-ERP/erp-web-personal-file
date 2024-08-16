import ApiService from "../auth/FetchInterceptor";

const BadgesService = {};

BadgesService.get_badges = async function () {
    try {
        const response = await ApiService.get("/badges");

        return response.data;
    } catch (e) {
        console.error(e);
    }
};

BadgesService.get_badge_types = async function () {
    const response = await ApiService.get("/badge_types");
    return response.data;
};

BadgesService.update_badge_id = async function (id, data) {
    await ApiService.put(`/histories/badge/${id}`, data);
};

export default BadgesService;
