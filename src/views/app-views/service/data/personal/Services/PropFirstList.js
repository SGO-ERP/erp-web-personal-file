import { Col, Row } from 'antd';
import AK74 from '../../icon/AK74.png';
// import Glock from '../../icon/glock19.png';
// import F1 from '../../icon/F1.png';
import { FileTextTwoTone } from '@ant-design/icons';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ModalEditProperty from './modals/ModalEditProperty';
import moment from 'moment';
import LocalizationText from '../../../../../../components/util-components/LocalizationText/LocalizationText';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import CollapseErrorBoundary from '../common/CollapseErrorBoundary';

const PropFirstList = ({ equipments, source = 'get', setModalState }) => {
    const [currentEquipment, setCurrentEquipment] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const currentLocale = localStorage.getItem('lan');

    const handleClick = (equipment) => {
        if (!modeRedactor) return;
        setCurrentEquipment(equipment);
        setShowEditModal(true);
    };

    if (!equipments) return null;

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            {currentEquipment && (
                <ModalEditProperty
                    equipment={currentEquipment}
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    source={source}
                />
            )}
            {equipments.length > 0 &&
                equipments.filter((item) => !Object.hasOwnProperty.call(item,'delete')).map((equipment, key) =>
                    equipment.delete ? null : (
                    <div
                        // TEMP: key={equipment.id}
                        key={key}
                        style={{ marginTop: '20px' }}
                    >
                        <Row
                            gutter={[18, 16]}
                            onClick={() => handleClick(equipment)}
                            className={modeRedactor && 'clickable-accordion'}
                        >
                            <Col
                                xs={2}
                                md={2}
                                xl={2}
                                lg={2}
                                style={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItem: 'center',
                                }}
                            >
                                {equipment?.type_of_army_equipment_model?.name?.includes(
                                    'AK-74',
                                ) && (
                                    <img
                                        src={AK74}
                                        alt={'ak74'}
                                        style={{ width: '25px', height: '25px' }}
                                    />
                                )}
                                {/*{equipment.name === 'АК-74' ? (*/}
                                {/*    <img src={AK74} alt={'ak74'} style={{ width: '25px', height: '25px' }} />*/}
                                {/*) : equipment.name === 'Glock-19' ? (*/}
                                {/*    <img src={Glock} alt={'glock'} style={{ width: '25px', height: '20px' }} />*/}
                                {/*) : equipment.name === 'F1' ? (*/}
                                {/*    <img src={F1} alt={'f1'} style={{ width: '20px', height: '25px' }} />*/}
                                {/*) : null}*/}
                            </Col>
                            <Col xs={20} md={20} xl={20} lg={20}>
                                <Row gutter={16}>
                                    <Col lg={20} className={'font-style'}>
                                        <LocalizationText
                                            text={equipment.type_of_army_equipment_model || ''}
                                        />
                                        , №{equipment?.inventory_number || ''}
                                        <Row gutter={16}>
                                            <Col xl={24} className={'font-style'}>
                                                <p style={{ fontSize: '12px' }}>
                                                    {equipment?.inventory_count || '0'} {(currentLocale==='ru' ? <>шт.,&nbsp;</> : <>дана.,&nbsp;</>)}
                                                    {moment(equipment.date_from).format(
                                                        'DD.MM.YYYY',
                                                    )}
                                                    ,{equipment.count_of_ammo || '0'} <>магаз.</>
                                                </p>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>

                            {equipment.document_link === null ||
                            equipment.document_link === undefined ? null : (
                                <Col xs={2} md={2} xl={2} lg={2}>
                                    <FileTextTwoTone
                                        style={{ fontSize: '20px' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setModalState({
                                                open: false,
                                                link: equipment.document_link,
                                            });
                                        }}
                                    />
                                </Col>
                            )}
                        </Row>
                    </div>
                ))}
        </CollapseErrorBoundary>
    );
};

export default PropFirstList;
