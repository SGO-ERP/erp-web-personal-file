import { Card, Col, Row, Space, Typography } from 'antd';
import React from 'react';
import moment from 'moment';

const QrCard = ({ step }) => {
    return (
        <Card className="qr-card">
            <Row gutter={16}>
                <Col xs={24} sm={12} md={5}>
                    <img
                        src={`data:image/png;base64,${step.qr_base64}`}
                        alt="Qr code"
                        style={{ width: '100%' }}
                    />
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Space direction="vertical" size="middle">
                        <Typography.Text strong>
                            {step.step.staff_function.role.name}
                        </Typography.Text>
                        <Typography.Text strong>
                            Индивидуальный идентификационный номер
                        </Typography.Text>
                        <Typography.Text strong>Дата формирование подписи</Typography.Text>
                    </Space>
                </Col>
                <Col xs={24} sm={12} md={11}>
                    <Space direction="vertical" size="middle">
                        <Typography.Text>
                            {step.user.father_name ?? ''} {step.user.first_name} <br />{' '}
                            {step.user.last_name}
                        </Typography.Text>
                        <Typography.Text>{step.user.iin}</Typography.Text>
                        <Typography.Text>
                            {moment(step.signed_at).format('DD.MM.YYYY HH:mm:ss [UTC+6]')}
                        </Typography.Text>
                    </Space>
                </Col>
            </Row>
        </Card>
    );
};

export default QrCard;
