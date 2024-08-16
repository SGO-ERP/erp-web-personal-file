import { Table } from 'antd';
import React from 'react';
import moment from 'moment';
import IntlMessage from 'components/util-components/IntlMessage';
import LocalizationText from 'components/util-components/LocalizationText/LocalizationText';

const CoursesTable = ({ data }) => {
    const columns = [
        {
            title: (
                <IntlMessage id="education.eductionCardName.courseTraining.modal.course_provider" />
            ),
            dataIndex: 'courseProvider',
            key: 'courseProvider',
            render: (text) => <LocalizationText text={text} />,
        },
        {
            title: <IntlMessage id="education.eductionCardName.courseTraining.modal.name" />,
            dataIndex: 'name',
            key: 'name',
            render: (text) => <LocalizationText text={text} />,
        },
        {
            title: <IntlMessage id="education.eductionCardName.courseTraining.modal.date" />,
            dataIndex: 'date',
            key: 'date',
            render: (text) => text,
        },
    ];

    const dataSource = data?.map((elem) => ({
        key: elem.id,
        courseProvider: elem.course_provider,
        date: `${moment(elem.start_date || '').format('DD.MM.YYYY')} -
            ${moment(elem.end_date || '').format('DD.MM.YYYY')}`,
        name: elem,
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

export default CoursesTable;
