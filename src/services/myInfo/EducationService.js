import ApiService from "../../auth/FetchInterceptor";

// THIS IS MOCK SERVICE. API ROUTES ARE NOT REAL
const baseLimit = 10000;
let EducationService = {};

EducationService.get_education = async (userId) => {
    const response = await ApiService.get(`/education/educational_profiles/profile/${userId}`);
    return response.data;
};
EducationService.get_institution_degree_types = async () => {
    const response = await ApiService.get(
        `/education/institution_degree_types?skip=0&limit=${baseLimit}`,
    );
    return response.data;
};
EducationService.get_institution_degree_types_id = async (id) => {
    const response = await ApiService.get(`/education/institution_degree_types/${id}`);
    return response.data;
};
EducationService.create_institution_degree_types = async (body) => {
    const response = await ApiService.post("/education/institution_degree_types", body);
    return response.data;
};
EducationService.get_academic_degree_types = async () => {
    const response = await ApiService.get("/education/academic_degree_degrees");
    return response.data;
};
EducationService.get_academic_degree_types_id = async (id) => {
    const response = await ApiService.get(`/education/academic_degree_degrees/${id}`);
    return response.data;
};
EducationService.create_academic_degree_types = async (body) => {
    const response = await ApiService.post("/education/academic_degree_degrees", body);
    return response.data;
};
EducationService.get_specialties = async () => {
    const response = await ApiService.get(`/education/specialties?skip=0&limit=${baseLimit}`);
    return response.data;
};
EducationService.get_specialties_id = async (id) => {
    const response = await ApiService.get(`/education/specialties/${id}`);
    return response.data;
};
EducationService.create_specialties = async (body) => {
    const response = await ApiService.post("/education/specialties", body);
    return response.data;
};
EducationService.get_language = async () => {
    const response = await ApiService.get("/education/languages");
    return response.data;
};
EducationService.get_language_id = async (id) => {
    const response = await ApiService.get(`/education/languages/${id}`);
    return response.data;
};
EducationService.create_language = async (body) => {
    const response = await ApiService.post("/education/languages", body);
    return response.data;
};
EducationService.get_sciences = async () => {
    const response = await ApiService.get("/education/sciences");
    return response.data;
};
EducationService.get_sciences_id = async (id) => {
    const response = await ApiService.get(`/education/sciences/${id}`);
    return response.data;
};
EducationService.create_sciences = async (body) => {
    const response = await ApiService.post("/education/sciences", body);
    return response.data;
};
EducationService.get_institutions = async () => {
    const response = await ApiService.get(`/education/institutions?skip=0&limit=${baseLimit}`);
    return response.data;
};
EducationService.get_institutions_military = async () => {
    const response = await ApiService.get(
        `/education/military_institution?skip=0&limit=${baseLimit}`,
    );
    return response.data;
};
EducationService.get_institutions_id = async (id) => {
    const response = await ApiService.get(`/education/institutions/${id}`);
    return response.data;
};
EducationService.get_course_provider = async () => {
    const response = await ApiService.get(`/education/course_providers?skip=0&limit=${baseLimit}`);
    return response.data;
};
EducationService.get_course_provider_id = async (id) => {
    const response = await ApiService.get(`/education/course_providers/${id}`);
    return response.data;
};
EducationService.create_course_provider = async (body) => {
    const response = await ApiService.post("/education/course_providers", body);
    return response.data;
};
EducationService.get_academic_title_degree = async () => {
    const response = await ApiService.get("/education/academic_title_degrees");
    return response.data;
};
EducationService.get_academic_title_degree_id = async (id) => {
    const response = await ApiService.get(`/education/academic_title_degrees/${id}`);
    return response.data;
};
EducationService.create_academic_title_degree = async (body) => {
    const response = await ApiService.post("/education/academic_title_degrees", body);
    return response.data;
};

EducationService.post_add_education = async (body) => {
    const response = await ApiService.post("/education/educations", body);
    return response.data;
};

EducationService.delete_add_education = async (id) => {
    const response = await ApiService.delete(`/education/educations/${id}`);
    return response.data;
};

EducationService.post_add_institution = async (body) => {
    const response = await ApiService.post("/education/institutions", body);
    return response.data;
};

EducationService.post_add_institution_military = async (body) => {
    const response = await ApiService.post("/education/military_institution", body);
    return response.data;
};

EducationService.update_education = async (body, id) => {
    const response = await ApiService.put(`/education/educations/${id}`, body);
    return response.data;
};

EducationService.post_add_course = async (body) => {
    const response = await ApiService.post("/education/courses", body);
    return response.data;
};

EducationService.update_course = async (body, id) => {
    const response = await ApiService.put(`/education/courses/${id}`, body);
    return response.data;
};

EducationService.delete_add_course = async (id) => {
    const response = await ApiService.delete(`/education/courses/${id}`);
    return response.data;
};

EducationService.post_add_language = async (body) => {
    const response = await ApiService.post("/education/language_proficiencies", body);
    return response.data;
};

EducationService.update_language = async (body, id) => {
    const response = await ApiService.put(`/education/language_proficiencies/${id}`, body);
    return response.data;
};

EducationService.delete_add_language = async (id) => {
    const response = await ApiService.delete(`/education/language_proficiencies/${id}`);
    return response.data;
};

EducationService.post_add_academic_degrees = async (body) => {
    const response = await ApiService.post("/education/academic_degrees", body);
    return response.data;
};

EducationService.update_academic_degree = async (body, id) => {
    const response = await ApiService.put(`/education/academic_degrees/${id}`, body);
    return response.data;
};

EducationService.delete_academic_degree = async (id) => {
    const response = await ApiService.delete(`/education/academic_degrees/${id}`);
    return response.data;
};

EducationService.post_add_academic_title = async (body) => {
    const response = await ApiService.post("/education/academic_titles", body);
    return response.data;
};

EducationService.update_academic_title = async (body, id) => {
    const response = await ApiService.put(`/education/academic_titles/${id}`, body);
    return response.data;
};
EducationService.delete_academic_title = async (id) => {
    const response = await ApiService.delete(`/education/academic_titles/${id}`);
    return response.data;
};

export default EducationService;
