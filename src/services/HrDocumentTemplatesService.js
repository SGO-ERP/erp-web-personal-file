import ApiService from "../auth/FetchInterceptor";

const HrDocumentTemplatesService = {};

HrDocumentTemplatesService.hr_template = async function () {
    try {
        const response = await ApiService.get("/hr-documents-template?skip=0&limit=10");

        return response.data;
    } catch (e) {
        console.error(e);
    }
};
HrDocumentTemplatesService.get_hr_documents_template = async function () {
    try {
        const response = await ApiService.get("hr-documents-template/");

        return response.data;
    } catch (e) {
        console.error(e);
    }
};

HrDocumentTemplatesService.get_hr_documents_template_by_id = async function (templateId) {
    try {
        const response = await ApiService.get(`hr-documents-template/${templateId}/`);

        return response.data;
    } catch (e) {
        console.error(e);
    }
};

HrDocumentTemplatesService.delete_hr_documents_template_by_id = async function (templateId) {
    try {
        const response = await ApiService.delete(`hr-documents-template/${templateId}/`);

        return response.data;
    } catch (e) {
        console.error(e);
    }
};

HrDocumentTemplatesService.get_hr_documents_template_by_user_id = async function (userId) {
    try {
        const response = await ApiService.get(`users/templates/${userId}?skip=0&limit=100`);

        return response.data;
    } catch (e) {
        console.error(e);
    }
};

HrDocumentTemplatesService.hr_template_steps_user = async function (id, userId) {
    try {
        const response = await ApiService.get(
            `/hr-documents-template/steps/${id}?user_id=${userId}`,
        );

        return response.data;
    } catch (e) {
        console.error(e);
    }
};

HrDocumentTemplatesService.hr_template_steps = async function (id) {
    try {
        const response = await ApiService.get(`hr-documents-step?id=${id}`);

        return response.data;
    } catch (e) {
        console.error(e);
    }
};

HrDocumentTemplatesService.hr_template_duplicate = async function (id) {
    try {
        const response = await ApiService.get(`/hr-documents-template/duplicate/${id}`);

        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

HrDocumentTemplatesService.post_hr_template = async function (template) {
    try {
        const response = await ApiService.post("/hr-documents-template/", template);
        return response.data;
    } catch (e) {
        console.error(e);
        throw Error(e);
    }
};

HrDocumentTemplatesService.update_hr_template = async function (id, template) {
    try {
        const response = await ApiService.put(`/hr-documents-template/${id}`, template);
        return response.data;
    } catch (e) {
        console.error(e);
        throw Error(e);
    }
};

HrDocumentTemplatesService.draft_hr_template_put = async function (id, template) {
    try {
        const response = await ApiService.put(`/hr-documents-template/draft/${id}`, template);
        return response.data;
    } catch (e) {
        console.error(e);
        throw Error(e);
    }
};

HrDocumentTemplatesService.draft_hr_template_post = async function (template) {
    try {
        const response = await ApiService.post("/hr-documents-template/draft", template);
        return response.data;
    } catch (e) {
        console.error(e);
        throw Error(e);
    }
};

HrDocumentTemplatesService.hr_document_template_post = async function ({
    name,
    nameKZ,
    path,
    pathKZ,
    subject_type,
    properties,
    actions,
}) {
    try {
        const response = await ApiService.post(
            "/hr-documents/",
            {
                name,
                nameKZ,
                path,
                pathKZ,
                subject_type,
                properties,
                actions,
            },
            {},
        );
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

HrDocumentTemplatesService.get_hr_doc_templates_with_pagination = async function (
    page,
    limit,
    name,
) {
    try {
        const skip = (page - 1) * limit;
        const response = await ApiService.get(
            `/hr-documents-template?skip=${skip}&limit=${limit}&name=${name}`,
        );
        const data = response.data;
        const hasMore = data.length > limit;
        if (hasMore) {
            data.pop(); // Remove the extra item
        }
        return { data, hasMore };
    } catch (e) {
        console.error(e);
    }
};

HrDocumentTemplatesService.get_hr_doc_templates_by_name = async function (name) {
    const response = await ApiService.get(`/hr-documents-template?name=${name}`);
    return response.data;
};

HrDocumentTemplatesService.get_hr_doc_templates_archive_with_pagination = async function (
    page,
    limit,
    name,
) {
    try {
        const skip = (page - 1) * limit;
        const response = await ApiService.get(
            `/hr-documents-template/archive?skip=${skip}&limit=${limit}&name=${name}`,
        );
        const data = response.data;
        const hasMore = data.length > limit;
        if (hasMore) {
            data.pop(); // Remove the extra item
        }
        return { data, hasMore };
    } catch (e) {
        console.error(e);
    }
};

HrDocumentTemplatesService.get_hr_doc_templates_draft_with_pagination = async function (
    page,
    limit,
    name,
) {
    try {
        const skip = (page - 1) * limit;
        const response = await ApiService.get(
            `/hr-documents-template/draft?skip=${skip}&limit=${limit + 1}&name=${name}`,
        );
        const data = response.data;
        const hasMore = data.length > limit;
        if (hasMore) {
            data.pop(); // Remove the extra item
        }
        return { data, hasMore };
    } catch (e) {
        console.error(e);
    }
};

export default HrDocumentTemplatesService;
