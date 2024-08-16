import React, { useEffect, useState } from 'react';

import { Col, PageHeader, Row } from 'antd';
import { DataNode } from 'antd/lib/tree';

import IntlMessage from '../../../../../../../components/util-components/IntlMessage';

import PageHeaderButtons from './PageHeaderButtons';
import TypeOfSpecTrain from './components/TypeOfSpecTrain';
import ScheduleDivision from './components/ScheduleDivision';
import Setting from './components/Setting';
import NotChoosePage from './components/NotChoosePage';
import { useAppDispatch } from '../../../../../../../hooks/useStore';
import { restoreSlice } from '../../../../../../../store/slices/bsp/create/scheduleYear';

const Index = () => {
    const [check, setCheck] = useState(false);
    const [value, setValue] = useState<string>('');
    const [info, setInfo] = useState<DataNode[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
    const [node, setNode] = useState();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(restoreSlice());
    }, []);

    return (
        <>
            <div>
                <PageHeader
                    title={<IntlMessage id={'csp.create.year.plan.title'} />}
                    backIcon={false}
                    extra={
                        <PageHeaderButtons
                            setCheck={setCheck}
                            setInfo={setInfo}
                            setNode={setNode}
                            setCheckedKeys={setCheckedKeys}
                        />
                    }
                    style={{
                        backgroundColor: 'white',
                        width: 'calc(100% + 50px)',
                        marginLeft: '-25px',
                        marginTop: '-25px',
                    }}
                />
            </div>
            <Row style={{ marginTop: '24px' }} gutter={[16, 16]}>
                <Col xs={8}>
                    <Row gutter={16}>
                        <Col xs={24}>
                            <TypeOfSpecTrain setValue={setValue} value={value} />
                        </Col>
                        <Col xs={24}>
                            <ScheduleDivision
                                setCheck={setCheck}
                                value={value}
                                setInfo={setInfo}
                                setNode={setNode}
                                setCheckedKeys={setCheckedKeys}
                                checkedKeys={checkedKeys}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col xs={16}>
                    {info.length > 0 ? (
                        <Setting info={info} value={value} node={node} />
                    ) : (
                        <NotChoosePage />
                    )}
                </Col>
            </Row>
        </>
    );
};

export default Index;
