import { Button, Col, Modal, Radio, Row, Table } from 'antd';
import moment from 'moment/moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import IntlMessage from '../../../../../components/util-components/IntlMessage';
import { LocalText } from '../../../../../components/util-components/LocalizationText/LocalizationText';
const ModalOfUserAbroad = ({ isOpen, onClose }) => {
    const additionalDataRemote = useSelector((state) => state.additional.additional.data); //there are error

    const columns = [
        {
            title: <IntlMessage id="personal.additional.overseasTravel.departureCountry" />,
            dataIndex: 'name',
            render: (_, record) => LocalText.getName(record?.destination_country),
            key: 'name',
        },
        {
            title: <IntlMessage id="personal.additional.overseasTravel.departurePeriod" />,
            dataIndex: 'period',
            render: (_, record) => moment(record.to).format('DD.MM.YYYY'),
            key: 'period',
        },
        {
            title: <IntlMessage id="personal.additional.overseasTravel.departurePurpose" />,
            dataIndex: 'reason',
            key: 'reason',
        },
    ];

    return (
        <div>
            <Modal
                title={<IntlMessage id="personal.additional.additionalInformation" />}
                open={isOpen}
                onCancel={onClose}
                footer={null}
                width={800}
            >
                <Table
                    columns={columns}
                    dataSource={additionalDataRemote.abroad_travels}
                    pagination={false}
                />
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

export default ModalOfUserAbroad;
