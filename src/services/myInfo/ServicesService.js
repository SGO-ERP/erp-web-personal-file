import ApiService from "../../auth/FetchInterceptor";

const ServicesService = {};

ServicesService.getCoolnessHistory = async (userId) => {
    const response = await ApiService.get(`/histories/all/type/coolness_history/${userId}`);
    return response.data;
};

ServicesService.get_contracts_type = async () => {
    const response = await ApiService.get("/contracts/types");
    return response.data;
};

ServicesService.getBlackBeretHistory = async (userId) => {
    const response = await ApiService.get(`/histories/all/type/beret_history/${userId}`);
    return response.data;
};

ServicesService.get_services = async (userId) => {
    const response = await ApiService.get(`/histories/user/${userId}`);
    return response.data;
};
ServicesService.get_awards = async () => {
    const response = await ApiService.get("/badges");
    return response.data;
};

ServicesService.get_users = async () => {
    const response = await ApiService.get("/users");
    return response.data;
};

ServicesService.get_ranks = async () => {
    const response = await ApiService.get("/ranks");
    return response.data;
};

ServicesService.get_rank_id = async (id) => {
    const response = await ApiService.get(`/ranks/${id}`);
    return response.data;
};

ServicesService.get_rank_name = async (search) => {
    const response = await ApiService.get(`/ranks/by-name/?filter=${search}`);
    return response.data;
};

ServicesService.get_staff_divisions = async () => {
    const response = await ApiService.get("/staff_division");
    return response.data;
};

ServicesService.createBadges = async (data) => {
    const response = await ApiService.post("/histories/badge", data);
    return response.data;
};

ServicesService.createHistory = async (data) => {
    const response = await ApiService.post("/histories", data);
    return response.data;
};

ServicesService.createHistoryContracts = async (data) => {
    const response = await ApiService.post("/histories/contract", data);
    return response.data;
};

ServicesService.createHistorySecondment = async (data) => {
    const response = await ApiService.post("/histories/secondement", data);
    return response.data;
};

ServicesService.createHistoryBadge = async (data) => {
    const response = await ApiService.post("/histories/bagde", data);
    return response.data;
};

ServicesService.createHistoryPenalty = async (data) => {
    const response = await ApiService.post("/histories/penalty", data);
    return response.data;
};

ServicesService.createHistoryHoliday = async (data) => {
    const response = await ApiService.post("/histories/status", data);
    return response.data;
};

ServicesService.create_recommendation_and_researcher = async (data) => {
    const response = await ApiService.post("/recommender_users", data);
    return response.data;
};

ServicesService.update_recommendation_and_researcher = async (data, itemId) => {
    const response = await ApiService.put(`/recommender_users/${itemId}/`, data);
    return response.data;
};

ServicesService.updateContracts = async (data, itemId) => {
    const response = await ApiService.put(`/contracts/${itemId}/`, data);
    return response.data;
};

ServicesService.updateBadges = async (data, itemId) => {
    const response = await ApiService.put(`/histories/badge/${itemId}`, data);
    return response.data;
};

ServicesService.updatePenalties = async (data, itemId) => {
    const response = await ApiService.put(`/penalty/${itemId}`, data);
    return response.data;
};

ServicesService.updateStatus = async (data, itemId) => {
    const response = await ApiService.put(`/histories/status/${itemId}`, data);
    return response.data;
};

ServicesService.updateHistories = async (data, itemId) => {
    const response = await ApiService.put(`/histories/${itemId}/`, data);
    return response.data;
};

ServicesService.deleteHistories = async (itemId) => {
    const response = await ApiService.delete(`/histories/${itemId}/`);
    return response.data;
};

ServicesService.delete_black_beret = async (itemId) => {
    const response = await ApiService.delete(`/histories/black_beret/${itemId}/`);
    return response.data;
};

ServicesService.get_clothing_equipments = async () => {
    const response = await ApiService.get("/equipments/type/clothing");
    return response.data;
};

ServicesService.get_army_equipments = async () => {
    const response = await ApiService.get("/equipments/type/army");
    return response.data;
};

ServicesService.get_all_available = async (userId) => {
    const response = await ApiService.get(`/equipmentsavailable/${userId}`);
    return response.data;
};

ServicesService.get_military_units = async () => {
    const response = await ApiService.get("/military_units");
    return response.data;
};

ServicesService.create_military_units = async (body) => {
    const response = await ApiService.post("/military_units", body);
    return response.data;
};

ServicesService.get_other_equipments = async () => {
    const response = await ApiService.get("/equipments/type/other");
    return response.data;
};

ServicesService.create_equipment = async (body) => {
    const response = await ApiService.post("/equipments", body);
    return response.data;
};

ServicesService.update_equipment = async (body, itemId) => {
    const response = await ApiService.put(`/equipments/${itemId}`, body);
    return response.data;
};

ServicesService.create_oath = async (body) => {
    const response = await ApiService.post("/user_oaths/", body);
    return response.data;
};

ServicesService.update_oath = async (body, itemId) => {
    const response = await ApiService.put(`/user_oaths/${itemId}`, body);
    return response.data;
};

ServicesService.create_secret = async (body) => {
    const response = await ApiService.post("/privelege_emergencies/", body);
    return response.data;
};

ServicesService.update_secret = async (body, itemId) => {
    const response = await ApiService.put(`/privelege_emergencies/${itemId}`, body);
    return response.data;
};

ServicesService.create_reserve = async (body) => {
    const response = await ApiService.post("/personnal_reserve/", body);
    return response.data;
};

ServicesService.update_reserve = async (body, itemId) => {
    const response = await ApiService.put(`/personnal_reserve/${itemId}`, body);
    return response.data;
};

ServicesService.delete_reserve = async (itemId) => {
    const response = await ApiService.delete(`/personnal_reserve/${itemId}`);
    return response.data;
};

ServicesService.create_serviceId = async (body) => {
    const response = await ApiService.post("/service_id", body);
    return response.data;
};

ServicesService.update_serviceId = async (body, itemId) => {
    const response = await ApiService.put(`/service_id/${itemId}`, body);
    return response.data;
};

ServicesService.delete_serviceId = async (itemId) => {
    const response = await ApiService.delete(`/service_id/${itemId}`);
    return response.data;
};

ServicesService.create_penalty = async (body) => {
    const response = await ApiService.post("/penalty_types", body);
    return response.data;
};

ServicesService.create_status_leave_type = async (body) => {
    const response = await ApiService.post("/status_types", body);
    return response.data;
};
ServicesService.get_status_leave_type_id = async (id) => {
    const response = await ApiService.get(`/status_types/${id}`);
    return response.data;
};

ServicesService.create_attestation = async (body) => {
    const response = await ApiService.post("/histories/attestation", body);
    return response.data;
};

ServicesService.updateSecondment = async (data, itemId) => {
    const response = await ApiService.put(`/histories/secondment/${itemId}/`, data);
    return response.data;
};

ServicesService.delete_equipment = async (itemId) => {
    const response = await ApiService.delete(`/equipments/${itemId}/`);
    return response.data;
};

ServicesService.create_coolness = async (body) => {
    const response = await ApiService.post("/histories/coolness", body);
    return response.data;
};

ServicesService.update_coolness = async (body, id) => {
    const response = await ApiService.put(`/coolness/${id}`, body);
    return response.data;
};

ServicesService.delete_coolness = async (id) => {
    const response = await ApiService.delete(`/coolness/${id}`);
    return response.data;
};

ServicesService.create_badge = async (body) => {
    const response = await ApiService.post("/histories/black_beret", body);
    return response.data;
};

ServicesService.get_badge_types_id = async (id) => {
    const response = await ApiService.get(`/badge_types/${id}/`);
    return response.data;
};

ServicesService.get_badge = async () => {
    const response = await ApiService.get(`/badge_types}`);
    return response.data;
};

ServicesService.create_type_army = async (body) => {
    const response = await ApiService.post("/equipments/type/army/", body);
    return response.data;
};

ServicesService.create_type_other = async (body) => {
    const response = await ApiService.post("/equipments/type/other/", body);
    return response.data;
};

ServicesService.create_type_clothing = async (body) => {
    const response = await ApiService.post("/equipments/type/clothing/", body);
    return response.data;
};

ServicesService.create_modal_army = async (body) => {
    const response = await ApiService.post("/equipments/model/army/", body);
    return response.data;
};

ServicesService.create_modal_other = async (body) => {
    const response = await ApiService.post("/equipments/model/other/", body);
    return response.data;
};

ServicesService.create_modal_clothing = async (body) => {
    const response = await ApiService.post("/equipments/model/clothing/", body);
    return response.data;
};
ServicesService.get_modal = async () => {
    const response = await ApiService.get("/equipments/model/clothing/");
    return response.data;
};
export default ServicesService;
