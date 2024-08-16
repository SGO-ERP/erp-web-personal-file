import { Button, Select, Col, DatePicker, Form, Input, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import { disabledDateAfter } from "utils/helpers/futureDateHelper";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { useAppSelector } from "hooks/useStore";
import { PrivateServices } from "API";
import { useDispatch } from "react-redux";
import { addFieldValue, setFieldValue } from "store/slices/myInfo/myInfoSlice";
import moment from "moment";
import { deleteByPath } from "store/slices/myInfo/servicesSlice";
import { PERMISSION } from "constants/permission";

const ModalEditServiceCertificate = ({ isOpen, onClose, serviceID, source }) => {
    const [form] = Form.useForm();
    const [status, setStatuses] = useState([]);

    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    const dispatch = useDispatch();

    const onCancel = () => {
        form.resetFields();
        onClose();
    };

    useEffect(() => {
        PrivateServices.get("/api/v1/service_idstatuses/").then((responce) => {
            if (responce.data) {
                setStatuses(responce.data);
            }
        });
    }, []);

    const statuses = (status_of) => {
        let a;
        if (status_of === "Получен") {
            a = "RECEIVED";
        } else if (status_of === "Утерян") {
            a = "LOST";
        } else if (status_of === "Не получен") {
            a = "NOT_RECEIVED";
        } else if (status_of === "RECEIVED") {
            a = "RECEIVED";
        } else if (status_of === "LOST") {
            a = "LOST";
        } else if (status_of === "NOT_RECEIVED") {
            a = "NOT_RECEIVED";
        }
        return a;
    };

    const handleOk = () => {
        const values = form.getFieldsValue();

        const id = {
            ...(source === "remote" && {
                id: serviceID.id,
            }),
        };

        const newObject = {
            ...id,
            number: values.number,
            token_number: values.token_number,
            date_to: moment(values.date).format("YYYY-MM-DD"),
            token_status: statuses(values.token),
            id_status: statuses(values.id),
        };

        changeDispatchValues(newObject);
    };

    useEffect(() => {
        if (status.length > 0 && source === "local") {
            form.resetFields();
            const id = status.find((item) => item.name === serviceID.id_status).value;
            const token = status.find((item) => item.name === serviceID.token_status).value;
            form.setFieldsValue({
                number: serviceID.number,
                date: serviceID.date_to !== null && moment(serviceID.date_to),
                id: id,
                token: token,
                token_number: serviceID.token_number,
            });
        } else if (source === "remote") {
            form.setFieldsValue({
                number: serviceID.number,
                date: serviceID.date_to !== null && moment(serviceID.date_to),
                id: serviceID.id_status,
                token: serviceID.token_status,
                token_number: serviceID.token_number,
            });
        }
    }, [serviceID, form, status, isOpen]);

    const changeDispatchValues = (obj, type) => {
        if (type) {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: "serviceData.service_id_info",
                    id: obj.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: "edited.services.service_id_info",
                    value: obj,
                }),
            );
        }
        if (source === "remote") {
            dispatch(
                setFieldValue({
                    fieldPath: "edited.services.service_id_info",
                    value: { ...obj },
                }),
            );
        } else if (source === "local") {
            dispatch(
                setFieldValue({
                    fieldPath: "allTabs.services.service_id_info",
                    value: { ...obj },
                }),
            );
        }

        form.resetFields();
        onClose();
    };

    const handleDelete = () => {
        changeDispatchValues({ id: serviceID.id, delete: true }, "delete");
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                title={
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginRight: "20px",
                            alignItems: "center",
                        }}
                    >
                        <span>
                            <IntlMessage id="service.udo.info" />
                        </span>
                    </div>
                }
                open={isOpen && isHR}
                onCancel={onCancel}
                footer={
                    <Row justify="end">
                        <Button danger onClick={handleDelete}>
                            <IntlMessage id={"initiate.deleteAll"} />
                        </Button>
                        <Button onClick={onCancel}>
                            <IntlMessage id={"service.data.modalAddPsycho.cancel"} />
                        </Button>
                        <Button type="primary" onClick={handleOk}>
                            <IntlMessage id={"service.data.modalAddPsycho.save"} />
                        </Button>
                    </Row>
                }
            >
                <Form form={form} layout="vertical">
                    <Row justify="space-between">
                        <Col xs={13}>
                            <Form.Item
                                label={
                                    <span>
                                        <IntlMessage id="badge.certificate" />
                                    </span>
                                }
                                name={"number"}
                                required
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={10}>
                            <Form.Item
                                label={
                                    <span>
                                        <IntlMessage id="service.date.end" />
                                    </span>
                                }
                                name="date"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="candidates.title.must" />,
                                    },
                                ]}
                                required
                            >
                                <DatePicker
                                    placeholder={IntlMessageText.getText({
                                        id: "personal.passport.validity",
                                    })}
                                    format="DD-MM-YYYY"
                                    name="date"
                                    disabledDate={disabledDateAfter}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label={
                            <span>
                                <IntlMessage id="badge.token_number" />
                            </span>
                        }
                        name={"token_number"}
                    >
                        <Input
                            placeholder={
                                IntlMessageText.getText({
                                    id: `badge.token_number`,
                                }) + "..."
                            }
                        />
                    </Form.Item>
                    <Row gutter={10}>
                        <Col xs={14}>
                            <Form.Item
                                label={
                                    <span>
                                        <IntlMessage id="service.has.udo" />
                                    </span>
                                }
                                name="id"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="candidates.title.must" />,
                                    },
                                ]}
                                required
                            >
                                <Select
                                    options={status.map((item) => {
                                        return {
                                            value: item.name,
                                            label: item.value,
                                        };
                                    })}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={10}>
                            <Form.Item
                                label={
                                    <span>
                                        <IntlMessage id="service.has.mark" />
                                    </span>
                                }
                                name="token"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="candidates.title.must" />,
                                    },
                                ]}
                                required
                            >
                                <Select
                                    options={status.map((item) => {
                                        return {
                                            value: item.name,
                                            label: item.value,
                                        };
                                    })}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default ModalEditServiceCertificate;
