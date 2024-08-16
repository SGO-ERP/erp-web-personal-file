import { Table } from 'antd';
import React from 'react';
import moment from 'moment';
import IntlMessage from 'components/util-components/IntlMessage';
import { useTranslation } from 'react-i18next';
import { LocalizationTextExact } from 'components/util-components/LocalizationText/LocalizationText';

const AttestationsTable = ({ data }) => {
    const { i18n } = useTranslation();
    const currentLocale = i18n.language;

    const columns = [
        {
            title: <IntlMessage id="personal.services.certifications.modal.status" />,
            dataIndex: 'status',
            key: 'status',
            render: (text) => <LocalizationTextExact data={text} property={'attestation_status'} />,
        },
        {
            title: <IntlMessage id="personal.services.certifications.modal.date" />,
            dataIndex: 'date',
            key: 'date',
            render: (text) => text,
        },
        {
            title: <IntlMessage id="personal.services.certifications.modal.order" />,
            dataIndex: 'order',
            key: 'order',
            render: (text) =>
                currentLocale === 'ru'
                    ? `№${text.number} от ${text.date}`
                    : `${text.date} №${text.number}`,
        },
    ];

    const dataSource = data?.map((elem) => ({
        key: elem.id,
        status: elem,
        order: {
            date: moment(elem.date_credited || '').format('DD.MM.YYYY'),
            number: elem.document_number,
        },
        date: `${moment(elem.date_from || '').format('DD.MM.YYYY')} -
        ${moment(elem.date_to || '').format('DD.MM.YYYY')}`,
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

export default AttestationsTable;
