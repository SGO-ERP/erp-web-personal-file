import React, { useState } from 'react';
import moment from 'moment';

import { FileTextTwoTone } from '@ant-design/icons';

import { Col, Row, Typography } from 'antd';

import IntlMessage from 'components/util-components/IntlMessage';
import CollapseErrorBoundary from 'views/app-views/service/data/personal/common/CollapseErrorBoundary';

import { components } from 'API/types';
import { useAppSelector } from 'hooks/useStore';

import { ListModalProps } from './types';
import ModalAddPsychoEdit from '../../modals/ModalAddPsychoEdit';

const { Text } = Typography;

type PsychoChar = components['schemas']['PsychologicalCheckRead'];

type PsychoCharsListProps = {
    psychoChars: PsychoChar[];
} & ListModalProps;

export const PsychoCharsList = (props: PsychoCharsListProps) => {
    const { psychoChars, source, setModalState } = props;

    const [currentPsychoChar, setCurrentPsychoChar] = useState<PsychoChar>();
    const [isPsychoCharEditModalOpen, setIsPsychoCharEditModalOpen] = useState(false);

    const isEditorMode = useAppSelector((state) => state.myInfo.modeRedactor);

    const handleClick = (psychoChar: PsychoChar) => {
        if (!isEditorMode) {
            return;
        }

        setCurrentPsychoChar(psychoChar);
        setIsPsychoCharEditModalOpen(true);
    };

    return (
        <>
            {currentPsychoChar && (
                <ModalAddPsychoEdit
                    psychoObject={currentPsychoChar}
                    isOpen={isPsychoCharEditModalOpen}
                    onClose={() => setIsPsychoCharEditModalOpen(false)}
                    source={source}
                />
            )}
            <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
                {psychoChars.length > 0 &&
                    psychoChars.map((psychoChar, idx) => {
                        if (Object.hasOwnProperty.call(psychoChar,'delete')) return null;
                        return (
                            <Row
                                key={idx}
                                className={'font-style' + (isEditorMode && ' clickable-accordion')}
                                onClick={() => handleClick(psychoChar)}
                                style={{
                                    ...(idx !== 0 ? { marginTop: 14 } : {}),
                                }}
                            >
                                <Col
                                    className="font-style"
                                    xs={20}
                                >
                                    <Row gutter={[18, 1]}>
                                        <Col className="font-style" xs={24}>
                                            <IntlMessage id="personal.additional.psychological" />
                                        </Col>
                                        <Col
                                            className="font-style"
                                            style={{ fontSize: '12px' }}
                                            xs={24}
                                        >
                                            <Text style={{ color: '#366EF6' }}>
                                                {moment(psychoChar.date_of_issue).format(
                                                    'DD.MM.YYYY',
                                                )}
                                            </Text>
                                            <Text className="ml-5">
                                                {psychoChar.issued_by || ''}
                                            </Text>
                                        </Col>
                                    </Row>
                                </Col>
                                {psychoChar.document_link && (
                                    <Col
                                        className="font-style"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'end'
                                        }}
                                        xs={4}
                                    >
                                        <FileTextTwoTone
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setModalState({
                                                    open: false,
                                                    link: psychoChar.document_link ?? '',
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
