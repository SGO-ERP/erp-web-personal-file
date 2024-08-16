import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Col, Modal, Row } from 'antd';
import IntlMessage from 'components/util-components/IntlMessage';
import React from 'react';

interface Props {
    onClose: () => void;
    isOpen: boolean;
}

const ReplaceSubdivision = ({ isOpen, onClose }: Props) => {
    const handleOk = () => {
        onClose();
    };

    return (
        <Modal
            width={430}
            open={isOpen}
            onCancel={onClose}
            onOk={handleOk}
            okText="Да"
            cancelText="Нет"
        >
            <Row justify="center" style={{ display: 'flex', flexWrap: 'nowrap' }}>
                <Col lg={2}>
                    <ExclamationCircleOutlined style={{ fontSize: '1.4rem', color: '#FAAD14' }} />
                </Col>
                <Col>
                    <Col className="gutter-row">
                        <b>
                            <IntlMessage id="schedule.replace.modal.sub.division" />
                        </b>
                    </Col>
                    <br />
                    <Col className="gutter-row">
                        <IntlMessage id="schedule.replace.modal.action" />{' '}
                        <b>
                            &ldquo;
                            <IntlMessage id="schedule.replace.modal.action.what" />
                            &rdquo;.
                        </b>
                    </Col>
                </Col>
            </Row>
        </Modal>
    );
};

export default ReplaceSubdivision;
