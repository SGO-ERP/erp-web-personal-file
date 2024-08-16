import React from 'react';

import { Button, Modal, Typography } from 'antd';

import IntlMessage from 'components/util-components/IntlMessage';
import { components } from 'API/types';

import { ModalProps } from './types';
import { AbroadTripsList } from '../lists/AbroadTripsList';

const { Text } = Typography;

type AbroadTrip = components['schemas']['AbroadTravelRead'];

type Props = {
    abroadTrips: AbroadTrip[];
} & ModalProps;

export const AbroadTripsDetailsModal = ({ isOpen, abroadTrips, onClose }: Props) => {
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
                    <AbroadTripsList abroadTrips={abroadTrips} />
                </div>
            </Modal>
        </div>
    );
};
