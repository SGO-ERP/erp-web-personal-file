import ApiService from '../../auth/FetchInterceptor';
import { AUTH_TOKEN } from '../../constants/AuthConstant';

const InflectWordService = {};

InflectWordService.inflect = async function (word, septik, lang) {
    try {
        const response = await ApiService.get(
            `/render/inflect?word=${word}&septik_int=${septik}&lang=${lang}`,
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

export default InflectWordService;
