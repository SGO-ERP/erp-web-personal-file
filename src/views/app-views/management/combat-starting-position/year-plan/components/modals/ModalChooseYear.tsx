import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Form, Modal, Select, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';

import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import { PrivateServices } from '../../../../../../../API';
import { APP_PREFIX_PATH } from '../../../../../../../configs/AppConfig';
import { useAppSelector } from '../../../../../../../hooks/useStore';
import { SCHEDULE_YEAR } from '../../../../../../../constants/AuthConstant';

const { Option } = Select;

interface Props {
    onClose: () => void;
    isOpen: boolean;
}
const ModalChooseYear = ({ isOpen, onClose }: Props) => {
    const [form] = useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const profile = useAppSelector((state) => state.profile.data);
    const currentYear = new Date().getFullYear();

    const navigate = useNavigate();

    const onOk = () => {
        const values = form.getFieldsValue();
        form.resetFields();
        setLoading(true);
        PrivateServices.post('/api/v1/plan/', {
            body: {
                year: values.year,
                creator_id: profile?.id,
            },
        }).then((r) => {
            if (r.data !== undefined) {
                setLoading(false);
                onClose();
                localStorage.removeItem(SCHEDULE_YEAR);
                navigate(
                    `${APP_PREFIX_PATH}/management/combat-starting-position/year-plan/create/?bsp-plan-id=${r.data.id}&year=${r.data.year}`,
                );
            }
        });
    };

    return (
        <Modal
            title={<IntlMessage id={'bsp.create.plan'} />}
            open={isOpen}
            onOk={onOk}
            onCancel={onClose}
            width={'700px'}
            okText={<IntlMessage id="initiate.create" />}
            cancelText={<IntlMessage id="staffSchedule.cancel" />}
        >
            <Spin spinning={loading}>
                <Form form={form} layout={'vertical'}>
                    <Form.Item
                        name="year"
                        label={<IntlMessage id={'csp.create.year.plan.setting.modal.form.title'} />}
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={'candidates.title.must'} />,
                            },
                        ]}
                    >
                        <Select style={{ width: '100%' }}>
                            <Option value={currentYear}>{currentYear}</Option>
                            <Option value={currentYear + 1}>{currentYear + 1}</Option>
                            <Option value={currentYear + 2}>{currentYear + 2}</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default ModalChooseYear;
