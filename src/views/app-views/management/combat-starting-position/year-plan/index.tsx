import React, { useState } from 'react';

import { Button, Card, Col, PageHeader, Radio, Row } from 'antd';

import IntlMessage from '../../../../../components/util-components/IntlMessage';

import ApprovedTableCSP from './components/tables/ApprovedTableCSP';
import DraftTableCSP from './components/tables/DraftTableCSP';
import ModalSetUpStandards from './components/modals/ModalSetUpStandards';
import ModalChooseYear from './components/modals/ModalChooseYear';
import {
    clearLocalScheduleYear,
    clearRemoteScheduleYear,
} from '../../../../../store/slices/bsp/create/scheduleYear';
import { useAppDispatch } from '../../../../../hooks/useStore';

const Index = () => {
    const [selectedTable, setSelectedTable] = React.useState<string>('approvedCSP');
    const [upStandards, setUpStandards] = useState<boolean>(false);
    const [chooseYear, setChooseYear] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    const createPlan = () => {
        dispatch(clearLocalScheduleYear());
        dispatch(clearRemoteScheduleYear());
        setChooseYear(true);
    };

    return (
        <React.Fragment>
            <ModalSetUpStandards isOpen={upStandards} onClose={() => setUpStandards(false)} />
            <ModalChooseYear isOpen={chooseYear} onClose={() => setChooseYear(false)} />
            <PageHeader
                title={<IntlMessage id={'sidenav.management.combat-starting-position'} />}
                subTitle={
                    <IntlMessage id={'sidenav.management.combat-starting-position.year.plans'} />
                }
                backIcon={false}
                style={{
                    backgroundColor: 'white',
                    width: 'calc(100% + 50px)',
                    marginLeft: '-25px',
                    marginTop: '-25px',
                }}
            />
            <Card style={{ marginTop: '16px' }}>
                <Row justify="space-between">
                    <Col xs={14}>
                        <Radio.Group
                            defaultValue="approvedCSP"
                            value={selectedTable}
                            onChange={(evt) => {
                                setSelectedTable(evt.target.value);
                            }}
                        >
                            <Radio.Button value="approvedCSP">
                                <IntlMessage id={'csp.table.approved'} />
                            </Radio.Button>

                            <Radio.Button value="draftCSP">
                                <IntlMessage id={'letters.radioButton.draft'} />
                            </Radio.Button>
                        </Radio.Group>
                    </Col>

                    <Col>
                        <Row gutter={16}>
                            {selectedTable === 'approvedCSP' && (
                                <Col>
                                    <Button
                                        color={'white'}
                                        style={{ borderRadius: '10px' }}
                                        onClick={() => {
                                            setUpStandards(true);
                                        }}
                                    >
                                        <IntlMessage id={'csp.button.standards'} />
                                    </Button>
                                </Col>
                            )}
                            <Col>
                                <Button
                                    type={'primary'}
                                    style={{ borderRadius: '10px' }}
                                    onClick={() => createPlan()}
                                >
                                    <IntlMessage id={'initiate.create'} />
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {selectedTable === 'approvedCSP' ? (
                    <div style={{ marginTop: '16px' }}>
                        <ApprovedTableCSP />
                    </div>
                ) : (
                    <div style={{ marginTop: '16px' }}>
                        <DraftTableCSP />
                    </div>
                )}
            </Card>
        </React.Fragment>
    );
};

export default Index;
