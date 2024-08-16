import React from 'react';
import IntlMessage from "../../../../../../../components/util-components/IntlMessage";
import LocalizationText from "../../../../../../../components/util-components/LocalizationText/LocalizationText";
import moment from "moment";
import {Table} from "antd";

const AcademicTitleTable = ({ data }) => {
    const columns = [
        {
            title: (
                <IntlMessage id="service.data.modalAcademicDegree.degree" />
            ),
            dataIndex: 'degree',
            key: 'degree',
            render: (text) => <LocalizationText text={text} />,
        },
        {
            title: <IntlMessage id="service.data.modalAcademicDegree.specialization" />,
            dataIndex: 'specialization',
            key: 'specialization',
            render: (text) => <LocalizationText text={text} />,
        },
        {
            title: <IntlMessage id="service.data.modalAcademicDegree.dateAwarded" />,
            dataIndex: 'date',
            key: 'date',
            render: (text) => text,
        },
        {
            title: <IntlMessage id="personal.passport.documentNum" />,
            dataIndex: 'document_number',
            key: 'document_number',
            render: (text) => text,
        },
    ];

    const dataSource = data?.map((elem) => ({
        key: elem.id,
        degree: elem.degree,
        specialization: elem.specialty,
        date: `${moment(elem.assignment_date || '').format('DD.MM.YYYY')}`,
        document_number: elem.document_number,
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

export default AcademicTitleTable;
