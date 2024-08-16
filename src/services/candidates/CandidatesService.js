import ApiService from '../../auth/FetchInterceptor';
import { AUTH_TOKEN } from '../../constants/AuthConstant';

let CandidatesService = {};

CandidatesService.get_all_candidates = async function (page, limit, filter) {
    try {
        const skip = (page - 1) * limit;
        const response = await ApiService.get(
            `/candidates?skip=${skip}&limit=${limit + 1}&filter=${filter}`,
            {
                headers: {
                    'Content-Type': 'application/json',
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

CandidatesService.update_candidate_id = async function (candidateId, data) {
    try {
        const response = await ApiService.put(`/candidates/${candidateId}`, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
            },
        });
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

CandidatesService.get_candidate_id = async (id) => {
    const response = await ApiService.get(`/candidates/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
        },
    });

    return response;
};

CandidatesService.getCategories = async () => {
    const response = await ApiService.get('/candidate_categories', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
        },
    });
    return response.data;
};

CandidatesService.get_all_candidate_stage_info_by_candidateId = async (candidateId) => {
    const response = await ApiService.get(`/candidate_stage_answer/all/candidate/${candidateId}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
        },
    });
    return response.data;
};

CandidatesService.get_all_candidates_in_archive = async function (page, limit, filter) {
    try {
        const skip = (page - 1) * limit;
        const response = await ApiService.get(
            `/candidates/drafts?skip=${skip}&limit=${limit + 1}&filter=${filter}`,
            {
                headers: {
                    'Content-Type': 'application/json',
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

CandidatesService.post_add_candidates = async function (iin) {
    const response = await ApiService.post('auth/register/candidate', {
        iin: iin,
    });
    return response.data;
};

export default CandidatesService;
