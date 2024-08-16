import React, { useState } from 'react';
import moment from 'moment';

import { FileTextTwoTone } from '@ant-design/icons';

import { Col, Row, Typography } from 'antd';

import IntlMessage from 'components/util-components/IntlMessage';
import CollapseErrorBoundary from 'views/app-views/service/data/personal/common/CollapseErrorBoundary';

import { components } from 'API/types';
import { useAppSelector } from 'hooks/useStore';

import { ListModalProps } from './types';
import OffenseEditModal from '../modals-edit/OffenseEditModal';
import LocalizationText, {
    LocalText, useLocalizationOnlyText
} from "../../../../../../../../components/util-components/LocalizationText/LocalizationText";

const { Text } = Typography;

type Offense = components['schemas']['ViolationRead'];

type OffensesListProps = {
    offenses: Offense[];
} & ListModalProps;

export const OffensesList = (props: OffensesListProps) => {
    const { offenses, source = 'get', setModalState } = props;

    const [currentOffense, setCurrentOffense] = useState<Offense>();
    const [isOffenseEditModalOpen, setIsOffenseEditModalOpen] = useState<boolean>(false);

    const isEditorMode = useAppSelector((state) => state.myInfo.modeRedactor);
    const { getLocalizationTextExact } = useLocalizationOnlyText();

    const handleClick = (offense: Offense) => {
        if (!isEditorMode) return;

        setCurrentOffense(offense);
        setIsOffenseEditModalOpen(true);
    };

    if (!offenses) return null;

    return (
        <>
            {currentOffense && (
                <OffenseEditModal
                    isOpen={isOffenseEditModalOpen}
                    offense={currentOffense}
                    onClose={() => setIsOffenseEditModalOpen(false)}
                    source={source}
                />
            )}

            <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
                {offenses.length > 0 &&
                    offenses.map((offense, idx) => {
                        if (Object.hasOwnProperty.call(offense,'delete')) return null;

                        return (
                            <Row
                                key={idx}
                                onClick={() => handleClick(offense)}
                                style={{
                                    ...(idx !== 0 ? { marginTop: 14 } : {}),
                                }}
                            >
                                <Col
                                    className="font-style"
                                    xs={20}
                                >
                                    <Row gutter={[16,16]}>
                                        <Col className="font-style" xs={24}>
                                            <Text>{<LocalizationText text={offense} /> ?? ''}</Text>
                                        </Col>
                                        <Col
                                            className="font-style text-muted"
                                            xs={8}
                                        >
                                            <IntlMessage id="personal.additional.offenceList.date" />
                                        </Col>
                                        <Col
                                            className="font-style"
                                            xs={16}
                                        >
                                            {moment(offense.date).format('DD.MM.YYYY')}
                                        </Col>
                                        <Col
                                            className="font-style text-muted"
                                            xs={8}
                                        >
                                            <IntlMessage id="personal.additional.offenceList.committedBy" />
                                        </Col>
                                        <Col
                                            className="font-style"
                                            xs={16}
                                        >
                                            {getLocalizationTextExact(offense,'issued_by') ?? ''}
                                        </Col>
                                        <Col
                                            className="font-style text-muted"
                                            xs={8}
                                        >
                                            <IntlMessage id="personal.additional.offenceList.articleNumber" />
                                        </Col>
                                        <Col
                                            className="font-style"
                                            xs={16}
                                        >
                                            {getLocalizationTextExact(offense,'article_number') ?? ''}
                                        </Col>
                                        <Col
                                            className="font-style text-muted"
                                            xs={8}
                                        >
                                            <IntlMessage id="personal.additional.offenceList.consequences" />
                                        </Col>
                                        <Col
                                            className="font-style"
                                            xs={16}
                                        >
                                            {getLocalizationTextExact(offense,'consequence') ?? ''}
                                        </Col>
                                    </Row>
                                </Col>
                                {offense.document_link && (
                                    <Col
                                        className="font-style"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'end',
                                        }}
                                        xs={4}
                                    >
                                        <FileTextTwoTone
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setModalState({
                                                    open: false,
                                                    link: offense.document_link ?? '',
                                                });
                                            }}
                                            style={{ fontSize: "20px" }}
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
