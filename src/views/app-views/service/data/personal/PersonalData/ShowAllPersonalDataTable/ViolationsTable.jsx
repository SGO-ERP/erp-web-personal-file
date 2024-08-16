import { Table } from 'antd';
import React from 'react';
import moment from 'moment';
import IntlMessage from 'components/util-components/IntlMessage';
import { useLocalizationOnlyText } from 'components/util-components/LocalizationText/LocalizationText';

const ViolationsTable = ({ data }) => {
    const { getLocalizationText, getLocalizationTextExact } = useLocalizationOnlyText();

    const columns = [
        {
            title: <IntlMessage id="personal.additional.offenses.modal.name" />,
            dataIndex: 'name',
            key: 'name',
            render: (text) => getLocalizationText(text),
        },
        {
            title: <IntlMessage id="personal.additional.offenses.modal.articleNumber" />,
            dataIndex: 'articleNumber',
            key: 'articleNumber',
            render: (text) => getLocalizationTextExact(text, 'article_number'),
        },
        {
            title: <IntlMessage id="personal.additional.offenses.modal.issuedBy" />,
            dataIndex: 'issuedBy',
            key: 'issuedBy',
            render: (text) => getLocalizationTextExact(text, 'issued_by'),
        },
        {
            title: <IntlMessage id="personal.additional.offenses.modal.consequence" />,
            dataIndex: 'consequence',
            key: 'consequence',
            render: (text) => getLocalizationTextExact(text, 'consequence'),
        },
        {
            title: <IntlMessage id="personal.additional.offenses.modal.date" />,
            dataIndex: 'date',
            key: 'date',
            render: (text) => text,
        },
    ];

    const dataSource = data?.map((elem) => ({
        key: elem.id,
        name: elem,
        articleNumber: elem,
        consequence: elem,
        issuedBy: elem,
        date: moment(elem.date || '').format('DD.MM.YYYY'),
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

export default ViolationsTable;
