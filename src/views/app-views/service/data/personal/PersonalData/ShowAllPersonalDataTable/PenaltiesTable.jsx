import { Table } from 'antd';
import React from 'react';
import moment from 'moment';
import IntlMessage, { IntlMessageText } from 'components/util-components/IntlMessage';
import { useTranslation } from 'react-i18next';
import { LocalizationTextExact } from 'components/util-components/LocalizationText/LocalizationText';

const PenaltiesTable = ({ data }) => {
    const orderText = IntlMessageText.getText({
        id: 'personal.services.penalties.modal.order',
    });

    const { i18n } = useTranslation();
    const currentLocale = i18n.language;

    const columns = [
        {
            title: <IntlMessage id="personal.services.penalties.modal.status" />,
            dataIndex: 'status',
            key: 'status',
            render: (text) => text,
        },
        {
            title: <IntlMessage id="personal.services.penalties.modal.reason" />,
            dataIndex: 'reason',
            key: 'reason',
            render: (text) => <LocalizationTextExact data={text} property={'reason'} />,
        },
        {
            title: <IntlMessage id="personal.services.penalties.modal.order" />,
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
        status: elem.status,
        reason: elem,
        order: {
            number: elem.document_number,
            date: moment(elem.date_from || '').format('DD.MM.YYYY'),
        },
    }));

    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            scroll={{ y: dataSource.length > 5 ? 300 : null }}
        />
    );
};

export default PenaltiesTable;
