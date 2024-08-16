import { Form, Input, message, Modal, notification, Spin } from 'antd';
import React, { useState } from 'react';
import './style.css';
import IntlMessage, {
    IntlMessageText,
} from '../../../../../components/util-components/IntlMessage';
import CandidatesService from '../../../../../services/candidates/CandidatesService';
import { candidatesAll } from '../../../../../store/slices/candidates/candidatesSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../../hooks/useStore';
import SignEcp from '../../../../../components/shared-components/SignEcp';
import { PERMISSION } from 'constants/permission';

export default function AddCandidate({ modalCase, openModal }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const profile = useAppSelector((state) => state.profile.data);
    const [isEcpOpen, setIsEcpOpen] = useState(false);

    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);

    const handleCancel = () => {
        form.resetFields(); // очистка формы после отправки
        setIsModalOpen(false);
        setIsEcpOpen(false);
        modalCase.showModalAddCandidate(isModalOpen);
    };

    const handleCandidateAdd = async () => {
        if (!isHR) {
            notification.error({
                message: <IntlMessage id={'schedule.not.hr'} />,
            });
            return;
        }

        try {
            setLoading(true);
            await form.validateFields();
            setIsEcpOpen(true);
        } catch (error) {
            setLoading(false);
            setIsEcpOpen(false);
        }
    };

    const onOk = async () => {
        try {
            setLoading(true);
            await form.validateFields();
            const values = await form.getFieldsValue(); // Получение значений полей формы
            const { IIN } = values;

            await CandidatesService.post_add_candidates(IIN)
                .then((r) => {
                    dispatch(candidatesAll({ page: 1, limit: 5 }));
                    form.resetFields(); // очистка формы после отправки
                    setIsEcpOpen(false);
                    handleCancel();
                    modalCase.showModalAddCandidate(isModalOpen);
                })
                .catch((err) => {
                    message.error(<IntlMessage id={'add.candidate.error'} />);
                })
                .finally(() => {
                    setLoading(false);
                    setIsEcpOpen(false);
                });
        } catch (error) {
            setLoading(false);
            setIsEcpOpen(false);
            console.log('Form validation error', error);
        }
    };
    return (
        <Modal
            title={<IntlMessage id={'candidates.title.addCandidate'} />}
            open={openModal}
            onOk={handleCandidateAdd}
            okText={<IntlMessage id={'candidates.title.send'} />}
            cancelText={<IntlMessage id={'candidates.warning.cancel'} />}
            onCancel={handleCancel}
        >
            <SignEcp callback={onOk} open={isEcpOpen} onClose={() => setIsEcpOpen(false)} />
            <Spin spinning={loading} size="large">
                <Form layout={'vertical'} form={form}>
                    <Form.Item
                        label={<IntlMessage id={'personal.family.IIN'} />}
                        name={'IIN'}
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={'candidates.title.must'} />,
                            },
                        ]}
                    >
                        <Input
                            placeholder={IntlMessageText.getText({ id: 'personal.family.IIN' })}
                            maxLength={12}
                            min={0}
                            onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                        />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
}
