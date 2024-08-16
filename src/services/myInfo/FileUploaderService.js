import axios from 'axios';
import ApiService from '../../auth/FetchInterceptor';
import UploadApiService from '../../auth/UploadApiService';
import { S3_BASE_URL } from '../../configs/AppConfig';
import { AUTH_TOKEN } from '../../constants/AuthConstant';

export const headers = {
    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
};
const FileUploaderService = {
    upload: async (formData) => {
        const response = await UploadApiService.post(`${S3_BASE_URL}/upload`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
            },
        });
        return response.data;
    },
    getFileByLink: async (link) => {
        try {
            const response = await axios.get(link, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
                },
                responseType: 'blob',
            });

            const filename = link.substring(link.lastIndexOf('/') + 1);
            return new File([response.data], filename);
        } catch (error) {
            console.error('Error fetching file:', error);
            throw error;
        }
    },
    getBlobByLink: async (link) => {
        const response = await axios.get(link, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
            },
            responseType: 'blob',
        });
        const filename = link.substring(link.lastIndexOf('/') + 1);
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        return { blob, filename };
    },
    uploadHtml: async (html, fileName) => {
        const response = await ApiService.post(
            '/render/convert',
            {
                'html': `${html}`,
            },
            {
                responseType: 'blob',
            },
        );
        return new File([response.data], fileName + '.docx');
    },
};

export default FileUploaderService;
