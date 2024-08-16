import ApiService from '../../auth/FetchInterceptor';
import { AUTH_TOKEN } from '../../constants/AuthConstant';

let HrDocumentOptionMatreshka = {};

HrDocumentOptionMatreshka.get_hr_document_option_matreshka = async () => {
    const response = await ApiService.get(
        '/hr-documents/options?option=staff_division&data_taken=matreshka',
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
            },
        },
    );
    return response.data;
};

export default HrDocumentOptionMatreshka;
