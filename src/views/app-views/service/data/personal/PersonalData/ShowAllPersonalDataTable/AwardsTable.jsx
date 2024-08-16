import { Table } from 'antd';
import React from 'react';
import moment from 'moment';
import IntlMessage, { IntlMessageText } from 'components/util-components/IntlMessage';
import LocalizationText from 'components/util-components/LocalizationText/LocalizationText';
import { useTranslation } from 'react-i18next';

const AwardsTable = ({ name, data }) => {
    const orderText = IntlMessageText.getText({
        id: 'personal.services.awards.modal.order',
    });

    const { i18n } = useTranslation();
    const currentLocale = i18n.language;

    const columns = [
        {
            title: <IntlMessage id="personal.services.awards.modal.name" />,
            dataIndex: 'name',
            key: 'name',
            render: (text) => <LocalizationText text={text} />,
        },
        {
            title: <IntlMessage id="personal.services.awards.modal.picture" />,
            dataIndex: 'picture',
            key: 'picture',
            render: (text) => (
                <img src={text.url || ''} alt="медаль" style={{ width: '25px', height: '25px' }} />
            ),
        },
        {
            title: <IntlMessage id="personal.services.awards.modal.order" />,
            dataIndex: 'order',
            key: 'order',
            render: (text) =>
                currentLocale === 'ru'
                    ? `${orderText} №${text.number} от ${text.date}`
                    : `${text.date} №${text.number} ${orderText}`,
        },
    ];

    const dataSource = data?.map((elem) => ({
        key: elem.id,
        name: elem,
        order: {
            number: elem.document_number,
            date: moment(elem.date_from || '').format('DD.MM.YYYY'),
        },
        picture: elem.url,
    }));

    return <Table columns={columns} dataSource={dataSource} pagination={false} />;
};

export default AwardsTable;
