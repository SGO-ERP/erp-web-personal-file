import { Col, Row, Typography } from 'antd';
import React from 'react';
import moment from 'moment/moment';
import IntlMessage from 'components/util-components/IntlMessage';
import CollapseErrorBoundary from '../common/CollapseErrorBoundary';
import LocalizationText from '../../../../../../components/util-components/LocalizationText/LocalizationText';
const OffenceList = ({ offences }) => {
    const currentLocale = localStorage.getItem('lan');

    if (!offences) return null;

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>

            <Row gutter={[18, 16]}>
                {offences.map((offence) => (
                    <React.Fragment key={offence.id || ''}>
                        <Col xs={24} md={24} lg={24} xl={24} className={'font-style'}>
                            <Typography style={{ fontWeight: 500 }}>
                                {<LocalizationText text={offence} /> || ''}
                            </Typography>
                        </Col>
                        <Col
                            xs={12}
                            md={12}
                            lg={12}
                            xl={12}
                            style={{ color: '#72849A' }}
                            className={'font-style text-muted'}
                        >
                            <IntlMessage id="personal.additional.offenceList.date" />
                        </Col>
                        <Col xs={12} md={12} lg={12} xl={12} className={'font-style'}>
                            {moment(offence.date).format('DD.MM.YYYY')}
                        </Col>
                        <Col
                            xs={12}
                            md={12}
                            lg={12}
                            xl={12}
                            style={{ color: '#72849A' }}
                            className={'font-style text-muted'}
                        >
                            <IntlMessage id="personal.additional.offenceList.committedBy" />
                        </Col>
                        <Col xs={12} md={12} lg={12} xl={12} className={'font-style'}>
                            {(currentLocale==='kk' ? offence.issued_byKZ : offence.issued_by) || ''}
                        </Col>
                        <Col
                            xs={12}
                            md={12}
                            lg={12}
                            xl={12}
                            style={{ color: '#72849A' }}
                            className={'font-style text-muted'}
                        >
                            <IntlMessage id="personal.additional.offenceList.articleNumber" />
                        </Col>
                        <Col xs={12} md={12} lg={12} xl={12} className={'font-style'}>
                            { (currentLocale==='kk' ? offence.article_number : offence.article_numberKZ) || ''}
                        </Col>
                        <Col
                            xs={12}
                            md={12}
                            lg={12}
                            xl={12}
                            style={{ color: '#72849A' }}
                            className={'font-style text-muted'}
                        >
                            <IntlMessage id="personal.additional.offenceList.consequences" />
                        </Col>
                        <Col xs={12} md={12} lg={12} xl={12} className={'font-style'}>
                            {(currentLocale==='kk' ? offence.consequence : offence.consequenceKZ) || ''}
                        </Col>
                    </React.Fragment>
                ))}
            </Row>
        </CollapseErrorBoundary>
    );
};

export default OffenceList;
