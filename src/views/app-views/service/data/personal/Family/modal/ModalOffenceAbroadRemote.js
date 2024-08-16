import React, {useState} from 'react';
import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import {Button, Col, Modal, Radio, Row, Table} from 'antd';
import {LocalText} from '../../../../../../../components/util-components/LocalizationText/LocalizationText';
import moment from 'moment';
import {SwapRightOutlined} from '@ant-design/icons';
import OffenceListFamily from './OffenceListFamily';
import NoData from '../../NoData';

const ModalOffenceAbroadRemote = ({isOpen, onClose, data}) => {
    const [toggleType, setToggleType] = useState('offenses');
    const [object,setObject] = useState([]);

    const currentLocale = localStorage.getItem('lan');
    const [currentLanguage, setCurrentLanguage] = useState('rus');

    const columns = [
        {
            title: <IntlMessage id='personal.additional.overseasTravel.departureCountry'/>,
            dataIndex: 'name',
            render: (_, record) => (
                <>
                    {(  LocalText.getName(record?.destination_country)  )}
                </>
            ),
            key: 'name',
        },
        {
            title: <IntlMessage id='personal.additional.overseasTravel.departurePeriod'/>,
            dataIndex: 'period',
            render: (_, record) => (
                <>
                    {moment(record.date_from).format('DD.MM.YYYY')}{' '}
                    <SwapRightOutlined style={{color: '#72849A66'}}/>
                    {moment(record.date_to).format('DD.MM.YYYY')}
                </>
            ),
            key: 'period',
        },
        {
            title: <IntlMessage id='personal.additional.overseasTravel.departurePurpose'/>,
            dataIndex: 'reason',
            render: (_, record) => (
                <>
                    {(currentLocale === 'kk' ? record.reasonKZ : record.reason)}
                </>
            ),
            key: 'reason',
        }
    ];

    return (
        <div>
            <Modal
                title={<IntlMessage id='personal.additional.additionalInformation'/>}
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
                            value='offenses'
                            onClick={(e) => setToggleType(e.target.value)}
                        >
                            <IntlMessage id='personal.additional.offenses'/>
                        </Radio.Button>
                        <Radio.Button value='abroad' onClick={(e) => setToggleType(e.target.value)}>
                            <IntlMessage id='personal.additional.overseasTravel'/>
                        </Radio.Button>
                    </Radio.Group>
                </div>
                {toggleType === 'offenses' ? (
                    data?.violation?.length > 0
                        ?
                        <div style={{marginTop: '15px'}}>
                            <OffenceListFamily
                                offences={data?.violation}
                                setObject={setObject}
                                object={object}
                                currentLanguage={currentLanguage}
                            />
                        </div>
                        :
                        <NoData/>
                ) : (
                    data?.abroad_travel.length > 0 ?
                        <Table
                            columns={columns}
                            dataSource={data?.abroad_travel}
                            pagination={false}
                            style={{marginTop:'15px'}}
                            rowKey='id'
                        />
                        :
                        <NoData/>
                )}

                {
                        <Row style={{display: 'flex', justifyContent: 'flex-end', marginTop: '10px'}}>
                            <Col>
                                <Button type={'primary'} onClick={onClose}>
                                    Ок
                                </Button>
                            </Col>
                        </Row>
                }
            </Modal>
        </div>
    );
};

export default ModalOffenceAbroadRemote;
