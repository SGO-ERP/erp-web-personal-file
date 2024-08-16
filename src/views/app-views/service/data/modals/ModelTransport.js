import React, { useState } from 'react';
import { Button, Col, Modal, Row, Table } from 'antd';
import IntlMessage from '../../../../../components/util-components/IntlMessage';
import { useLocalizationOnlyText } from 'components/util-components/LocalizationText/LocalizationText';

const ModelTransport = ({ modalCase, openModal, data, onClose }) => {
    const [openAllTransports, setOpenAllTransports] = useState(false);
    const { getLocalizationText } = useLocalizationOnlyText();

    const handleOk = () => {
        setOpenAllTransports(false);
        onClose();
        modalCase.showModalTransport(openAllTransports);
    };
    const handleCancel = () => {
        setOpenAllTransports(false);
        onClose();
        modalCase.showModalTransport(openAllTransports);
    };

    const columns = [
        {
            title: <IntlMessage id={'service.data.modalTransport.marka'} />,
            dataIndex: 'name',
            key: 'model',
            render: (_, data) => getLocalizationText(data),
        },
        {
            title: <IntlMessage id={'service.data.modalTransport.gosNumber'} />,
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: <IntlMessage id={'service.data.modalTransport.vinCode'} />,
            dataIndex: 'vin_code',
            key: 'vin_code',
        },
        {
            title: <IntlMessage id={'service.data.modalTransport.buyDate'} />,
            dataIndex: 'date_from',
            render: (text, record) => {
                const date = new Date(record.date_from);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = String(date.getFullYear());

                const formattedDate = `${day}-${month}-${year}`;
                return formattedDate;
            },
            key: 'date',
        },
    ];

    return (
        <div>
            <Modal
                title={<IntlMessage id={'personal.additional.vehicles'} />}
                open={openModal}
                onCancel={handleCancel}
                onOk={handleOk}
                footer={null}
                width={800}
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    scroll={{ y: data.length > 5 ? 300 : null }}
                />
                <Row style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <Col>
                        <Button type={'primary'} onClick={handleOk}>
                            Ок
                        </Button>
                    </Col>
                </Row>
            </Modal>
        </div>
    );
};

export default ModelTransport;
