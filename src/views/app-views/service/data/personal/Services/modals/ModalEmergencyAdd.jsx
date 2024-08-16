import { Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import moment from "moment";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { addFieldValue } from "store/slices/myInfo/myInfoSlice";
import uuidv4 from "utils/helpers/uuid";
import LanguageSwitcher from "../../../../../../../components/shared-components/LanguageSwitcher";

const coefficientOptions = [
    {
        value: 1.0,
        label: "x1.0",
    },
    {
        value: 1.5,
        label: "x1.5",
    },
    {
        value: 2.0,
        label: "x2.0",
    },
    {
        value: 2.5,
        label: "x2.5",
    },
    {
        value: 3.0,
        label: "x3.0",
    },
];

const ModalEmergencyAdd = ({ isOpen, onClose }) => {
    const { t } = useTranslation();

    const [position, setPosition] = useState({ name: "", nameKZ: "" });
    const [staffDivision, setStaffDivision] = useState({ name: "", nameKZ: "" });
    const [approved, setApproved] = useState({ name: "", nameKZ: "" });
    const [isEmployee, setIsEmployee] = useState(true);
    const [stillWorking, setStillWorking] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState("rus");
    const [form] = useForm();

    const dispatch = useDispatch();

    const disabledDate = (current) => {
        return current && current > moment().startOf("day");
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const newContract = {
                position: {
                    name: position.name,
                    nameKZ: position.nameKZ,
                },
                staffDivision: {
                    name: staffDivision.name,
                    nameKZ: staffDivision.nameKZ,
                },
                is_employee: isEmployee,
                coefficient: values.coefficient,
                contractor_signer_name: {
                    name: approved.name,
                    nameKZ: approved.nameKZ,
                },
                date_credited: values.date_created.toDate(),
                date_from: stillWorking ? values.date.toDate() : values.date[0].toDate(),
                date_to: stillWorking ? null : values.date[1].toDate(),
                document_number: values.document_number,
                id: uuidv4(),
                percentage: values.percentage,
                source: "added",
            };

            dispatch(
                addFieldValue({
                    fieldPath: "allTabs.services.emergency_contracts",
                    value: newContract,
                }),
            );
            handleClose();
        } catch (error) {
            console.log("Form validation error", error);
        }
    };

    const handleClose = () => {
        form.resetFields();
        setPosition({ name: "", nameKZ: "" });
        setStaffDivision({ name: "", nameKZ: "" });
        setIsEmployee(true);
        setStillWorking(false);
        onClose();
    };

    const validateLocalizationPosition = () => {
        const isRusEmpty = position.name.trim() === "";
        const isKZEmpty = position.nameKZ.trim() === "";

        return new Promise((resolve, reject) => {
            if (isRusEmpty && isKZEmpty) {
                reject(<IntlMessage id="field.required" />);
            } else if (isKZEmpty) {
                reject(<IntlMessage id="field.required.kazakh" />);
            } else if (isRusEmpty) {
                reject(<IntlMessage id="field.required.russian" />);
            } else {
                resolve();
            }
        });
    };

    const validateLocalizationApproved = () => {
        const isRusEmpty = approved.name.trim() === "";
        const isKZEmpty = approved.nameKZ.trim() === "";

        return new Promise((resolve, reject) => {
            if (isRusEmpty && isKZEmpty) {
                reject(<IntlMessage id="field.required" />);
            } else if (isKZEmpty) {
                reject(<IntlMessage id="field.required.kazakh" />);
            } else if (isRusEmpty) {
                reject(<IntlMessage id="field.required.russian" />);
            } else {
                resolve();
            }
        });
    };

    const validateLocalizationStaffDivision = () => {
        const isRusEmpty = staffDivision.name.trim() === "";
        const isKZEmpty = staffDivision.nameKZ.trim() === "";

        return new Promise((resolve, reject) => {
            if (isRusEmpty && isKZEmpty) {
                reject(<IntlMessage id="field.required" />);
            } else if (isKZEmpty) {
                reject(<IntlMessage id="field.required.kazakh" />);
            } else if (isRusEmpty) {
                reject(<IntlMessage id="field.required.russian" />);
            } else {
                resolve();
            }
        });
    };

    const handleInputPosition = (event) => {
        setPosition({
            ...position,
            [currentLanguage === "rus" ? "name" : "nameKZ"]: event.target.value,
        });
    };

    const handleInputApproved = (event) => {
        setApproved({
            ...approved,
            [currentLanguage === "rus" ? "name" : "nameKZ"]: event.target.value,
        });
    };

    const handleInputStaffDivision = (event) => {
        setStaffDivision({
            ...staffDivision,
            [currentLanguage === "rus" ? "name" : "nameKZ"]: event.target.value,
        });
    };

    const handleIsChange = (event) => {
        setIsEmployee(event.target.checked);
    };

    const handleStillWorkingChange = (event) => {
        setStillWorking(event.target.checked);
        form.setFieldValue("date", null);
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
                            <IntlMessage id="Contract.add" />
                        </span>
                        <LanguageSwitcher
                            size="small"
                            fontSize="12px"
                            height="1.4rem"
                            current={currentLanguage}
                            setLanguage={setCurrentLanguage}
                        />
                    </div>
                }
                open={isOpen}
                onCancel={handleClose}
                onOk={handleOk}
                onClick={(e) => e.stopPropagation()}
                okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
                cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label={<IntlMessage id="personal.services.investigated.modal.position" />}
                        name="position"
                        rules={[
                            {
                                validator: validateLocalizationPosition,
                            },
                        ]}
                        required
                        style={{ marginBottom: 7 }}
                    >
                        <Input
                            value={currentLanguage === "rus" ? position.name : position.nameKZ}
                            onChange={handleInputPosition}
                            placeholder={IntlMessageText.getText({
                                id: "personal.services.investigated.modal.position",
                            })}
                        />
                        <p className="fam_invisible_text">
                            {currentLanguage === "rus" ? position.name : position.nameKZ}
                        </p>
                    </Form.Item>
                    <Form.Item name="isEmployee" style={{ marginBottom: 7 }}>
                        <Checkbox checked={isEmployee} onChange={handleIsChange}>
                            {t("Contract.isEmployee")}
                        </Checkbox>
                    </Form.Item>
                    <Form.Item
                        label={
                            <span style={{ fontSize: "14px" }}>
                                <IntlMessage id="Contract.staffDivision" />
                            </span>
                        }
                        name="staffDivision"
                        rules={[
                            {
                                validator: validateLocalizationStaffDivision,
                            },
                        ]}
                        required
                    >
                        <Input
                            value={
                                currentLanguage === "rus"
                                    ? staffDivision.name
                                    : staffDivision.nameKZ
                            }
                            onChange={handleInputStaffDivision}
                            placeholder={IntlMessageText.getText({
                                id: "Contract.staffDivision",
                            })}
                        />
                        <p className="fam_invisible_text">
                            {currentLanguage === "rus" ? staffDivision.name : staffDivision.nameKZ}
                        </p>
                    </Form.Item>
                    <Row gutter={5} style={{ marginBottom: 7 }}>
                        <Col xs={13}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: "14px" }}>
                                        <IntlMessage id="contract.approver" />
                                    </span>
                                }
                                name="approver"
                                rules={[
                                    {
                                        validator: validateLocalizationApproved,
                                    },
                                ]}
                                required
                                style={{ marginBottom: 0 }}
                            >
                                <Input
                                    value={
                                        currentLanguage === "rus" ? approved.name : approved.nameKZ
                                    }
                                    onChange={handleInputApproved}
                                    placeholder={IntlMessageText.getText({
                                        id: "Contract.position",
                                    })}
                                />
                                <p className="fam_invisible_text">
                                    {currentLanguage === "rus" ? approved.name : approved.nameKZ}
                                </p>
                            </Form.Item>
                        </Col>
                        <Col xs={6}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: "14px" }}>
                                        <IntlMessage id="contract.coef" />
                                    </span>
                                }
                                name="coefficient"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="contract.coef.enter" />,
                                    },
                                ]}
                                required
                                style={{ marginBottom: 0 }}
                            >
                                <Select options={coefficientOptions} placeholder="x1.0" />
                            </Form.Item>
                        </Col>
                        <Col xs={5}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: "14px" }}>
                                        <IntlMessage id="contract.proc" />
                                    </span>
                                }
                                name="percentage"
                                style={{ marginBottom: 0 }}
                            >
                                <Input
                                    placeholder={IntlMessageText.getText({
                                        id: "contract.proc",
                                    })}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item style={{ marginBottom: 7 }}>
                        <Checkbox checked={stillWorking} onChange={handleStillWorkingChange}>
                            {t("Contract.stillWorking")}
                        </Checkbox>
                    </Form.Item>
                    {stillWorking ? (
                        <Row>
                            <Col xs={24}>
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
                                            message: (
                                                <IntlMessage id="contract.period.service.enter" />
                                            ),
                                        },
                                    ]}
                                    required
                                >
                                    <DatePicker style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    ) : (
                        <Row>
                            <Col xs={24}>
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
                                            message: (
                                                <IntlMessage id="contract.period.service.enter" />
                                            ),
                                        },
                                    ]}
                                    required
                                >
                                    <DatePicker.RangePicker style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    )}
                    <Form.Item
                        label={
                            <span>
                                <IntlMessage id="service.data.modalAddPsycho.docInfo" />
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id="Concract.period.doc.info.enter" />,
                            },
                        ]}
                        required
                        style={{ marginBottom: 0 }}
                    >
                        <Row gutter={5}>
                            <Col xs={12}>
                                <Form.Item
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
                            <Col xs={12}>
                                <Form.Item
                                    name="date_created"
                                    rules={[
                                        {
                                            required: true,
                                            message: (
                                                <IntlMessage id="Concract.date.registration.enter" />
                                            ),
                                        },
                                    ]}
                                    required
                                    style={{ marginBottom: 0 }}
                                >
                                    <DatePicker
                                        disabledDate={disabledDate}
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ModalEmergencyAdd;
