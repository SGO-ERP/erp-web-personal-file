import { useTranslation } from 'react-i18next';

const LocalizationText = ({ text }) => {
    const { i18n } = useTranslation();
    const currentLocale = i18n.language;

    if (currentLocale === 'kk') {
        return <span>{text.current_stageKZ}</span>;
    } else if (currentLocale === 'ru') {
        return <span>{text.current_stage}</span>;
    }
};

export default LocalizationText;
