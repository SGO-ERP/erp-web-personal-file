import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteByPath } from "../../../../../../../store/slices/myInfo/servicesSlice";
import { addFieldValue, replaceByPath } from "store/slices/myInfo/myInfoSlice";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";

const ModalSecondmentsEdit = ({ isOpen, onClose, source = "get", secondment }) => {
    const [secondmentsOptions, setSecondmentsOptions] = useState([]);
    const [disabled, setDisabled] = useState(true);
    const [form] = useForm();
    const dispatch = useDispatch();
    const [disabledDatePicker, setDisabledDatePicker] = useState(false);

    const { departments } = useSelector((state) => state.secondments);

    useEffect(() => {
        const options = departments.data.map((item) => ({
            value: item.id,
            label: LocalText.getName(item),
            object: item,
        }));

        setSecondmentsOptions(options);
    }, [isOpen, secondment]);

    useEffect(() => {
        if (disabled) {
            form.resetFields();

            const values = {
                staff_division: secondment.staff_division,
                date: [
                    moment(secondment.date_from),
                    secondment.date_to ? moment(secondment.date_to) : "",
                ],
                document_number: secondment.document_number,
            };
            if (secondment.date_to === null) {
                setDisabledDatePicker(true);
            }
            form.setFieldsValue(values);
        }
    }, [form, secondment, isOpen]);

    const changeDispatchValues = (obj) => {
        if (source === "get") {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: "serviceData.secondments",
                    id: obj.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: "edited.services.secondments",
                    value: obj,
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: "edited.services.secondments",
                    id: obj.id,
                    newObj: obj,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.services.secondments",
                    id: obj.id,
                    newObj: obj,
                }),
            );
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const newSecondments = {
                staff_division: values.staff_division,
                date_from: values.date[0].toDate(),
                date_to: disabledDatePicker === true ? null : values.date[1].toDate(),
                id: secondment.id,
                document_number: values.document_number,
                staff_division_id: values.staff_division,
            };
            changeDispatchValues(newSecondments);
            handleClose();
        } catch (error) {
            console.log("Form validation error", error);
        }
    };

    const handleDelete = () => {
        changeDispatchValues({ id: secondment.id, delete: true });
        handleClose();
    };

    const handleClose = () => {
        form.resetFields();
        setDisabled(true);
        onClose();
    };

    const handleChange = (e) => {
        if (e.target.checked === true) {
            setDisabledDatePicker(true);
        } else if (e.target.checked === false) {
            setDisabledDatePicker(false);
        }
    };

    const disabledDateCheck = () => {
        if (disabledDatePicker === true) {
            return [false, true];
        }
        return [false, false];
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
                            <IntlMessage id="personal.services.secondment" />
                        </span>
                    </div>
                }
                open={isOpen}
                onCancel={handleClose}
                onOk={handleOk}
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
                    <Form.Item
                        label={<IntlMessage id={"service.data.modalAcademicDegree.departament"} />}
                        name="staff_division"
                        rules={[
                            {
                                required: true,
                                message: (
                                    <IntlMessage id="service.data.modalAcademicDegree.chooseDepartament" />
                                ),
                            },
                        ]}
                    >
                        <Select
                            options={secondmentsOptions}
                            filterOption={(inputValue, option) =>
                                option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                            }
                            placeholder={
                                <IntlMessage id={"service.data.modalAcademicDegree.departament"} />
                            }
                            showSearch
                        />
                    </Form.Item>
                    <Row gutter={6}>
                        <Col xs={15}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: "14px" }}>
                                        <IntlMessage id="contract.period.service" />
                                    </span>
                                }
                                name="date"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="contract.period.service.enter" />,
                                    },
                                ]}
                                required
                                style={{ marginBottom: 0 }}
                            >
                                <DatePicker.RangePicker
                                    style={{ width: "100%" }}
                                    disabled={disabledDateCheck()}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={9}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: "14px" }}>
                                        <IntlMessage id="service.data.modalAddPsycho.docInfo" />
                                    </span>
                                }
                                name="document_number"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <IntlMessage id="service.data.modalAddPsycho.chooseDoc" />
                                        ),
                                    },
                                ]}
                                required
                                style={{ marginBottom: 0 }}
                            >
                                <Input
                                    placeholder={IntlMessageText.getText({
                                        id: "service.data.modalAddPsycho.docNum",
                                    })}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name={"checkbox"}>
                        <Checkbox
                            defaultChecked={disabledDatePicker}
                            onChange={(e) => {
                                handleChange(e);
                            }}
                        >
                            <IntlMessage id={"present"} />
                        </Checkbox>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ModalSecondmentsEdit;
