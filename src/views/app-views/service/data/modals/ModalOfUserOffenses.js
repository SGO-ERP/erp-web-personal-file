import { Button, Col, Modal, Radio, Row, Table } from 'antd';
import moment from 'moment/moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import IntlMessage from '../../../../../components/util-components/IntlMessage';
import { OffensesList } from '../personal/Additional/components/lists/OffensesList';
const ModalOfUserOffenses = ({ isOpen, onClose }) => {
    const additionalDataRemote = useSelector((state) => state.additional.additional.data); //there are error

    return (
        <div>
            <Modal
                title={<IntlMessage id="personal.additional.additionalInformation" />}
                open={isOpen}
                onCancel={onClose}
                footer={null}
                width={800}
            >
                <OffensesList offences={additionalDataRemote.violations} />
                <Row style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <Col>
                        <Button type={'primary'} onClick={onClose}>
                            Ок
                        </Button>
                    </Col>
                </Row>
            </Modal>
        </div>
    );
};

export default ModalOfUserOffenses;
