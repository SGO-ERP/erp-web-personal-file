import { Table } from 'antd';
import React from 'react';
import moment from 'moment';
import IntlMessage from 'components/util-components/IntlMessage';
import LocalizationText from 'components/util-components/LocalizationText/LocalizationText';

const ScienceDegreeTable = ({ name, data }) => {
    const columns = [
        {
            title: <IntlMessage id="education.eductionCardName.academicDegree.modal.degree" />,
            dataIndex: 'degree',
            key: 'degree',
            render: (text) => <LocalizationText text={text} />,
        },
        {
            title: <IntlMessage id="education.eductionCardName.academicDegree.modal.science" />,
            dataIndex: 'science',
            key: 'science',
            render: (text) => <LocalizationText text={text} />,
        },
        {
            title: <IntlMessage id="education.eductionCardName.academicDegree.modal.specialty" />,
            dataIndex: 'specialty',
            key: 'specialty',
            render: (text) => <LocalizationText text={text} />,
        },
        {
            title: <IntlMessage id="education.eductionCardName.academicDegree.modal.date" />,
            dataIndex: 'date',
            key: 'date',
            render: (text) => text,
        },
        {
            title: (
                <IntlMessage id="education.eductionCardName.academicDegree.modal.document_number" />
            ),
            dataIndex: 'documentNumber',
            key: 'documentNumber',
            render: (text) => '№' + text,
        },
    ];

    const dataSource = data?.map((elem) => ({
        key: elem.id,
        degree: elem.degree,
        science: elem.science,
        specialty: elem.specialty,
        date: moment(elem.assignment_date || '').format('DD.MM.YYYY'),
        documentNumber: elem.document_number,
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

export default ScienceDegreeTable;
