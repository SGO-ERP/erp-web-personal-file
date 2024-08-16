import { Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFieldValue } from "store/slices/myInfo/myInfoSlice";
import uuidv4 from "utils/helpers/uuid";

const ModalSecondmentsAdd = ({ isOpen, onClose }) => {
    const [secondmentsOptions, setSecondmentsOptions] = useState([]);
    const [form] = useForm();
    const dispatch = useDispatch();
    const [disabledDatePicker, setDisabled] = useState(false);

    const { departments } = useSelector((state) => state.secondments);

    useEffect(() => {
        if (!isOpen) return;

        const options = departments.data.map((item) => ({
            value: item.id,
            label: LocalText.getName(item),
            object: item,
        }));

        setSecondmentsOptions(options);
    }, [isOpen]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const newSecondments = {
                staff_division: values.staff_division,
                date_from: values.date[0].toDate(),
                date_to: disabledDatePicker === true ? null : values.date[1].toDate(),
                id: uuidv4(),
                document_number: values.document_number,
            };

            dispatch(
                addFieldValue({
                    fieldPath: "allTabs.services.secondments",
                    value: newSecondments,
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

    const handleChange = (e) => {
        if (e.target.checked === true) {
            setDisabled(true);
        } else if (e.target.checked === false) {
            setDisabled(false);
        }
    };

    const disabled = () => {
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
                okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
                cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
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
                            showSearch
                            placeholder={
                                <IntlMessage id={"service.data.modalAcademicDegree.departament"} />
                            }
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
                                    disabled={disabled()}
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

export default ModalSecondmentsAdd;
