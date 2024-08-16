import { PageHeader, Row, Spin, Tabs } from 'antd';
import PageHeaderExtra from 'components/layout-components/schedule/Schedule';
import React, { MouseEventHandler, createContext, useEffect, useState } from 'react';
import IntlMessage from '../../../../../components/util-components/IntlMessage';
import { TreeSchedule } from '../scheduletab/TreeSchedule';
import './../style.css';
import { TreeContextTypes } from 'utils/format/interfaces';
import { useSearchParams } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

export const TreeContext = createContext<TreeContextTypes | null>(null);

const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 24,
        }}
        spin
    />
);
const Index = () => {
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const mode = searchParams.get('mode');

    useEffect(() => {
        const handleBeforeUnload = (event: any) => {
            event.preventDefault();
            event.returnValue = 'Do you really want to refresh this page?';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const [current, setCurrent] = useState('schedule');

    const handleClick = (event: MouseEventHandler<HTMLDivElement> & { key: string }) => {
        setCurrent(event.key);
    };

    return (
        <TreeContext.Provider
            value={{
                isLoading,
                setIsLoading,
                isEdit: true,
            }}
        >
            <>
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
                    // footer={
                    //     <Tabs
                    //         onClick={(event) => {
                    //             // @ts-expect-error key doesn't exist on type MouseEvent<HTMLDivElement, MouseEvent>
                    //             handleClick(event);
                    //         }}
                    //         defaultActiveKey={current}
                    //         items={[
                    //             {
                    //                 label: <IntlMessage id={'staffSchedule.actual_structure'} />,
                    //                 key: 'schedule',
                    //             },
                    //         ]}
                    //     />
                    // }
                />
                <div style={{ marginTop: '25px' }}>
                    <Row className="edit-mode-banner">
                        <IntlMessage id="staffSchedule.editMode" />
                    </Row>
                </div>
                <Spin
                    spinning={isLoading}
                    indicator={antIcon}
                    size="large"
                    style={{ position: 'absolute', top: 120 }}
                >
                    <TreeSchedule />
                </Spin>
            </>
        </TreeContext.Provider>
    );
};

export default Index;
