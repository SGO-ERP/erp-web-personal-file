import { Col, DatePicker, Form, Input, Row, Modal, Select, Button } from "antd";
import { useForm } from "antd/es/form/Form";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import moment from "moment";
import React from "react";
import { useDispatch } from "react-redux";
import { replaceByPath, setFieldValue } from "store/slices/myInfo/myInfoSlice";
import { deleteByPath } from "store/slices/myInfo/servicesSlice";
import { isTillTomorrow } from "utils/helpers/futureDateHelper";
import uuidv4 from "utils/helpers/uuid";

const defaultBeret = [
    {
        label: LocalText.getName({ name: "Присвоен", nameKZ: "Тағайындалды" }),
        value: 1,
    },
];

const ModalBeretEdit = ({ isOpen, onClose, info }) => {
    const [form] = useForm();
    const dispatch = useDispatch();

    const changeDispatchValues = (obj, source) => {
        if (source === "create") {
            dispatch(
                setFieldValue({
                    fieldPath: "allTabs.services.beret",
                    value: obj,
                }),
            );
        }
        if (source === "get") {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: "serviceData.general_information.black_beret",
                    id: obj.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                setFieldValue({
                    fieldPath: "edited.services.beret",
                    value: obj,
                }),
            );
        }
        if (source === "edited") {
            dispatch(
                setFieldValue({
                    fieldPath: "edited.services.beret",
                    value: obj,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.services.beret",
                    id: obj.id,
                    newObj: obj,
                }),
            );
        }

        handleClose();
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            if (!info) {
                changeDispatchValues(
                    {
                        document_number: values.document_number,
                        date_from: values.date_created,
                        form: values.admission_form,
                        is_badge_black: true,
                        id: info?.id ?? uuidv4(),
                        source: "added",
                    },
                    "create",
                );
            } else if (info?.id) {
                changeDispatchValues(
                    {
                        document_number: values.document_number,
                        date_from: values.date_created,
                        form: values.admission_form,
                        is_badge_black: true,
                        id: info?.id,
                        source: info.source ? info.source : "edited",
                    },
                    info.source ? info.source : "get",
                );
            }
        } catch (error) {
            console.log("Form validation error", error);
        }
    };

    const handleDelete = () => {
        changeDispatchValues({ delete: true, id: info.id }, "get");
    };

    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    return (
        <div>
            <Modal
                title={<IntlMessage id={"personal.beret.title"} />}
                open={isOpen}
                onCancel={handleClose}
                footer={
                    <Row justify="end">
                        <Button danger onClick={handleDelete}>
                            <IntlMessage id={"initiate.deleteAll"} />
                        </Button>
                        <Button onClick={handleClose}>
                            <IntlMessage id={"service.data.modalAddPsycho.cancel"} />
                        </Button>
                        <Button type="primary" onClick={handleOk}>
                            <IntlMessage id={"service.data.modalAddPsycho.save"} />
                        </Button>
                    </Row>
                }
            >
                <Form form={form} layout="vertical">
                    <Row style={{ fontWeight: "bold", height: 30 }}>
                        <span style={{ color: "red", marginRight: 5 }}>*</span>
                        <IntlMessage id={"service.data.modalAddPsycho.docInfo"} />
                    </Row>
                    <Row gutter={[10]} style={{ height: 50 }}>
                        <Col xs={12}>
                            <Form.Item
                                initialValue={info?.document_number}
                                name="document_number"
                                rules={[
                                    {
                                        message: (
                                            <IntlMessage
                                                id={"service.data.modalAddPsycho.chooseDoc"}
                                            />
                                        ),
                                        required: true,
                                    },
                                ]}
                            >
                                <Input
                                    placeholder={IntlMessageText.getText({
                                        id: "service.data.modalAddPsycho.docNum",
                                    })}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={12}>
                            <Form.Item
                                initialValue={info?.date_from && moment(info?.date_from)}
                                name="date_created"
                                rules={[
                                    {
                                        message: (
                                            <IntlMessage
                                                id={"service.data.modalAddPsycho.chooseDateCreate"}
                                            />
                                        ),
                                        required: true,
                                    },
                                ]}
                            >
                                <DatePicker style={{ width: "100%" }} disabledDate={isTillTomorrow} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24}>
                            <Form.Item
                                initialValue={defaultBeret[0].value}
                                label={<IntlMessage id={"secret.form"} />}
                                name="admission_form"
                                rules={[
                                    {
                                        message: <IntlMessage id={"secret.form.enter"} />,
                                        required: true,
                                    },
                                ]}
                            >
                                <Select
                                    disabled
                                    options={defaultBeret}
                                    placeholder={<IntlMessage id={"secret.form"} />}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default ModalBeretEdit;
