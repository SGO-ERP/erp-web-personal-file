import { Table } from 'antd';
import React from 'react';
import moment from 'moment';

import AirplaneImg from '../../../abroad/airplane.png';
import CarImg from '../../../abroad/car.png';
import TrainImg from '../../../abroad/train.png';
import IntlMessage from 'components/util-components/IntlMessage';
import { useLocalizationOnlyText } from 'components/util-components/LocalizationText/LocalizationText';

const AbroadTravelsTable = ({ data }) => {
    const { getLocalizationText, getLocalizationTextExact } = useLocalizationOnlyText();

    const columns = [
        {
            title: <IntlMessage id="personal.additional.overseasTravel.modal.vehicle_type" />,
            dataIndex: 'vehicleType',
            key: 'vehicleType',
            render: (text) => (
                <img
                    src={text === 'Самолет' ? AirplaneImg : text === 'Машина' ? CarImg : TrainImg}
                    alt={'train'}
                    style={{ height: '16px' }}
                />
            ),
        },
        {
            title: <IntlMessage id="personal.additional.overseasTravel.modal.name" />,
            dataIndex: 'name',
            key: 'name',
            render: (text) => getLocalizationText(text),
        },
        {
            title: <IntlMessage id="personal.additional.overseasTravel.modal.reason" />,
            dataIndex: 'reason',
            key: 'reason',
            render: (text) => getLocalizationTextExact(text, 'reason'),
        },
        {
            title: <IntlMessage id="personal.additional.overseasTravel.modal.date" />,
            dataIndex: 'date',
            key: 'date',
            render: (text) => text,
        },
    ];

    const dataSource = data?.map((elem) => ({
        key: elem.id,
        name: elem.destination_country,
        reason: elem,
        vehicleType: elem.vehicle_type,
        date: `${moment(elem.date_from || '').format('DD.MM.YYYY')} -
        ${moment(elem.date_to || '').format('DD.MM.YYYY')}`,
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

export default AbroadTravelsTable;
