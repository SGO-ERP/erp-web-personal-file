import React, { useState } from 'react';
import moment from 'moment';

import { FileTextTwoTone } from '@ant-design/icons';

import { Col, Row, Typography } from 'antd';

import IntlMessage from 'components/util-components/IntlMessage';
import CollapseErrorBoundary from 'views/app-views/service/data/personal/common/CollapseErrorBoundary';

import { components } from 'API/types';
import { useAppSelector } from 'hooks/useStore';

import { ListModalProps } from './types';

import ModalEditPolygraphCheck from '../../modals/ModalEditPolygraphCheck';

const { Text } = Typography;

type PolygraphResult = components['schemas']['PolygraphCheckRead'];

type PolygraphResultsListProps = {
    polygraphResults: PolygraphResult[];
} & ListModalProps;

export const PolygraphResultsList = (props: PolygraphResultsListProps) => {
    const { polygraphResults, source, setModalState } = props;

    const [currentPolygraphResult, setCurrentPolygraphResult] = useState<PolygraphResult>();
    const [isPolygraphResultEditModalOpen, setIsPolygraphResultEditModalOpen] = useState(false);

    const isEditorMode = useAppSelector((state) => state.myInfo.modeRedactor);


    const handleClick = (polygraphResult: PolygraphResult) => {
        if (!isEditorMode) return;

        setCurrentPolygraphResult(polygraphResult);
        setIsPolygraphResultEditModalOpen(true);
    };

    if (!polygraphResults) return null;

    return (
        <>
            {currentPolygraphResult && (
                <ModalEditPolygraphCheck
                    polygraphObject={currentPolygraphResult}
                    isOpen={isPolygraphResultEditModalOpen}
                    onClose={() => setIsPolygraphResultEditModalOpen(false)}
                    source={source}
                />
            )}
            <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
                {polygraphResults.length > 0 &&
                    polygraphResults.map((polygraphResult, idx) => {
                        if (Object.hasOwnProperty.call(polygraphResult,'delete')) return null;
                        return (
                            <Row
                                key={idx}
                                className={'font-style' + (isEditorMode && ' clickable-accordion')}
                                onClick={() => handleClick(polygraphResult)}
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
                                            Полиграф №{polygraphResult.number}
                                        </Col>
                                        <Col
                                            className="font-style"
                                            style={{ fontSize: '12px' }}
                                            xs={24}
                                        >
                                            <Text style={{ color: '#366EF6' }}>
                                                {moment(polygraphResult.date_of_issue).format(
                                                    'DD.MM.YYYY',
                                                )}
                                            </Text>
                                            <Text className="ml-5">
                                                {polygraphResult.issued_by}
                                            </Text>
                                        </Col>
                                    </Row>
                                </Col>
                                    {polygraphResult.document_link === null ||
                                    polygraphResult.document_link === undefined ? null : (
                                        <Col  style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'end',
                                        }}
                                              xs={4}>
                                            <FileTextTwoTone
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setModalState({
                                                        open: false,
                                                        link: polygraphResult.document_link ?? '',
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
