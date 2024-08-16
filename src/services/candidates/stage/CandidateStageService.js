import axios from 'axios';
import { AUTH_TOKEN } from '../../../constants/AuthConstant';
import ApiService from '../../../auth/FetchInterceptor';

let CandidateStageService = {};

CandidateStageService.save_answers = async function (data) {
    try {
        const response = await ApiService.post('/candidate_stage_answer/list', data, {
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

CandidateStageService.update_stage = async function (stageId, data) {
    try {
        const response = await ApiService.put(
            `/candidate_stage_info/${stageId}/`,
            {
                status: data.status,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
                },
            },
        );
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export default CandidateStageService;
