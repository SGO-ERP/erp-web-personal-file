import { Col, Input, Modal, Row, Form, DatePicker, Button } from "antd";
import { useForm } from "antd/es/form/Form";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addFieldValue, replaceByPath } from "store/slices/myInfo/myInfoSlice";
import { deleteByPath } from "store/slices/myInfo/servicesSlice";
import LanguageSwitcher from "../../../../../../../components/shared-components/LanguageSwitcher";
import TextArea from "antd/es/input/TextArea";

const ModalAttestationEdit = ({ isOpen, onClose, attestation, source = "get" }) => {
    const dispatch = useDispatch();
    const [form] = useForm();
    const [attestationName, setAttestationName] = useState({ name: "", nameKZ: "" });
    const [currentLanguage, setCurrentLanguage] = useState("rus");

    useEffect(() => {
        form.resetFields();

        const values = {
            document_number: attestation.document_number,
            date: attestation.date_to
                ? [moment(attestation.date_from), moment(attestation.date_to)]
                : [moment(attestation.date_from), ""],
            date_credited: moment(attestation.date_credited),
            id: attestation.id,
        };
        setAttestationName({
            name: attestation.attestation_status,
            nameKZ: attestation.attestation_statusKZ,
        });
        form.setFieldsValue(values);
    }, [form, attestation, isOpen]);

    const disabledDate = (current) => {
        return current && current > moment().startOf("day");
    };

    const changeDispatchValues = (obj) => {
        if (source === "get") {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: "serviceData.attestations",
                    id: obj.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: "edited.services.attestations",
                    value: obj,
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: "edited.services.attestations",
                    id: obj.id,
                    newObj: obj,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.services.attestations",
                    id: obj.id,
                    newObj: obj,
                }),
            );
        }

        handleClose();
    };

    const handleDelete = () => {
        changeDispatchValues({ id: attestation.id, delete: true });
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const editAttestation = {
                attestation_status: attestationName.name,
                attestation_statusKZ: attestationName.nameKZ,
                document_number: values.document_number,
                date_from: values.date[0].toDate(),
                date_to: values.date[1].toDate(),
                date_credited: values.date_credited,
                id: attestation.id,
            };

            changeDispatchValues(editAttestation);
        } catch (error) {
            console.log("Form validation error", error);
        }
    };

    const handleClose = () => {
        form.resetFields();
        setAttestationName({ name: "", nameKZ: "" });
        onClose();
    };

    const validateLocalizationAttestation = () => {
        const isRusEmpty = attestationName.name === "" || attestationName.name === null;
        const isKZEmpty = attestationName.nameKZ === "" || attestationName.nameKZ === null;

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
        setAttestationName({
            ...attestationName,
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
                open={isOpen}
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
                                currentLanguage === "rus"
                                    ? attestationName.name
                                    : attestationName.nameKZ
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
                            {currentLanguage === "rus"
                                ? attestationName.name
                                : attestationName.nameKZ}
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

export default ModalAttestationEdit;
