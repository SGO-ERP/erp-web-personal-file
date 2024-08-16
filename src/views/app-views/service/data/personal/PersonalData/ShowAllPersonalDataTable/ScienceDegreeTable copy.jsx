import { Table } from 'antd';
import React from 'react';
import moment from 'moment';

const ScienceDegreeTable = ({ name, data }) => {
    const columns = [
        {
            title: 'Степень',
            dataIndex: 'degree',
            key: 'degree',
            render: (text) => text,
        },
        {
            title: 'Наука',
            dataIndex: 'science',
            key: 'science',
            render: (text) => text,
        },
        {
            title: 'Специальность',
            dataIndex: 'specialty',
            key: 'specialty',
            render: (text) => text,
        },
        {
            title: 'Дата присвоения',
            dataIndex: 'date',
            key: 'date',
            render: (text) => text,
        },
        {
            title: 'Номер документа',
            dataIndex: 'documentNumber',
            key: 'documentNumber',
            render: (text) => '№' + text,
        },
    ];

    const dataSource = data?.map((elem) => ({
        key: elem.id,
        degree: elem.degree.name,
        science: elem.science.name,
        specialty: elem.specialty.name,
        date: moment(elem.assignment_date || '').format('DD.MM.YYYY'),
        documentNumber: elem.document_number,
    }));

    return <Table columns={columns} dataSource={dataSource} pagination={false} />;
};

export default ScienceDegreeTable;
