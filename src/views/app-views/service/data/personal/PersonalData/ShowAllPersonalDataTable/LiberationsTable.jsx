import { Table, Tag } from 'antd';
import React from 'react';
import moment from 'moment';
import IntlMessage from 'components/util-components/IntlMessage';
import { useLocalizationOnlyText } from 'components/util-components/LocalizationText/LocalizationText';

const LiberationsTable = ({ data }) => {
    const { getLocalizationText, getLocalizationTextExact } = useLocalizationOnlyText();

    const columns = [
        {
            title: <IntlMessage id="personal.medicalCard.releases.modal.name" />,
            dataIndex: 'name',
            key: 'name',
            render: (text) => getLocalizationTextExact(text, 'reason'),
        },
        {
            title: <IntlMessage id="personal.medicalCard.releases.modal.liberation" />,
            dataIndex: 'liberation',
            key: 'liberation',
            render: (text) => {
                return text.map((elem) => (
                    <Tag
                        key={elem.id}
                        color="#F0F5FF"
                        style={{
                            fontSize: '10px',
                            borderColor: '#ADC6FF',
                            color: '#2F54EB',
                            borderRadius: '15px',
                            lineHeight: '16px',
                            marginRight: '10px',
                        }}
                        className={'font-style'}
                    >
                        {getLocalizationText(elem)}
                    </Tag>
                ));
            },
        },
        {
            title: <IntlMessage id="personal.medicalCard.releases.modal.place" />,
            dataIndex: 'place',
            key: 'place',
            render: (text) => getLocalizationTextExact(text, 'initiator'),
        },
        {
            title: <IntlMessage id="personal.medicalCard.releases.modal.date" />,
            dataIndex: 'date',
            key: 'date',
            render: (text) => text,
        },
    ];

    const dataSource = data?.map((elem) => ({
        key: elem.id,
        name: elem,
        liberation: elem.liberation_ids,
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

export default LiberationsTable;
