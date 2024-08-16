import React from 'react';
import { Button, Modal } from 'antd';

import IntlMessage from 'components/util-components/IntlMessage';
import { components } from 'API/types';

import { ModalProps } from './types';
import { OffensesList } from '../lists/OffensesList';

type Offense = components['schemas']['ViolationRead'];

type Props = {
    offenses: Offense[];
} & ModalProps;

export const OffensesModal = ({ isOpen, offenses, onClose }: Props) => {
    return (
        <div>
            <Modal
                title={<IntlMessage id="personal.additional.additionalInformation" />}
                open={isOpen}
                onCancel={onClose}
                footer={
                    <Button type="primary" onClick={onClose}>
                        ОК
                    </Button>
                }
                width={800}
            >
                <div
                    style={{
                        maxHeight: '500px',
                        overflowY: 'scroll',
                    }}
                >
                    <OffensesList offenses={offenses} />
                </div>
            </Modal>
        </div>
    );
};
