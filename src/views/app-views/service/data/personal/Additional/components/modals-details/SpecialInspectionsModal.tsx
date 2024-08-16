import React from 'react';

import { Button, Modal, Typography } from 'antd';

import IntlMessage from 'components/util-components/IntlMessage';
import { components } from 'API/types';

import { ModalProps } from './types';
import { SpecialInspectionsList } from '../lists/SpecialInspectionsList';

const { Text } = Typography;

type specialInspections = components['schemas']['SpecialCheckRead'];

type Props = {
    specialInspections: specialInspections[];
} & ModalProps;

export const SpecialInspectionsModal = ({ isOpen, specialInspections, onClose }: Props) => {
    return (
        <div>
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
                    <SpecialInspectionsList specialInspections={specialInspections} />
                </div>
            </Modal>
        </div>
    );
};
