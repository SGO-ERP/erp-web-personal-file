import { Table } from 'antd';
import React from 'react';
import moment from 'moment';
import IntlMessage from 'components/util-components/IntlMessage';

const PsychologicalChecksTable = ({ data }) => {
    const columns = [
        {
            title: <IntlMessage id="personal.additional.psychological.modal.issuedBy" />,
            dataIndex: 'issuedBy',
            key: 'issuedBy',
            render: (text) => text,
        },
        {
            title: <IntlMessage id="personal.additional.psychological.modal.documentNumber" />,
            dataIndex: 'documentNumber',
            key: 'documentNumber',
            render: (text) => `№${text}`,
        },
        {
            title: <IntlMessage id="personal.additional.psychological.modal.date" />,
            dataIndex: 'date',
            key: 'date',
            render: (text) => text,
        },
    ];

    const dataSource = data?.map((elem) => ({
        key: elem.id,
        issuedBy: elem.issued_by,
        documentNumber: elem.document_number,
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

export default PsychologicalChecksTable;
