import { DatePicker, Form, Input, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setFieldValue } from "store/slices/myInfo/myInfoSlice";
import { disabledDate } from "utils/helpers/futureDateHelper";

const ModalOathEdit = ({ isOpen, onClose, oath }) => {
    const [form] = useForm();

    const dispatch = useDispatch();
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;

    useEffect(() => {
        if (!oath) return;
        form.resetFields();

        const values = {
            date: moment(oath.date),
            military_unit: oath.military_unit
                ? oath.military_unit
                : currentLanguage === "ru"
                ? oath.military_name
                : oath.military_nameKZ,
        };

        form.setFieldsValue(values);
    }, [isOpen, form, oath]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const newOath = {
                date: moment(values.date).format("YYYY-MM-DD"),
                military_unit: values.military_unit,
                id: oath?.id ?? null,
            };

            dispatch(
                setFieldValue({
                    fieldPath: "edited.services.oath",
                    value: newOath,
                }),
            );

            handleClose();
        } catch (error) {
            console.log("Form validation error", error);
        }
    };

    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    return (
        <div>
            <Modal
                title={<IntlMessage id="oath.edit" />}
                open={isOpen}
                onCancel={handleClose}
                onOk={handleOk}
                okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
                cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label={<IntlMessage id="oath.date" />}
                        name="date"
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id="oath.date.enter" />,
                            },
                        ]}
                        required
                    >
                        <DatePicker
                            placeholder={IntlMessageText.getText({
                                id: "oath.date.placeholder",
                            })}
                            style={{ width: "100%" }}
                            disabledDate={disabledDate}
                        />
                    </Form.Item>
                    <Form.Item
                        label={<IntlMessage id="oath.confirm" />}
                        name="military_unit"
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id="oath.date.enter" />,
                            },
                        ]}
                        required
                    >
                        <Input
                            placeholder={
                                <IntlMessage id={"service.data.modalAcademicDegree.degree"} />
                            }
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ModalOathEdit;
