import { Button, Col, Modal, Radio, Row, Table } from 'antd';
import moment from 'moment/moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import IntlMessage from '../../../../../components/util-components/IntlMessage';
import { LocalText } from '../../../../../components/util-components/LocalizationText/LocalizationText';
import { SwapRightOutlined } from '@ant-design/icons';
import { OffensesList } from '../personal/Additional/components/lists/OffensesList';

const ModalOffenceAbroad = ({ isOpen, onClose }) => {
    const additionalDataRemote = useSelector((state) => state.additional.additional.data); //there are error
    const [toggleType, setToggleType] = useState('offenses');

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
            render: (_, record) => (
                <>
                    {moment(record.date_from).format('DD.MM.YYYY')}{' '}
                    <SwapRightOutlined style={{ color: '#72849A66' }} />
                    {moment(record.to).format('DD.MM.YYYY')}
                </>
            ),
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
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Radio.Group value={toggleType}>
                        <Radio.Button
                            value="offenses"
                            onClick={(e) => setToggleType(e.target.value)}
                        >
                            <IntlMessage id="personal.additional.offenses" />
                        </Radio.Button>
                        <Radio.Button value="abroad" onClick={(e) => setToggleType(e.target.value)}>
                            <IntlMessage id="personal.additional.overseasTravel" />
                        </Radio.Button>
                    </Radio.Group>
                </div>
                {toggleType === 'offenses' ? (
                    <OffensesList offences={additionalDataRemote.violations} />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={additionalDataRemote.abroad_travels}
                        pagination={false}
                    />
                )}

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

export default ModalOffenceAbroad;
