import React, { useState } from 'react';
import moment from 'moment';

import { FileTextTwoTone } from '@ant-design/icons';

import { Col, Row, Typography } from 'antd';

import IntlMessage from 'components/util-components/IntlMessage';
import CollapseErrorBoundary from 'views/app-views/service/data/personal/common/CollapseErrorBoundary';

import { components } from 'API/types';
import { useAppSelector } from 'hooks/useStore';

import { ListModalProps } from './types';
import SpecialInspectionEditModal from '../modals-edit/SpecialInspectionEditModal';

const { Text } = Typography;

type SpecialInspection = components['schemas']['SpecialCheckRead'];

type SpecialInspectionsListProps = {
    specialInspections: SpecialInspection[];
} & ListModalProps;

export const SpecialInspectionsList = (props: SpecialInspectionsListProps) => {
    const { specialInspections, source, setModalState } = props;
    const isEditorMode = useAppSelector((state) => state.myInfo.modeRedactor);

    const [currentSpecialInspection, setCurrentSpecialInspection] = useState<SpecialInspection>();
    const [isSpecialInspectionEditModalOpen, setIsSpecialInspectionEditModalOpen] = useState(false);

    const handleClick = (specialInspection: SpecialInspection) => {
        if (!isEditorMode) return;

        setCurrentSpecialInspection(specialInspection);
        setIsSpecialInspectionEditModalOpen(true);
    };

    if (!specialInspections) return null;

    return (
        <>
            {currentSpecialInspection && (
                <SpecialInspectionEditModal
                    isOpen={isSpecialInspectionEditModalOpen}
                    currentSpecialInspection={currentSpecialInspection}
                    onClose={() => setIsSpecialInspectionEditModalOpen(false)}
                    source={source}
                />
            )}
            <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
                {specialInspections.length > 0 &&
                    specialInspections.map((specialInspection, idx) => {
                        if (Object.hasOwnProperty.call(specialInspection,'delete')) return null;
                        return (
                            <Row
                                key={idx}
                                className={'font-style' + (isEditorMode && ' clickable-accordion')}
                                onClick={() => handleClick(specialInspection)}
                                style={{
                                    ...(idx !== 0 ? { marginTop: 14 } : {}),
                                }}
                            >
                                <Col
                                    className="font-style"
                                    style={{
                                        width: 'calc(100% - 38px)',
                                    }}
                                >
                                    <Row gutter={[18, 1]}>
                                        <Col xs={24}>
                                            <Text>
                                                <IntlMessage id="personal.additional.checklist" />
                                            </Text>
                                            <Text>{specialInspection.number}</Text>
                                        </Col>
                                        <Col
                                            className="font-style"
                                            style={{ fontSize: '12px' }}
                                            xs={24}
                                        >
                                            <Text style={{ color: '#366EF6' }}>
                                                {moment(specialInspection.date_of_issue).format(
                                                    'DD.MM.YYYY',
                                                )}
                                            </Text>
                                            <Text className="ml-5">
                                                {specialInspection.issued_by}
                                            </Text>
                                        </Col>
                                    </Row>
                                </Col>
                                {specialInspection.document_link && (
                                    <Col
                                        className="font-style"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'end',
                                            width: '38px',
                                        }}
                                    >
                                        <FileTextTwoTone
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setModalState({
                                                    open: false,
                                                    link: specialInspection.document_link ?? '',
                                                });
                                            }}
                                            style={{ fontSize: '20px' }}
                                        />
                                    </Col>
                                )}
                            </Row>
                        );
                    })}
            </CollapseErrorBoundary>
        </>
    );
};
