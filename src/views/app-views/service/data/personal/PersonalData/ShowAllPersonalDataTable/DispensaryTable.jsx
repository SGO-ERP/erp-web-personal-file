import { Table } from 'antd';
import React from 'react';
import moment from 'moment';
import IntlMessage from 'components/util-components/IntlMessage';
import { useLocalizationOnlyText } from 'components/util-components/LocalizationText/LocalizationText';

const DispensaryTable = ({ data }) => {
    const { getLocalizationText, getLocalizationTextExact } = useLocalizationOnlyText();

    const columns = [
        {
            title: <IntlMessage id="personal.medicalCard.medicalMonitoring.modal.name" />,
            dataIndex: 'name',
            key: 'name',
            render: (text) => getLocalizationText(text),
        },
        {
            title: <IntlMessage id="personal.medicalCard.medicalMonitoring.modal.place" />,
            dataIndex: 'place',
            key: 'place',
            render: (text) => getLocalizationTextExact(text, 'initiator'),
        },
        {
            title: <IntlMessage id="personal.medicalCard.medicalMonitoring.modal.date" />,
            dataIndex: 'date',
            key: 'date',
            render: (text) => text,
        },
    ];

    const dataSource = data?.map((elem) => ({
        key: elem.id,
        name: elem,
        place: elem,
        date: `${moment(elem.start_date || '').format('DD.MM.YYYY')} -
            ${moment(elem.end_date || '').format('DD.MM.YYYY')}`,
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

export default DispensaryTable;
