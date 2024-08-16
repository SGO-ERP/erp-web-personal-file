import { Table } from 'antd';
import React from 'react';
import moment from 'moment';
import IntlMessage from 'components/util-components/IntlMessage';
import {
    useLocalizationOnlyText
} from "../../../../../../../components/util-components/LocalizationText/LocalizationText";

const ArmyEquipmentTable = ({ data }) => {
    const filteredData = data?.filter((elem) => elem?.type_of_equipment === 'army_equipment');

    const getLocalizationText = useLocalizationOnlyText().getLocalizationText;

    const columns = [
        {
            title: <IntlMessage id="personal.services.weapons.modal.name" />,
            dataIndex: 'name',
            key: 'name',
            render: (text) => {
                const weaponTypeText = getLocalizationText(text.type);
                return `${weaponTypeText}, №${text.inventory}`;
            },
        },
        {
            title: <IntlMessage id="personal.services.weapons.modal.ammoCount" />,
            dataIndex: 'ammoCount',
            key: 'ammoCount',
            render: (text) => `${text} магазин`,
        },
        {
            title: <IntlMessage id="personal.services.weapons.modal.date" />,
            dataIndex: 'date',
            key: 'date',
            render: (text) => text,
        },
    ];

    const dataSource = filteredData?.map((elem) => ({
        key: elem.id,
        name: {
            type: elem?.type_of_army_equipment_model,
            inventory: elem?.inventory_number,
        },
        ammoCount: elem.count_of_ammo,
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

export default ArmyEquipmentTable;
