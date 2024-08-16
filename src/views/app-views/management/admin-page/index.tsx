import React, { ChangeEvent, useState } from 'react';

import { Col, PageHeader, Row, Tabs, Input } from 'antd';

import IntlMessage, { IntlMessageText } from 'components/util-components/IntlMessage';
import ActualCard from './components/ActualCard';
import HistoryCard from './components/HistoryCard';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { setTableSearch } from 'store/slices/admin-page/adminPageSlice';

const { Search } = Input;

const Index = () => {
    const [current, setCurrent] = useState<string>('actual');
    const dispatch = useAppDispatch();
    const tableSearch = useAppSelector((state) => state.adminPage.tableSearch);

    const handleTabChange = (key: string) => {
        setCurrent(key);
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(setTableSearch(e.target.value));
    };

    return (
        <React.Fragment>
            <Row
                align="bottom"
                justify="space-between"
                style={{
                    backgroundColor: 'white',
                    width: 'calc(100% + 50px)',
                    marginLeft: '-25px',
                    marginTop: '-25px',
                }}
            >
                <Col>
                    <PageHeader
                        title={<IntlMessage id={'constructor.name.directory'} />}
                        backIcon={false}
                        footer={
                            <Tabs
                                activeKey={current}
                                onChange={(e) => handleTabChange(e)}
                                items={[
                                    {
                                        label: <IntlMessage id={'admin.panel.actual'} />,
                                        key: 'actual',
                                    },
                                    // {
                                    //     label: <IntlMessage id={'admin.panel.all.records'} />,
                                    //     key: 'history'
                                    // },
                                ]}
                            />
                        }
                    />
                </Col>
                <Col xs={5} style={{ margin: '0 24px 8px 0' }}>
                    <Search
                        value={tableSearch}
                        placeholder={IntlMessageText.getText({ id: 'letters.search' })}
                        onChange={handleSearch}
                    />
                </Col>
            </Row>
            {current === 'actual' ? <ActualCard /> : current === 'history' && <HistoryCard />}
        </React.Fragment>
    );
};

export default Index;
