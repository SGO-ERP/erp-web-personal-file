import { Table } from 'antd';
import React from 'react';
import moment from 'moment';
import IntlMessage from 'components/util-components/IntlMessage';
import {
    LocalizationTextExact,
    useLocalizationOnlyText,
} from 'components/util-components/LocalizationText/LocalizationText';

const HospitalTable = ({ data }) => {
    const { getLocalizationTextExact } = useLocalizationOnlyText();

    const columns = [
        {
            title: <IntlMessage id="personal.medicalCard.sickLeave.modal.name" />,
            dataIndex: 'name',
            key: 'name',
            render: (text) => {
                const reason = getLocalizationTextExact(text.reason, 'reason');
                return `${reason} (${text.code})`;
            },
        },
        {
            title: <IntlMessage id="personal.medicalCard.sickLeave.modal.place" />,
            dataIndex: 'place',
            key: 'place',
            render: (text) => <LocalizationTextExact data={text} property={'place'} />,
        },
        {
            title: <IntlMessage id="personal.medicalCard.sickLeave.modal.date" />,
            dataIndex: 'date',
            key: 'date',
            render: (text) => text,
        },
    ];


    const dataSource = data?.map((elem) => ({
        key: elem.id,
        name: {
            reason: elem,
            code: elem.code,
        },
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

export default HospitalTable;
