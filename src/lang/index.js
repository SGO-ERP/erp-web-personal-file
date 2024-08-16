import antdKkKZ from 'antd/es/locale/kk_KZ';
import antdRuRU from 'antd/es/locale/ru_RU';
import { THEME_CONFIG } from 'configs/AppConfig';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import kk from './locales/kk_KZ.json';
import ru from './locales/ru_RU.json';

export const resources = {
    ru: {
        translation: ru,
        antd: antdRuRU,
    },
    kk: {
        translation: kk,
        antd: antdKkKZ,
    },
};

i18n.use(initReactI18next).init({
    resources,
    fallbackLng: THEME_CONFIG.locale,
    lng: THEME_CONFIG.locale,
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
