import { PageHeader, Spin, Tabs } from 'antd';
import PageHeaderExtra from 'components/layout-components/schedule/Schedule';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IntlMessage from '../../../../components/util-components/IntlMessage';
import { TreeContext } from './edit';
import { TreeSchedule } from './scheduletab/TreeSchedule';
import './style.css';
import { useAppSelector } from '../../../../hooks/useStore';
import { LoadingOutlined } from '@ant-design/icons';
import { PERMISSION } from 'constants/permission';

const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 24,
        }}
        spin
    />
);
const Index = () => {
    const loading = useAppSelector((state) => state.staffScheduleSlice.loading);

    const [current, setCurrent] = useState('schedule');
    const [isLoading, setIsLoading] = useState(false);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const canEditSchedule = myPermissions?.includes(PERMISSION.STAFF_LIST_EDITOR);
    const navigate = useNavigate();

    const openScheduleTables = () => {
        navigate(`${APP_PREFIX_PATH}/management/schedule/tables`);
    };

    const handleTabChange = (key: string) => {
        setCurrent(key);
        if (key === 'list') {
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
                                disabled: !canEditSchedule,
                            },
                        ]}
                    />
                }
            />
            <Spin
                spinning={loading}
                indicator={antIcon}
                size="large"
                style={{ position: 'absolute', top: 120 }}
            >
                <TreeSchedule />
            </Spin>
        </TreeContext.Provider>
    );
};

export default Index;
