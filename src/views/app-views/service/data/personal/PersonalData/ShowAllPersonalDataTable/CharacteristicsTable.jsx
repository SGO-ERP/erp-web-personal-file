import { Table } from 'antd';
import React from 'react';
import moment from 'moment';
import { FileTextTwoTone } from '@ant-design/icons';
import IntlMessage, { IntlMessageText } from 'components/util-components/IntlMessage';
import { useTranslation } from 'react-i18next';

const CharacteristicsTable = ({ name, data }) => {
    const characteristicText = IntlMessageText.getText({
        id: 'personal.services.characteristic.modal.characteristic',
    });

    const { i18n } = useTranslation();
    const currentLocale = i18n.language;

    const columns = [
        {
            title: <IntlMessage id="personal.services.characteristic.modal.name" />,
            dataIndex: 'name',
            key: 'name',
            render: (text) =>
                currentLocale === 'ru'
                    ? `${characteristicText} от ${text}`
                    : `${text} ${characteristicText}`,
        },
        {
            title: <IntlMessage id="personal.services.characteristic.modal.document" />,
            dataIndex: 'document',
            key: 'document',
            render: (text) => (
                <a href={text}>
                    <FileTextTwoTone />
                </a>
            ),
        },
        {
            title: <IntlMessage id="personal.services.characteristic.modal.date" />,
            dataIndex: 'date',
            key: 'date',
            render: (text) => text,
        },
    ];

    const dataSource = data?.map((elem) => ({
        key: elem.id,
        name: elem.characteristic_initiator,
        document: elem.document_link,
        date: moment(elem.date_from || '').format('DD.MM.YYYY'),
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

export default CharacteristicsTable;
