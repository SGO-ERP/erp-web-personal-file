import { useTranslation } from 'react-i18next';
import { appLocalStorage } from 'utils/appLocalStorage/appLocalStorage';

const LocalizationText = ({ text }) => {
    const { i18n } = useTranslation();
    const currentLocale = i18n.language;

    if (currentLocale === 'kk') {
        return <span>{text.nameKZ}</span>;
    } else if (currentLocale === 'ru') {
        return <span>{text.name}</span>;
    } else return <></>;
};

export default LocalizationText;

export class LocalText {
    static getName(item) {
        const currentLocale = localStorage.getItem('lan');

        if (currentLocale === 'kk') {
            return item?.nameKZ ?? '';
        }
        return item?.name ?? '';
    }

    static getKey(item, key) {
        const currentLocale = localStorage.getItem('lan');

        if (currentLocale === 'kk') {
            return item[key + 'KZ'];
        } else if (currentLocale === 'ru') {
            return item[key];
        }
        return item[key];
    }
}

export const LocalizationTextExact = ({ data, property }) => {
    const { i18n } = useTranslation();
    const currentLocale = i18n.language;

    if (currentLocale === 'kk') {
        return <span>{data[`${property}KZ`]}</span>;
    } else if (currentLocale === 'ru') {
        return <span>{data[property]}</span>;
    } else return <></>;
};

export const useLocalizationOnlyText = () => {
    const { i18n } = useTranslation();
    const currentLocale = i18n.language;

    const getLocalizationText = (text) => {
        if (currentLocale === 'kk') {
            return text.nameKZ;
        } else if (currentLocale === 'ru') {
            return text.name;
        } else return '';
    };

    const getLocalizationTextExact = (text, property) => {
        if (currentLocale === 'kk') {
            return text[`${property}KZ`];
        } else if (currentLocale === 'ru') {
            return text[property];
        } else return '';
    };

    return {
        getLocalizationText,
        getLocalizationTextExact,
    };
};
