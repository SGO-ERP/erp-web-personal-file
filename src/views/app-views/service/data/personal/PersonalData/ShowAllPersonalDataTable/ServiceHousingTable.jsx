import { Table } from 'antd';
import React from 'react';
import moment from 'moment';
import IntlMessage from 'components/util-components/IntlMessage';
import { useLocalizationOnlyText } from 'components/util-components/LocalizationText/LocalizationText';

const ServiceHousingTable = ({ data }) => {
    const { getLocalizationText } = useLocalizationOnlyText();

    const columns = [
        {
            title: <IntlMessage id="personal.additional.serviceHousing.modal.name" />,
            dataIndex: 'name',
            key: 'name',
            render: (text) => getLocalizationText(text),
        },
        {
            title: <IntlMessage id="personal.additional.serviceHousing.modal.address" />,
            dataIndex: 'address',
            key: 'address',
            render: (text) => text,
        },
        {
            title: <IntlMessage id="personal.additional.serviceHousing.modal.date" />,
            dataIndex: 'date',
            key: 'date',
            render: (text) => text,
        },
    ];

    const dataSource = data?.map((elem) => ({
        key: elem.id,
        name: elem.type,
        address: elem.address,
        date: moment(elem.issue_date || '').format('DD.MM.YYYY'),
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

export default ServiceHousingTable;
