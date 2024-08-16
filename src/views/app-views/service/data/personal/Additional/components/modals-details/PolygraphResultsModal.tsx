import React from 'react';

import { Button, Modal, Typography } from 'antd';

import { ModalProps } from './types';
import IntlMessage from 'components/util-components/IntlMessage';
import { components } from 'API/types';
import { PolygraphResultsList } from '../lists/PolygraphResultsList';
const { Text } = Typography;
type PolygraphResultsList = components['schemas']['PolygraphCheckRead'];

type Props = {
    polygraphResults: PolygraphResultsList[];
} & ModalProps;

export const PolygraphResultsModal = ({ isOpen, polygraphResults, onClose }: Props) => {
    return (
        <Modal
            title={
                <Text style={{ fontSize: '14px' }}>
                    <IntlMessage id="personal.additional.additionalInformation" />
                </Text>
            }
            open={isOpen}
            onCancel={onClose}
            footer={
                <Button type="primary" onClick={onClose} style={{ fontWeight: 500 }}>
                    ОК
                </Button>
            }
            width={800}
        >
            <div
                style={{
                    maxHeight: '500px',
                    overflowY: 'auto',
                }}
            >
                <PolygraphResultsList polygraphResults={polygraphResults} />
            </div>
        </Modal>
    );
};
