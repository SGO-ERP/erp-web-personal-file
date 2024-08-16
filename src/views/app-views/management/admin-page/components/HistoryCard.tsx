import React from 'react';
import {Card, Table} from 'antd';
import IntlMessage from '../../../../../components/util-components/IntlMessage';
import moment from 'moment';

const HistoryCard = () => {

    const columns = [
        {
            title: <IntlMessage id={'admin.panel.date.unactual'}/>,
            dataIndex: 'date',
            key: 'date',
            render: (_:string, record:any) => (
                <div>
                    {moment(record.date).format('DD.MM.YYYY HH:mm')}
                </div>
            ),
        },
        {
            title: <IntlMessage id={'admin.panel.name'}/>,
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: <IntlMessage id={'letters.historytable.actions'}/>,
            dataIndex: 'actions',
            key: 'actions'
        }
    ];


    return (
        <Card style={{marginTop: '16px'}}>
            <Table
                columns={columns}
                // dataSource={}
            />
        </Card>
    );
};

export default HistoryCard;
