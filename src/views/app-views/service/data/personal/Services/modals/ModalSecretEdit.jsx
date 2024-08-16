import { DatePicker, Form, Modal, Row, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import IntlMessage, { IntlMessageText } from 'components/util-components/IntlMessage';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setFieldValue } from 'store/slices/myInfo/myInfoSlice';
import { PrivateServices } from 'API';

const ModalSecretEdit = ({ isOpen, onClose, secret }) => {
    const [formsOptions, setFormsOptions] = useState([]);
    const [form] = useForm();
    const [change, setChange] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!isOpen) return;

        fetchForms();
    }, [isOpen]);

    const fetchForms = async () => {
        const forms = await PrivateServices.get('/api/v1/privelege_emergencies/forms/');
        const keys = Object.keys(forms.data);

        setFormsOptions(keys.map((item) => ({ value: item, label: forms.data[item] })));
    };

    useEffect(() => {
        if (!secret) return;
        form.resetFields();
        const values = {
            date: [moment(secret.date_from), moment(secret.date_to)],
            form: secret.form,
        };
        form.setFieldsValue(values);
    }, [isOpen, form, secret]);

    const disabledDate = (current) => {
        return current && current > moment().startOf('day');
    };


    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const newSecret = {
                form: change===true ? values.form : formsOptions.find((item) => item.label === values.form).value,
                date_from: moment(values.date[0]),
                date_to: moment(values.date[1]),
                id: secret?.id ? secret.id : null,
            };


            dispatch(
                setFieldValue({
                    fieldPath: 'edited.services.privilege_emergency_secrets',
                    value: newSecret,
                }),
            );

            handleClose();
        } catch (error) {
            console.log('Form validation error', error);
        }
    };

    const handleClose = () => {
        form.resetFields();
        setChange(false);
        onClose();
    };

    return (
        <div>
            <Modal
                title={<IntlMessage id="secret.title" />}
                open={isOpen}
                onCancel={handleClose}
                onOk={handleOk}
                okText={<IntlMessage id={'service.data.modalAddPsycho.save'} />}
                cancelText={<IntlMessage id={'service.data.modalAddPsycho.cancel'} />}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label={<IntlMessage id="secret.date" />}
                        name="date"
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id="secret.date.enter" />,
                            },
                        ]}
                        required
                    >
                        <DatePicker.RangePicker
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item
                        label={<IntlMessage id="secret.form" />}
                        name="form"
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id="secret.form.enter" />,
                            },
                        ]}
                        required
                    >
                        <Select
                            placeholder={IntlMessageText.getText({
                                id: 'secret.form',
                            })}
                            options={formsOptions}
                            onChange={() => setChange(true)}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ModalSecretEdit;
