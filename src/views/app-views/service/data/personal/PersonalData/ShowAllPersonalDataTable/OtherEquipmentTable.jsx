import { Table } from 'antd';
import React from 'react';
import moment from 'moment';
import IntlMessage from 'components/util-components/IntlMessage';

const OtherEquipmentTable = ({ data }) => {
    const filteredData = data?.filter((elem) => elem?.type_of_equipment === 'other_equipment');

    const columns = [
        {
            title: <IntlMessage id="personal.services.other.modal.name" />,
            dataIndex: 'name',
            key: 'name',
            render: (text) => `${text.type}, №${text.inventory}`,
        },
        {
            title: <IntlMessage id="personal.services.other.modal.date" />,
            dataIndex: 'date',
            key: 'date',
            render: (text) => text,
        },
    ];

    const dataSource = filteredData?.map((elem) => ({
        key: elem.id,
        name: {
            type: elem?.type_of_other_equipment_model?.name,
            inventory: elem?.inventory_number,
        },
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

export default OtherEquipmentTable;
