import { Col, Row } from 'antd';
import IntlMessage from 'components/util-components/IntlMessage';
import { LocalText } from 'components/util-components/LocalizationText/LocalizationText';
import moment from 'moment';
import React from 'react';

const Info = ({ info }) => {
    return (
        <div>
            <Row gutter={[18, 16]}>
                <Col
                    xs={12}
                    md={12}
                    lg={12}
                    xl={12}
                    style={{ color: '#72849A' }}
                    className={'font-style text-muted'}
                >
                    <IntlMessage id="personal.family.fullName" />
                </Col>
                <Col xs={12} md={12} lg={12} xl={12} className={'font-style'}>
                    {info.last_name + ' ' + info.first_name + ' '}
                    {info.father_name ?? ''}
                </Col>
                <Col
                    xs={12}
                    md={12}
                    lg={12}
                    xl={12}
                    style={{ color: '#72849A' }}
                    className={'font-style text-muted'}
                >
                    <IntlMessage id="personal.family.IIN" />
                </Col>
                <Col xs={12} md={12} lg={12} xl={12} className={'font-style'}>
                    {info.IIN}
                </Col>
                <Col
                    xs={12}
                    md={12}
                    lg={12}
                    xl={12}
                    style={{ color: '#72849A' }}
                    className={'font-style text-muted'}
                >
                    <IntlMessage id="personal.family.birthDate" />
                </Col>
                <Col xs={12} md={12} lg={12} xl={12} className={'font-style'}>
                    {moment(info.birthday).format('DD.MM.YYYY')}
                </Col>
                {info.death_day ? (
                    <>
                        <Col
                            xs={12}
                            md={12}
                            lg={12}
                            xl={12}
                            style={{ color: '#72849A' }}
                            className={'font-style text-muted'}
                        >
                            <IntlMessage id="personal.family.deathDate" />
                        </Col>
                        <Col xs={12} md={12} lg={12} xl={12} className={'font-style'}>
                            {moment(info.death_day).format('DD.MM.YYYY')}
                        </Col>
                    </>
                ) : null}
                <Col
                    xs={12}
                    md={12}
                    lg={12}
                    xl={12}
                    style={{ color: '#72849A' }}
                    className={'font-style text-muted'}
                >
                    <IntlMessage id="personal.family.birthPlace" />
                </Col>
                <Col xs={12} md={12} lg={12} xl={12} className={'font-style'}>
                    {`${
                        info?.birthplace?.country != null
                            ? LocalText.getName(info?.birthplace?.country)
                            : info?.birthplace?.country_name || info?.country_name || ''
                    } ${
                        info?.birthplace?.region != null
                            ? LocalText.getName(info?.birthplace?.region)
                            : info?.birthplace?.region_name || info?.region_name || ''
                    } ${
                        info?.birthplace?.city != null
                            ? LocalText.getName(info?.birthplace?.city)
                            : info?.birthplace?.city_name || info?.city_name || ''
                    }`}
                </Col>
                {info?.address && info?.address !== null ? (
                    <>
                        <Col
                            xs={12}
                            md={12}
                            lg={12}
                            xl={12}
                            style={{ color: '#72849A' }}
                            className={'font-style text-muted'}
                        >
                            <IntlMessage id="personal.family.residenceAddress" />
                        </Col>
                        <Col xs={12} md={12} lg={12} xl={12} className={'font-style'}>
                            {info.address}
                        </Col>
                    </>
                ) : null}
                {info?.workplace && info?.workplace !== null ? (
                    <>
                        <Col
                            xs={12}
                            md={12}
                            lg={12}
                            xl={12}
                            style={{ color: '#72849A' }}
                            className={'font-style text-muted'}
                        >
                            <IntlMessage id="personal.family.workPlace" />
                        </Col>
                        <Col xs={12} md={12} lg={12} xl={12} className={'font-style'}>
                            {info.workplace}
                        </Col>
                    </>
                ) : null}
            </Row>
        </div>
    );
};

export default Info;
