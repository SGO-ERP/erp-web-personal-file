import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import IntlMessage from 'components/util-components/IntlMessage';
import { useTranslation } from 'react-i18next';
import { PrivateServices } from 'API';
import LocalizationText from 'components/util-components/LocalizationText/LocalizationText';

const HolidaysTable = ({ data }) => {
    const { i18n } = useTranslation();
    const currentLocale = i18n.language;

    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        fetchHoliday();
    }, []);

    const fetchHoliday = async () => {
        const holidays = await PrivateServices.get(
            '/api/v1/hr-documents/options?option=status_leave&type=write',
        );

        setStatuses(holidays.data);
    };

    const columns = [
        {
            title: <IntlMessage id="personal.services.leaveAndFeedback.modal.name" />,
            dataIndex: 'name',
            key: 'name',
            render: (text) => {
                const holiday = statuses?.find((item) => item.name === text);
                return holiday && <LocalizationText text={holiday} />;
            },
        },
        {
            title: <IntlMessage id="personal.services.leaveAndFeedback.modal.date" />,
            dataIndex: 'date',
            key: 'date',
            render: (text) => text,
        },
        {
            title: <IntlMessage id="personal.services.leaveAndFeedback.modal.document" />,
            dataIndex: 'document',
            key: 'document',
            render: (text) =>
                currentLocale === 'ru'
                    ? `№${text.number} от ${text.date}`
                    : `${text.date} №${text.number}`,
        },
    ];

    const dataSource = data?.map((elem) => ({
        key: elem.id,
        name: elem.status,
        date: `${moment(elem.date_from || '').format('DD.MM.YYYY')} -
            ${moment(elem.date_to || '').format('DD.MM.YYYY')}`,
        document: {
            number: elem.document_number,
            date: moment(elem.date_from || '').format('DD.MM.YYYY'),
        },
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

export default HolidaysTable;
