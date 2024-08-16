import { Form, Input, message, Modal, Spin } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import IntlMessage from '../../../../../components/util-components/IntlMessage';
import { APP_PREFIX_PATH } from '../../../../../configs/AppConfig';
import { candidatesUpdateStatus } from '../../../../../store/slices/candidates/candidateArchiveSlice';
import './style.css';

export default function CompleteStudy({ modalCase, openModal, id }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [reason, setReason] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        setReason(event.target.value);
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        modalCase.showModalCompleteStudy(isModalOpen);
    };
    const onOk = async () => {
        try {
            setLoading(true);

            await form.validateFields(); // Валидация формы
            const values = await form.getFieldsValue(); // Получение значений полей формы
            const { EDS } = values;
            if (EDS !== '123456') {
                message.error(<IntlMessage id={'eds'} />);
                throw new Error(<IntlMessage id={'eds'} />);
            }

            await dispatch(candidatesUpdateStatus({ candidate_id: id, reason: reason }))
                .then(() => {
                    navigate(`${APP_PREFIX_PATH}/management/candidates/list`);
                    handleCancel();
                    modalCase.showModalCompleteStudy(isModalOpen);
                })
                .finally(() => {
                    setLoading(false);
                });
        } catch (error) {
            setLoading(false);
            console.log('Form validation error', error);
        }
    };

    return (
        <div>
            <Modal
                title={<IntlMessage id={'candidates.title.removal'} />}
                open={openModal}
                onOk={onOk}
                okText={<IntlMessage id={'candidates.title.signAndFinish'} />}
                onCancel={handleCancel}
                cancelText={<IntlMessage id={'candidates.warning.cancel'} />}
            >
                <Spin spinning={loading} size="large">
                    <Form layout={'vertical'} form={form}>
                        <Form.Item
                            label={<IntlMessage id={'candidates.title.reason'} />}
                            name={'reason'}
                            rules={[
                                {
                                    required: true,
                                    message: <IntlMessage id={'candidates.title.must'} />,
                                },
                            ]}
                        >
                            <Input value={reason} onChange={handleChange} />
                        </Form.Item>
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
                </Spin>
            </Modal>
        </div>
    );
}
