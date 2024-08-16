import ApiService from "../../auth/FetchInterceptor";

let AdditionalService = {};

AdditionalService.get_additional = async (userId) => {
    const response = await ApiService.get(`/additional/additional-profile/profile/${userId}`);
    return response.data;
};

AdditionalService.get_psychological = async () => {
    const response = await ApiService.get("/additional/psychological-check");
    return response.data;
};

AdditionalService.deletePsychologicalCheck = async (id) => {
    const response = await ApiService.delete(`/additional/psychological-check/${id}`);
    return response.data;
};
AdditionalService.deletePolygraphCheck = async (id) => {
    const response = await ApiService.delete(`/additional/polygraph-check/${id}`);
    return response.data;
};

AdditionalService.get_polygraph = async () => {
    const response = await ApiService.get("/additional/polygraph-check");
    return response.data;
};

AdditionalService.createVehicle = async (data) => {
    const response = await ApiService.post("/additional/vehicle", data);
    return response.data;
};

AdditionalService.updateVehicle = async (data, itemId) => {
    const response = await ApiService.put(`/additional/vehicle/${itemId}`, data);
    return response.data;
};

AdditionalService.updateSpecialCheck = async (data, itemId) => {
    const response = await ApiService.put(`/additional/special-check/${itemId}`, data);
    return response.data;
};

AdditionalService.updateAbroadTravel = async (data, itemId) => {
    const response = await ApiService.put(`/additional/abroad-travel/${itemId}`, data);
    return response.data;
};

AdditionalService.deleteAbroadTravel = async (id) => {
    const response = await ApiService.delete(`/additional/abroad-travel/${id}`);
    return response.data;
};

AdditionalService.deleteSpecialCheck = async (id) => {
    const response = await ApiService.delete(`/additional/special-check/${id}`);
    return response.data;
};
AdditionalService.deleteProperty = async (id) => {
    const response = await ApiService.delete(`/additional/properties/${id}`);
    return response.data;
};

AdditionalService.updateProperties = async (data, itemId) => {
    const response = await ApiService.put(`/additional/properties/${itemId}`, data);
    return response.data;
};

AdditionalService.createPolygraphCheck = async (data) => {
    const response = await ApiService.post("/additional/polygraph-check", data);
    return response.data;
};

AdditionalService.updatePolygraphCheck = async (data, itemId) => {
    const response = await ApiService.put(`/additional/polygraph-check/${itemId}`, data);
    return response.data;
};

AdditionalService.updatePsychologicalCheck = async (data, id) => {
    const response = await ApiService.put(`/additional/psychological-check/${id}`, data);
    return response.data;
};

AdditionalService.createPsychologicalCheck = async (data) => {
    const response = await ApiService.post("/additional/psychological-check", data);
    return response.data;
};

AdditionalService.createViolation = async (data) => {
    const response = await ApiService.post("/additional/violation", data);
    return response.data;
};

AdditionalService.updateViolation = async (data, id) => {
    const response = await ApiService.put(`/additional/violation/${id}`, data);
    return response.data;
};

AdditionalService.createAbroadTravel = async (data) => {
    const response = await ApiService.post("/additional/abroad-travel", data);
    return response.data;
};

AdditionalService.createSpecialChecks = async (data) => {
    const response = await ApiService.post("/additional/special-check", data);
    return response.data;
};

AdditionalService.createProperty = async (data) => {
    const response = await ApiService.post("/additional/properties", data);
    return response.data;
};

AdditionalService.createServiceHousing = async (data) => {
    const response = await ApiService.post("/additional/service-housings", data);
    return response.data;
};

AdditionalService.updateServiceHousing = async (data, id) => {
    const response = await ApiService.put(`/additional/service-housings/${id}/`, data);
    return response.data;
};

AdditionalService.deleteViolation = async (id) => {
    const response = await ApiService.delete(`/additional/violation/${id}`);
    return response.data;
};

AdditionalService.deleteServiceHousing = async (id) => {
    const response = await ApiService.delete(`/additional/service-housings/${id}`);
    return response.data;
};

AdditionalService.deleteVehicle = async (id) => {
    const response = await ApiService.delete(`/additional/vehicle/${id}`);
    return response.data;
};

AdditionalService.create_property_type = async (body) => {
    const response = await ApiService.post("/additional/property_types", body);
    return response.data;
};

AdditionalService.create_vehicle_types = async (body) => {
    const response = await ApiService.post("/additional/vehicle_type", body);
    return response.data;
};

AdditionalService.create_country = async (body) => {
    const response = await ApiService.post("/additional/country", body);
    return response.data;
};
AdditionalService.get_vehicle_type_id = async (id) => {
    const response = await ApiService.get(`/additional/vehicle_type/${id}`);
    return response.data;
}

AdditionalService.get_country_id = async (id) => {
    const response = await ApiService.get(`/additional/country/${id}/`);
    return response.data;
}

AdditionalService.get_property_type_id = async (id) => {
    const response = await ApiService.get(`/additional/property_types/${id}/`);
    return response.data;
}

export default AdditionalService;
