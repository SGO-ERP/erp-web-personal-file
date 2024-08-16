import ApiService from '../auth/FetchInterceptor';
import { AUTH_TOKEN } from '../constants/AuthConstant';

const SueveysService = {};

// @ts-expect-error Такого метода нет у типа SueveysService
SueveysService.post_surveys = async function (data) {
    try {
        const response = await ApiService.post('/surveys', data, {
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

SueveysService.post_surveys_questions = async function (data) {
    try {
        const response = await ApiService.post('/questions', data, {
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

export default SueveysService;
