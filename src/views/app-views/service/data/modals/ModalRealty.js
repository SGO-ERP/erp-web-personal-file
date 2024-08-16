import { Button, Col, Modal, Row, Table } from 'antd';
import { useState } from 'react';
import moment from 'moment';
import LocalizationText from '../../../../../components/util-components/LocalizationText/LocalizationText';
import LocalizationTextForPurchaseType from '../../../../../components/util-components/LocalizationText/LocalizationTextForPurchaseType';
import IntlMessage from '../../../../../components/util-components/IntlMessage';

const ModalRealty = ({ modalCase, openModal, data, onClose }) => {
    const [openAllRetail, setOpenAllRetail] = useState(false);

    const handleOk = () => {
        onClose();
        setOpenAllRetail(false);
        modalCase.showModalRetail(openAllRetail);
    };

    const handleCancel = () => {
        onClose();
        setOpenAllRetail(false);
        modalCase.showModalRetail(openAllRetail);
    };

    const columns = [
        {
            title: <IntlMessage id={'service.data.modalRealty.typeObject'} />,
            dataIndex: 'type',
            key: 'type',
            render: (text, record) => (
                <>
                    <LocalizationText text={record.type} />
                </>
            ),
        },
        {
            title: <IntlMessage id={'service.data.modalRealty.address'} />,
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: <IntlMessage id={'service.data.modalRealty.howBought'} />,
            dataIndex: 'purchase_type',
            render: (text, record) => (
                <>
                    <LocalizationTextForPurchaseType text={record} />
                </>
            ),
            key: 'purchase_type',
        },
        {
            title: <IntlMessage id={'service.data.modalRealty.buyDate'} />,
            dataIndex: 'date',
            render: (text, record) => <>{moment(record.purchase_date).format('DD.MM.YYYY')}</>,
            key: 'date',
        },
    ];

    return (
        <Modal
            title={<IntlMessage id={'service.data.modalRealty.transport'} />}
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
    );
};

export default ModalRealty;
