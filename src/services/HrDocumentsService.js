import axios from "axios";
import { parseJwt } from "store/slices/authSlice";
import ApiService from "../auth/FetchInterceptor";
import { AUTH_TOKEN } from "../constants/AuthConstant";
import { getCertificate } from "utils/helpers/certificate";

const HrDocumentService = {};

// HrDocumentService.get_hr_documents_not_signed = async function () {
//     try {
//         const response = await ApiService.get('/hr-documents/not-signed?skip=0&limit=10', {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });
//         return response.data.reverse();
//     } catch (e) {
//         console.error(e);
//     }
// };

HrDocumentService.get_hr_documents_not_signed = async function (page, limit, searchQuery) {
    try {
        const skip = (page - 1) * limit;

        const response = await ApiService.get(
            `/hr-documents/not-signed?skip=${skip}&limit=${limit + 1}${
                !searchQuery ? "" : `&filter=${searchQuery}`
            }`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
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

HrDocumentService.hr_document_post = async function (params) {
    try {
        const response = await ApiService.post(
            "/hr-documents/",
            {
                hr_document_template_id: params.docId,
                status: params.status,
                due_date: params.date?._d,
                properties: params.properties,
                user_ids: [params.userId],
                document_step_users_ids: params.steps,
                initial_comment: params.comment,
                parent_id: null,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
                },
            },
        );
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

HrDocumentService.hr_document_post_ecp = async function (params) {
    try {
        const response = await ApiService.post(
            "/hr-documents/ecp_initialize",
            {
                hr_document_template_id: params.docId,
                status: params.status,
                due_date: params.date?._d,
                properties: params.properties,
                user_ids: [params.userId],
                document_step_users_ids: params.steps,
                initial_comment: params.comment,
                parent_id: null,
                certificate_blob: params.certificate_blob,
                actions: params.actions,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
                },
            },
        );
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

HrDocumentService.hr_document_put = async function (params) {
    try {
        const response = await ApiService.put(
            `/hr-documents/${params.id}`,
            {
                hr_document_template_id: params.docId,
                status_id: params.status,
                due_date: params.date?._d,
                properties: params.properties,
                user_ids: [params.userId],
                document_step_users_ids: params.steps,
                initial_comment: params.comment,
                parent_id: null,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
                },
            },
        );
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

HrDocumentService.hr_document_drafts_post = async function (params) {
    try {
        const response = await ApiService.post(
            "/hr-documents/drafts",
            {
                hr_document_template_id: params.docId,
                status: params.status,
                due_date: params.date?._d,
                properties: params.properties,
                user_ids: [params.userId],
                document_step_users_ids: params.steps,
                initial_comment: params.comment,
                parent_id: null,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
                },
            },
        );
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

HrDocumentService.hr_document_drafts_post_by_id = async function (
    draftId,
    hrDocTempID,
    dueDate,
    userID,
    properties,
) {
    try {
        const response = await ApiService.post(
            `/hr-documents/drafts/${draftId}`,
            {
                hr_document_template_id: hrDocTempID[0],
                due_date: dueDate?._d,
                properties: properties,
                user_ids: [userID[0]],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
                },
            },
        );
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

HrDocumentService.hr_document_post_id = async function (hrDocuments) {
    try {
        const promises = hrDocuments.map((item) => {
            return ApiService.post(
                `/hr-documents/${item.id}/`,
                {
                    comment: item.comment,
                    is_signed: item.is_signed,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
                    },
                },
            );
        });

        const responses = await Promise.all(promises);
        return responses.map((response) => response.data);
    } catch (e) {
        console.error(e);
        throw e;
    }
};

HrDocumentService.hr_document_post_id_and_ecp = async function (hrDocuments) {
    try {
        const promises = hrDocuments.map((item) => {
            return ApiService.post(
                `/hr-documents/ecp_sign/${item.id}/`,
                {
                    comment: item.comment,
                    is_signed: item.is_signed,
                    certificate_blob: getCertificate(),
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
                    },
                },
            );
        });

        const responses = await Promise.all(promises);
        return responses.map((response) => response.data);
    } catch (e) {
        console.error(e);
        throw e;
    }
};

HrDocumentService.multi_hr_document_post_id_and_ecp = async function (hrDocuments) {
    try {
        if (hrDocuments.length === 0) {
            return;
        }

        return await ApiService.post(
            "/hr-documents/ecp_sign_all/",
            {
                comment: hrDocuments[0]?.comment,
                is_signed: hrDocuments[0]?.is_signed,
                certificate_blob: getCertificate(),
                document_ids: hrDocuments.map((item) => item.id),
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
                },
            },
        );
    } catch (e) {
        console.error(e);
        throw e;
    }
};

HrDocumentService.getDropdownItems = async function (arg) {
    try {
        const userId = await parseJwt(localStorage.getItem(AUTH_TOKEN)).sub;

        let path;
        if (arg.option == "badges") {
            path = `/hr-documents/options?option=${arg.option}&data_taken=${arg.dataTaken}&id=${arg.mId}&type=${arg.type}&skip=0&limit=50`;
        } else if (arg.dataTaken == null) {
            path = `/hr-documents/options?option=${arg.option}&type=${arg.type}&skip=0&limit=50`;
        } else if (arg.mId == null && arg.dataTaken !== null) {
            if (arg.dataTaken === "matreshka")
                path = `/hr-documents/options?option=${arg.option}&data_taken=${arg.dataTaken}&type=${arg.type}&skip=0&limit=50`;
            else if (arg.option == "secondments") {
                path = `/hr-documents/options?option=${arg.option}&data_taken=${arg.dataTaken}&type=${arg.type}&skip=0&limit=50`;
            } else {
                path = `/hr-documents/options?option=${arg.option}&data_taken=${arg.dataTaken}&id=${
                    arg.mId ? arg.mId : userId
                }&type=${arg.type}&skip=0&limit=50`;
            }
        } else {
            path = `/hr-documents/options?option=${arg.option}&data_taken=${arg.dataTaken}&id=${arg.mId}&type=${arg.type}&skip=0&limit=50`;
        }

        const response = await ApiService.get(path, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
            },
        });
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

HrDocumentService.get_options = async function (arg) {
    try {
        const response = await ApiService.get(`/hr-documents/options?option=${arg}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
            },
        });
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

HrDocumentService.get_doc = async function (api) {
    try {
        const response = await axios.get(`${api}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
            },
            responseType: "blob",
        });
        return response;
    } catch (e) {
        console.error(e);
    }
};

HrDocumentService.get_signed_history = async function (page, limit, searchQuery) {
    try {
        const skip = (page - 1) * limit;
        const response = await ApiService.get(
            `/hr-documents/initialized?skip=${skip}&limit=${limit + 1}${
                !searchQuery ? "" : `&filter=${searchQuery}`
            }`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
                },
            },
        );

        const data = response.data;
        const hasMore = data.length > limit;
        if (hasMore) {
            data.pop(); // Remove the extra item
        }

        return { data, hasMore };
    } catch (e) {
        console.log("erroe");
        console.error(e);
    }
};

//drafts

HrDocumentService.get_documents_draft = async function (page, limit, searchQuery) {
    try {
        const skip = (page - 1) * limit;
        const response = await ApiService.get(
            `/hr-documents/drafts?skip=${skip}&limit=${limit + 1}${
                !searchQuery ? "" : `&filter=${searchQuery}`
            }`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
                },
            },
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

HrDocumentService.getDocumentById = async function (id) {
    const response = await ApiService.get(`/hr-documents/${id}`);
    return response.data;
};

HrDocumentService.deleteDocumentById = async function (id) {
    const response = await ApiService.delete(`/hr-documents/${id}`);
    return response.data;
};

HrDocumentService.getGenerateDocument = async function (id) {
    const response = await ApiService.get(`/hr-documents/generate/${id}`, {
        responseType: "blob",
    });
    return new File([response.data], id);
};

HrDocumentService.getGeneratedHTMLDocument = async function (id) {
    const response = await ApiService.get(`/hr-documents/generate-html/${id}`, {
        responseType: "blob",
    });
    return response.data;
};

HrDocumentService.getMatreshka = async function () {
    const response = await ApiService.get("/staff_division/schedule");
    return response.data;
};

HrDocumentService.getMatreshkaId = async function (id) {
    const response = await ApiService.get(`/staff_division/schedule/${id}`);
    return response.data;
};

HrDocumentService.getMatreshkaFromDep = async function () {
    const response = await ApiService.get("/staff_division/recursive/department");
    return response.data;
};

HrDocumentService.getMatreshkaFromDepId = async function (id) {
    const response = await ApiService.get(`/staff_division/recursive/department/${id}`);
    return response.data;
};

export default HrDocumentService;
