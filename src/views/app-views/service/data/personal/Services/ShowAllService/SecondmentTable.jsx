import React from 'react';
import IntlMessage from "../../../../../../../components/util-components/IntlMessage";
import  {
    useLocalizationOnlyText
} from "../../../../../../../components/util-components/LocalizationText/LocalizationText";
import moment from "moment";
import {Table} from "antd";

const SecondmentTable = ({data}) => {
    const { getLocalizationTextExact } = useLocalizationOnlyText();

    const columns = [
        {
            title: (
                <IntlMessage id="csp.create.year.plan.setting.table.column.first" />
            ),
            dataIndex: 'division',
            key: 'division',
            render: (text) => getLocalizationTextExact(text, 'staff_division'),
        },
        {
            title: <IntlMessage id="personal.medicalCard.sickLeave.modal.date" />,
            dataIndex: 'date',
            key: 'date',
            render: (text) => text,
        }
    ];


    const dataSource = data?.map((elem) => ({
        key: elem.id,
        division: elem,
        date: `${moment(elem.date_from || '').format('DD.MM.YYYY')} 
        -
        ${moment(elem?.date_to || '').format('DD.MM.YYYY')} 
        `
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

export default SecondmentTable;
