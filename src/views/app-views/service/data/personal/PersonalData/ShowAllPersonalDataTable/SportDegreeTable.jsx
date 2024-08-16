import { Table } from 'antd';
import React from 'react';
import moment from 'moment';
import IntlMessage from 'components/util-components/IntlMessage';
import LocalizationText from 'components/util-components/LocalizationText/LocalizationText';

const SportDegreeTable = ({ data }) => {
    const columns = [
        {
            title: <IntlMessage id="personal.personalData.sportsSkills.modal.type" />,
            dataIndex: 'sportType',
            key: 'sportType',
            render: (text) => <LocalizationText text={text} />,
        },
        {
            title: <IntlMessage id="personal.personalData.sportsSkills.modal.level" />,
            dataIndex: 'degree',
            key: 'degree',
            render: (text) => <LocalizationText text={text} />,
        },
        {
            title: <IntlMessage id="personal.personalData.sportsSkills.modal.date" />,
            dataIndex: 'date',
            key: 'date',
            render: (text) => text,
        },
    ];

    const dataSource = data?.map((degree) => ({
        key: degree.id,
        sportType: degree?.sport_type,
        status: 'Присвоен',
        date: moment(degree.assignment_date || '').format('DD.MM.YYYY'),
        degree: degree,
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

export default SportDegreeTable;
