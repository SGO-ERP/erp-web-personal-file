import ApiService from '../auth/FetchInterceptor';
import { AUTH_TOKEN } from '../constants/AuthConstant';

const HrDocumentInfos = {};

HrDocumentInfos.get_by_id = async function (id) {
    try {
        const response = await ApiService.get(`/hr-documents-info/history/${id}/`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
            },
        });
        // console.log(response.data)
        return response.data;
    } catch (e) {
        console.error(e);
    }
};
export default HrDocumentInfos;
