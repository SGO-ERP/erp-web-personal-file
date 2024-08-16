import ApiService from '../auth/FetchInterceptor';

const HrDocumentsStepsService = {};

HrDocumentsStepsService.get_document_step = async function (id) {
    console.log(id);
    try {
        const response = await ApiService.get(`/hr-documents-step?id=${id}`);

        return response.data;
    } catch (e) {
        console.error(e);
    }
};

HrDocumentsStepsService.get_document_step_user = async function (id, user) {
    if (!user || !id) return null;
    try {
        const response = await ApiService.get(`hr-documents-template/steps/${id}?user_id=${user}`);

        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export default HrDocumentsStepsService;
