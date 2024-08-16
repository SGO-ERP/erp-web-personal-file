import React, {useState} from 'react';
import moment from 'moment';

import {FileTextTwoTone} from '@ant-design/icons';

import {Col, Row, Typography} from 'antd';

import IntlMessage from 'components/util-components/IntlMessage';
import CollapseErrorBoundary from 'views/app-views/service/data/personal/common/CollapseErrorBoundary';

import {components} from 'API/types';
import {useAppSelector} from 'hooks/useStore';

import {ListModalProps} from './types';

import ModalTransportEdit from '../../modals/ModalTransportEdit';
import LocalizationText from '../../../../../../../../components/util-components/LocalizationText/LocalizationText';

const {Text} = Typography;

type Transport = components['schemas']['VehicleRead'];

type TransportsListProps = {
    transports: Transport[];
} & ListModalProps;

export const TransportsList = (props: TransportsListProps) => {
    const {transports, source = 'get', setModalState} = props;

    const [currentTransport, setCurrentTransport] = useState<Transport>();
    const [isTransportEditModalOpen, setIsTransportEditModalOpen] = useState<boolean>(false);

    const isEditorMode = useAppSelector((state) => state.myInfo.modeRedactor);

    const handleClick = (transport: Transport) => {
        if (!isEditorMode) return;

        setCurrentTransport(transport);
        setIsTransportEditModalOpen(true);
    };

    return (
        <>
            {currentTransport && (
                <ModalTransportEdit
                    vehicle={currentTransport}
                    isOpen={isTransportEditModalOpen}
                    onClose={() => setIsTransportEditModalOpen(false)}
                    source={source}
                />
            )}

            <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError"/>}>
                {transports.length > 0 &&
                    transports.map((transport, idx) => {
                        if (Object.hasOwnProperty.call(transport, 'delete')) return null;

                        return (
                            <Row
                                key={idx}
                                className={'font-style' + (isEditorMode && ' clickable-accordion')}
                                onClick={() => handleClick(transport)}
                                style={{
                                    ...(idx !== 0 ? {marginTop: 14} : {}),
                                }}
                            >
                                <Col
                                    className="font-style"
                                    xs={20}
                                >
                                    <Row gutter={[18, 1]}>
                                        <Col className="font-style" xs={24}>
                                            {<LocalizationText text={transport} />}
                                        </Col>
                                        <Col
                                            className="font-style"
                                            xs={24}
                                        >
                                            <Text style={{color: '#366EF6'}}>
                                                {moment(transport.date_from).format('DD.MM.YYYY')}
                                            </Text>
                                            <Text className="ml-5">
                                                {transport.number
                                                    ? transport.number
                                                        .split(' ')
                                                        .map((char) => char)
                                                    : ''}
                                            </Text>
                                        </Col>
                                    </Row>
                                </Col>
                                {transport.document_link && (
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
                                                    link: transport.document_link ?? '',
                                                });
                                            }}
                                            style={{fontSize: '20px'}}
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
