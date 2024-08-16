import ApiService from '../../auth/FetchInterceptor';
import { AUTH_TOKEN } from '../../constants/AuthConstant';

let CandidateEssayTypeService = {};

CandidateEssayTypeService.getEssayType = async () => {
    const response = await ApiService.get('/candidate_essay_type', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
        },
    });
    return response.data;
};

CandidateEssayTypeService.post_essay_name = async (candidate_id, essay_id, name) => {
    const response = await ApiService.post(`candidate_essay_type/candidate/${candidate_id}`, {
        id: essay_id,
        name: name,
        nameKZ: name,
    });
    return response.data;
};

export default CandidateEssayTypeService;
