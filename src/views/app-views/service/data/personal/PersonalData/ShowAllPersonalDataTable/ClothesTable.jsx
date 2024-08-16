import { Table } from 'antd';
import React from 'react';
import moment from 'moment';
import IntlMessage, { IntlMessageText } from 'components/util-components/IntlMessage';
import LocalizationText from 'components/util-components/LocalizationText/LocalizationText';

const ClothesTable = ({ data }) => {
    const filteredData = data?.filter((elem) => elem?.type_of_equipment === 'clothing_equipment');

    const sizeText = IntlMessageText.getText({
        id: 'size',
    });

    const columns = [
        {
            title: <IntlMessage id="personal.services.equipment.modal.name" />,
            dataIndex: 'name',
            key: 'name',
            render: (text) => <LocalizationText text={text} />,
        },
        {
            title: <IntlMessage id="personal.services.equipment.modal.type" />,
            dataIndex: 'type',
            key: 'type',
            render: (text) => <LocalizationText text={text} />,
        },
        {
            title: <IntlMessage id="personal.services.equipment.modal.size" />,
            dataIndex: 'size',
            key: 'size',
            render: (text) => `${text} ${sizeText}`,
        },
        {
            title: <IntlMessage id="personal.services.equipment.modal.date" />,
            dataIndex: 'date',
            key: 'date',
            render: (text) => text,
        },
    ];

    const dataSource = filteredData?.map((elem) => ({
        key: elem.id,
        name: elem?.cloth_eq_types_models?.type_of_equipment,
        type: elem?.cloth_eq_types_models?.model_of_equipment,
        size: elem.clothing_size,
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

export default ClothesTable;
