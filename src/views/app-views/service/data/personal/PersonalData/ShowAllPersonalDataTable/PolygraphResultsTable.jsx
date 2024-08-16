import { Table } from 'antd';
import React from 'react';
import moment from 'moment';
import IntlMessage from 'components/util-components/IntlMessage';

const PolygraphResultsTable = ({ data }) => {
    const columns = [
        {
            title: <IntlMessage id="personal.additional.polygraphResults.modal.number" />,
            dataIndex: 'number',
            key: 'number',
            render: (text) => `№${text}`,
        },
        {
            title: <IntlMessage id="personal.additional.polygraphResults.modal.issuedBy" />,
            dataIndex: 'issuedBy',
            key: 'issuedBy',
            render: (text) => text,
        },
        {
            title: <IntlMessage id="personal.additional.polygraphResults.modal.date" />,
            dataIndex: 'date',
            key: 'date',
            render: (text) => text,
        },
    ];

    const dataSource = data?.map((elem) => ({
        key: elem.id,
        number: elem.number,
        issuedBy: elem.issued_by,
        date: moment(elem.date_of_issue || '').format('DD.MM.YYYY'),
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

export default PolygraphResultsTable;
