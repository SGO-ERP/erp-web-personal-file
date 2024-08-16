import { AUTH_TOKEN } from '../../constants/AuthConstant';
import ApiService from '../../auth/FetchInterceptor';
import { getCertificate } from 'utils/helpers/certificate';

let CandidatesStageInfo = {};

CandidatesStageInfo.get_all_candidates_by_staff_unit_id = async function (page, limit, filter) {
    try {
        const skip = (page - 1) * limit;
        const response = await ApiService.get(
            `/candidate_stage_info?skip=${skip}&limit=${limit + 1}&filter=${filter}`,
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

CandidatesStageInfo.send_stage_info = async function (stageInfoId, data) {
    try {
        const response = await ApiService.put(`/candidate_stage_info/${stageInfoId}/send`, data, {
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
CandidatesStageInfo.sign_stage_info = async function (stageInfoId) {
    try {
        const response = await ApiService.put(`/candidate_stage_info/${stageInfoId}/sign`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

CandidatesStageInfo.sign_stage_info_ecp = async function (stageInfoId) {
    try {
        const response = await ApiService.post(`/candidate_stage_info/sign_ecp/${stageInfoId}/`, {
            certificate_blob: getCertificate(),
        });
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

CandidatesStageInfo.reject_stage_info = async function (stageInfoId) {
    try {
        const response = await ApiService.put(`/candidate_stage_info/${stageInfoId}/reject`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export default CandidatesStageInfo;
