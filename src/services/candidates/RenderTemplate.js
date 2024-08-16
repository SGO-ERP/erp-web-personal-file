import ApiService from '../../auth/FetchInterceptor';
import { AUTH_TOKEN } from '../../constants/AuthConstant';

let RenderTemplateService = {};

RenderTemplateService.render_spec = async function (hr_document_template_id, candidate_id) {
    try {
        const response = await ApiService.post(
            '/render/render',
            {
                'hr_document_template_id': hr_document_template_id,
                'candidate_id': candidate_id,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
                },
                responseType: 'blob',
            },
        );
        return new File([response.data], 'Document.docx');
    } catch (e) {
        console.error(e);
    }
};

RenderTemplateService.render_finish = async function (hr_document_template_id, candidate_id) {
    try {
        const response = await ApiService.post(
            '/render/render/finish-candidate',
            {
                'hr_document_template_id': hr_document_template_id,
                'candidate_id': candidate_id,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
                },
                responseType: 'blob',
            },
        );
        return new File([response.data], 'Document.docx');
    } catch (e) {
        console.error(e);
    }
};

RenderTemplateService.renderHTML2PDF = async function (html, fileName) {
    try {
        const response = await ApiService.post(
            '/render/convert/pdf',
            {
                'html': html,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
                },
                responseType: 'blob',
            },
        );
        return new File([response.data], fileName);
    } catch (e) {
        console.error(e);
    }
};

export default RenderTemplateService;
