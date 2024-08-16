import { Col, Input, Modal, Row, Form, DatePicker } from "antd";
import { useForm } from "antd/es/form/Form";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addFieldValue } from "store/slices/myInfo/myInfoSlice";
import uuidv4 from "utils/helpers/uuid";
import LanguageSwitcher from "../../../../../../../components/shared-components/LanguageSwitcher";
import TextArea from "antd/es/input/TextArea";

const ModalAttestationAdd = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [form] = useForm();
    const [attestation, setAttestation] = useState({ name: "", nameKZ: "" });
    const [currentLanguage, setCurrentLanguage] = useState("rus");
    const disabledDate = (current) => {
        return current && current > moment().startOf("day");
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const newAttestation = {
                attestation_status: attestation.name,
                attestation_statusKZ: attestation.nameKZ,
                document_number: values.document_number,
                date_from: values.date[0].toDate(),
                date_to: values.date[1].toDate(),
                date_credited: values.date_credited,
                id: uuidv4(),
            };

            dispatch(
                addFieldValue({
                    fieldPath: "allTabs.services.attestations",
                    value: newAttestation,
                }),
            );

            handleClose();
        } catch (error) {
            console.log("Form validation error", error);
        }
    };

    const handleClose = () => {
        form.resetFields();
        setAttestation({ name: "", nameKZ: "" });
        onClose();
    };

    const validateLocalizationAttestation = () => {
        const isRusEmpty = attestation.name.trim() === "";
        const isKZEmpty = attestation.nameKZ.trim() === "";

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

    const handleInputAttestation = (event) => {
        setAttestation({
            ...attestation,
            [currentLanguage === "rus" ? "name" : "nameKZ"]: event.target.value,
        });
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
                            <IntlMessage id="personal.services.certifications.add" />
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
                onCancel={handleClose}
                onOk={handleOk}
                open={isOpen}
                okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
                cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
            >
                <Form form={form} layout="vertical">
                    <Row>
                        <p className="fam_form_title_symbol">*</p>
                        <p className="fam_form_title_text">
                            <IntlMessage id={"personal.services.certifications.title"} />
                        </p>
                    </Row>

                    <Form.Item
                        name="attestation"
                        rules={[
                            {
                                validator: validateLocalizationAttestation,
                            },
                        ]}
                        required
                    >
                        <TextArea
                            value={
                                currentLanguage === "rus" ? attestation.name : attestation.nameKZ
                            }
                            onChange={handleInputAttestation}
                            placeholder={IntlMessageText.getText({
                                id: "personal.services.certifications.title",
                            })}
                            autoSize={{
                                minRows: 4,
                                maxRows: 14,
                            }}
                        />
                        <p className="fam_invisible_text">
                            {currentLanguage === "rus" ? attestation.name : attestation.nameKZ}
                        </p>
                    </Form.Item>
                    <Row>
                        <p className="fam_form_title_symbol">*</p>
                        <p className="fam_form_title_text">
                            <IntlMessage id={"personal.services.classification.modal.date"} />
                        </p>
                    </Row>
                    <Form.Item
                        name="date"
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id="awards.select.date.provide" />,
                            },
                        ]}
                        required
                    >
                        <DatePicker.RangePicker
                            style={{
                                width: "100%",
                            }}
                            format="DD-MM-YYYY"
                            name="date"
                        />
                    </Form.Item>
                    <Row>
                        <p className="fam_form_title_symbol">*</p>
                        <p className="fam_form_title_text">
                            <IntlMessage id={"candidates.title.regNumber"} />
                        </p>
                    </Row>
                    <Row gutter={[16, 16]}>
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
                                name="date_credited"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="awards.select.date.provide" />,
                                    },
                                ]}
                                required
                                style={{ marginBottom: 0 }}
                            >
                                <DatePicker
                                    style={{
                                        width: "100%",
                                    }}
                                    format="DD-MM-YYYY"
                                    name="date"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default ModalAttestationAdd;
