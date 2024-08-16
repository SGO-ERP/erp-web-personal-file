import ApiService from '../../../auth/FetchInterceptor';

let CandidateUpdate = {};

CandidateUpdate.updateService = async (candidate_id, reason) => {
    const response = await ApiService.put(`/candidates/${candidate_id}`, {
        status: 'Черновик',
        debarment_reason: reason,
    });
    return response.data;
};

export default CandidateUpdate;
