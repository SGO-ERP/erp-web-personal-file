import ApiService from '../../auth/FetchInterceptor';

import { AUTH_TOKEN } from 'constants/AuthConstant';
import { objectToQueryString, parseJwt } from 'utils/helpers/common';

export class UsersService {
    static async getAllUsers(HrDocumentTemplateId = '', filter = '', skip = 0, limit = 0) {
        const params = objectToQueryString({
            hr_document_template_id: HrDocumentTemplateId,
            skip,
            limit,
            filter,
        });

        try {
            const response = await ApiService.get(`/users?${params}`);

            return response.data;
        } catch (e) {
            console.error(e);
        }
    }

    static async getActiveUsers({ filter = '', skip = 0, limit = 0 }) {
        const params = objectToQueryString({
            skip,
            limit,
            filter,
        });

        try {
            const response = await ApiService.get(`/users/active?${params}`);

            return response.data;
        } catch (e) {
            console.error(e);
        }
    }

    static async getArchivedUsers({ filter = '', skip = 0, limit = 0 }) {
        const params = objectToQueryString({
            skip,
            limit,
            filter,
        });

        try {
            const response = await ApiService.get(`/users/archived?${params}`);

            return response.data;
        } catch (e) {
            console.error(e);
        }
    }
}
