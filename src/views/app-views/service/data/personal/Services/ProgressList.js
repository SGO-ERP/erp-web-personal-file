import { Col, Progress, Row } from 'antd';
import React from 'react';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import CollapseErrorBoundary from '../common/CollapseErrorBoundary';
import NoData from '../NoData';

const ProgressList = ({ attendance }) => {
    if (!attendance) return <NoData />;
    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            <div>
                <Row>
                    <Col lg={8}>
                        <p className="items" style={{ width: '100%' }}>
                            <IntlMessage id={'userData.radar.physical'} />
                        </p>
                    </Col>
                    <Col lg={16}>
                        <Progress percent={attendance.physical_training || ''} status={'normal'} />
                    </Col>
                </Row>
                <Row>
                    <Col lg={8}>
                        <p className="items" style={{ width: '100%' }}>
                           <IntlMessage id={'tactical.training'} />
                        </p>
                    </Col>
                    <Col lg={16}>
                        <Progress percent={attendance.tactical_training || ''} status={'normal'} />
                    </Col>
                </Row>
                <Row>
                    <Col lg={8}>
                        <p className="items" style={{ width: '100%' }}>
                            <IntlMessage id={'userData.radar.shoot'} />
                        </p>
                    </Col>
                    <Col lg={16}>
                        <Progress percent={attendance.shooting_training || ''} status={'normal'} />
                    </Col>
                </Row>
            </div>
        </CollapseErrorBoundary>
    );
};

export default ProgressList;
