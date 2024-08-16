import { FileTextTwoTone, SkinOutlined } from '@ant-design/icons';
import { Col, Progress, Row } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import LocalizationText from '../../../../../../components/util-components/LocalizationText/LocalizationText';
import moment from 'moment';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import CollapseErrorBoundary from '../common/CollapseErrorBoundary';
import ModalEditClothes from './modals/ModalEditClothes';

const PropSecondList = ({ equipments, source = 'get', setModalState, percent }) => {
    const [currentEquipment, setCurrentEquipment] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);

    const handleClick = (equipment) => {
        if (!modeRedactor) return;
        setCurrentEquipment(equipment);
        setShowEditModal(true);
    };

    if (!equipments) return null;

    const name = (index, model) => {
        const nameComponents = [];

        for (var key in percent) {
            if (key === model) {
                nameComponents.push(key);
            }
        }

        return nameComponents[0];
    };

    const progress = (index, model) => {
        const progressComponents = [];

        for (var key in percent) {
            if (key === model) {
                progressComponents.push(<Progress key={key} percent={percent[key]} />);
            }
        }

        return progressComponents[0];
    };

    const uniqueNames =
        equipments &&
        equipments.reduce((accumulator, item) => {
            if (!accumulator[item?.cloth_eq_types_models?.model_of_equipment?.name]) {
                accumulator[item?.cloth_eq_types_models?.model_of_equipment?.name] = {
                    name: item?.cloth_eq_types_models?.model_of_equipment?.name,
                    nameKZ: item?.cloth_eq_types_models?.model_of_equipment?.nameKZ,
                    clothing_size: item?.clothing_size,
                    date_from: item?.date_from,
                };
            }
            return accumulator;
        }, {});

    const uniqueNamesArray = Object.values(uniqueNames);

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            {currentEquipment && (
                <ModalEditClothes
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
                                <SkinOutlined style={{ color: '#366EF6', fontSize: '20px' }} />
                            </Col>
                            <Col xs={20} md={20} xl={20} lg={20}>
                                <Row gutter={16}>
                                    <Col lg={20} className={'font-style'}>
                                        <LocalizationText
                                            text={
                                                equipment?.cloth_eq_types_models?.type_of_equipment
                                            }
                                        />
                                        &nbsp;
                                        <LocalizationText
                                            text={
                                                equipment?.cloth_eq_types_models?.model_of_equipment
                                            }
                                        />
                                        <p style={{ fontSize: '12px' }}>
                                            <Row gutter={16}>
                                                <Col xl={24} className={'font-style'}>
                                                    {equipment.clothing_size || ''}{' '}
                                                    <IntlMessage id={'size'} />,{' '}
                                                    {moment(equipment.date_from).format(
                                                        'DD.MM.YYYY',
                                                    )}
                                                </Col>
                                            </Row>
                                            {progress(
                                                index,
                                                equipment?.cloth_eq_types_models?.type_of_equipment
                                                    ?.name || '',
                                            )}
                                        </p>
                                    </Col>
                                </Row>
                            </Col>

                            {!equipment.document_link ? null : (
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

export default PropSecondList;
