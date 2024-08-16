import React, { useState } from 'react';
import { Checkbox, Col, Form, Input, Modal, Row } from 'antd';
import { QuestionCircleFilled } from '@ant-design/icons/lib/icons';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';

export default function ModalDepartament({ modalCase, openModal }) {
    const [openFunction, setOpenFunction] = useState(false);
    const [form] = Form.useForm();

    const handleOk = () => {
        setOpenFunction(false);
        modalCase.showModalFunction(openFunction);
    };

    function handleCancel() {
        setOpenFunction(false);
        modalCase.showModalFunction(openFunction);
        form.resetFields();
    }
    const Departament = () => {
        return (
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col xs={24}>
                        <Form.Item
                            label={
                                <span style={{ fontSize: '14px' }}>
                                    Название на русском
                                    <QuestionCircleFilled
                                        style={{
                                            color: ' rgba(114, 132, 154, 0.4)',
                                            marginLeft: '5px',
                                        }}
                                    />
                                </span>
                            }
                        >
                            <Input plaxeholder={'Второй отдел'} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <span style={{ fontSize: '14px' }}>
                                    Название на казахском
                                    <QuestionCircleFilled
                                        style={{
                                            color: ' rgba(114, 132, 154, 0.4)',
                                            marginLeft: '5px',
                                        }}
                                    />
                                </span>
                            }
                        >
                            <Input plaxeholder={'Екинши болимше'} />
                        </Form.Item>
                        <Form.Item>
                            <Checkbox>
                                <IntlMessage id={'schedule.modal.combatUnit'} />
                            </Checkbox>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    };

    return (
        <div>
            <Modal
                title={<IntlMessage id={'schedule.modal.divisionName'} />}
                open={openModal}
                onCancel={handleCancel}
                onOk={handleOk}
                okText={<IntlMessage id={'staffSchedule.save'} />}
                cancelText={<IntlMessage id={'staffSchedule.cancel'} />}
                style={{ height: '100%', width: '100%' }}
            >
                <Departament />
            </Modal>
        </div>
    );
}
