import { FileTextTwoTone, PhoneFilled, PrinterFilled } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ModalEditPropertyAnother from './modals/ModalEditProporetyAnother';
import LocalizationText from '../../../../../../components/util-components/LocalizationText/LocalizationText';
import moment from 'moment';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import CollapseErrorBoundary from '../common/CollapseErrorBoundary';

const PropThirdList = ({ equipments, source = 'get', setModalState }) => {
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
                <ModalEditPropertyAnother
                    equipment={currentEquipment}
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    source={source}
                />
            )}
            {equipments.length > 0 &&
                equipments.filter((item) => !Object.hasOwnProperty.call(item,'delete')).map((equipment, index) =>
                    equipment.delete ? null : (
                    <div
                        // TEMP: key={equipment.id}
                        key={index}
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
                                {equipment?.type_of_other_equipment_model?.type_of_equipment
                                    ?.name === 'Телефон' ? (
                                    <PhoneFilled style={{ color: '#366EF6', fontSize: '20px' }} />
                                ) : equipment?.type_of_other_equipment_model?.type_of_equipment
                                      ?.name === 'Принтер' ? (
                                    <PrinterFilled style={{ color: '#366EF6', fontSize: '20px' }} />
                                ) : null}
                            </Col>
                            <Col xs={20} md={20} xl={20} lg={20}>
                                <Row gutter={16}>
                                    <Col lg={20} className={'font-style'}>
                                        <LocalizationText
                                            text={
                                                equipment.type_of_other_equipment_model
                                                    .type_of_equipment
                                            }
                                        />{' '}
                                        <LocalizationText
                                            text={equipment?.type_of_other_equipment_model || ''}
                                        />
                                        , №{equipment.inventory_number || ''}
                                        <p style={{ fontSize: '12px' }}>
                                            <Row gutter={16}>
                                                <Col xl={24} className={'font-style'}>
                                                    {equipment.inventory_count || '0'} {(currentLocale==='ru' ? <>шт.,&nbsp;</> : <>дана.,&nbsp;</>)}
                                                    {moment(equipment.date_from).format(
                                                        'DD.MM.YYYY',
                                                    )}
                                                </Col>
                                            </Row>
                                        </p>
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

export default PropThirdList;
