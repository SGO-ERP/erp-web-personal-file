import { Cascader, Form, Input, message, Modal } from 'antd';
import React, { useState } from 'react';
import './style.css';
import IntlMessage from '../../../../../components/util-components/IntlMessage';

export default function SignECP2({ modalCase, openModal, handleDispatch }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const handleCancel = () => {
        setIsModalOpen(false);
        modalCase.showModalDigitalSignature(isModalOpen);
    };
    const onOk = async () => {
        try {
            await form.validateFields(); // Валидация формы
            const values = await form.getFieldsValue(); // Получение значений полей формы
            const { EDS } = values;
            if (EDS !== '123456') {
                message.error(<IntlMessage id={'eds'} />);
                throw new Error(<IntlMessage id={'eds'} />);
            }
            // Дополнительная логика для сохранения данных
            // modalCase.showModalDigitalSignature(isModalOpen);
            await handleDispatch();
            form.resetFields();
            handleCancel();
        } catch (error) {
            console.log('Form validation error', error);
        }
    };
    return (
        <div>
            <Modal
                title={<IntlMessage id={'candidates.title.signEDS'} />}
                open={openModal}
                onOk={onOk}
                okText={<IntlMessage id={'candidates.title.send'} />}
                cancelText={<IntlMessage id={'candidates.warning.cancel'} />}
                onCancel={handleCancel}
            >
                <Form layout={'vertical'} form={form}>
                    <Form.Item
                        label={<IntlMessage id={'candidates.title.password'} />}
                        name={'EDS'}
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={'candidates.title.must'} />,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
