import React from 'react';
import { useTranslation } from 'react-i18next';

const LocalizationTextForPurchaseType = ({ text }) => {
    const { i18n } = useTranslation();
    const currentLocale = i18n.language;

    if (currentLocale === 'kk') {
        return <span>{text.purchase_typeKZ}</span>;
    } else if (currentLocale === 'ru') {
        return <span>{text.purchase_type}</span>;
    }
};

export default LocalizationTextForPurchaseType;
