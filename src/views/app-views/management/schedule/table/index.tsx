import { PageHeader, Tabs } from 'antd';
import PageHeaderExtra from 'components/layout-components/schedule/Schedule';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IntlMessage from '../../../../../components/util-components/IntlMessage';
import ListSchedule from '../scheduletab/ListSchedule';
import '../style.css';
import { TreeContext } from '../edit';

const Index = () => {
    const [current, setCurrent] = useState('list');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const openScheduleTables = () => {
        navigate(`${APP_PREFIX_PATH}/management/schedule/history`);
    };

    const handleTabChange = (key: string) => {
        setCurrent(key);
        if (key === 'schedule') {
            openScheduleTables();
        }
    };

    return (
        <TreeContext.Provider
            value={{
                isLoading,
                setIsLoading,
                isEdit: false,
            }}
        >
            <PageHeader
                title={<IntlMessage id={'staffSchedule'} />}
                backIcon={false}
                extra={<PageHeaderExtra />}
                style={{
                    backgroundColor: 'white',
                    width: 'calc(100% + 50px)',
                    marginLeft: '-25px',
                    marginTop: '-25px',
                }}
                footer={
                    <Tabs
                        activeKey={current}
                        onChange={handleTabChange}
                        items={[
                            {
                                label: <IntlMessage id={'staffSchedule.actual_structure'} />,
                                key: 'schedule',
                            },
                            {
                                label: <IntlMessage id={'staffSchedule.history'} />,
                                key: 'list',
                            },
                        ]}
                    />
                }
            />
            <ListSchedule />
        </TreeContext.Provider>
    );
};

export default Index;
