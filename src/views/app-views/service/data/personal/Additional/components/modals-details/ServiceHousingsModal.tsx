import React from 'react';

import { Button, Modal, Typography } from 'antd';

import IntlMessage from 'components/util-components/IntlMessage';
import { components } from 'API/types';

import { ModalProps } from './types';
import { AbroadTripsList } from '../lists/AbroadTripsList';
import { ServiceHousingsList } from '../lists/ServiceHousingsList';

const { Text } = Typography;

type ServiceHousings = components['schemas']['ServiceHousingRead'];

type Props = {
    serviceHousings: ServiceHousings[];
} & ModalProps;

export const ServiceHousingsModal = ({ isOpen, serviceHousings, onClose }: Props) => {
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
                    <ServiceHousingsList serviceHousings={serviceHousings} />
                </div>
            </Modal>
        </div>
    );
};
