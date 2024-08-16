import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    id: string;
    fallback?: string;
}

const IntlMessage = ({ id, fallback = 'Название кнопке не придумали' }: Props) => {
    const { t } = useTranslation();

    const translate = t(id, fallback);

    return <>{translate}</>;
};

export class IntlMessageText {
    static getText({ id, fallback }: Props) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { t } = useTranslation();
        const translate = t(id, fallback);
        return translate;
    }
}

export default IntlMessage;
