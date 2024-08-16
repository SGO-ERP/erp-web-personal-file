import { InboxOutlined } from "@ant-design/icons";
import { Col, DatePicker, Form, Input, message, Modal, Row, Upload } from "antd";
import { fileExtensions } from "constants/FileExtensionConstants";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import uuidv4 from "utils/helpers/uuid";
import LanguageSwitcher from "../../../../../../../components/shared-components/LanguageSwitcher";
import { PSYCHOLOGIST } from "../../../../../../../constants/PositionNames";
import FileUploaderService from "../../../../../../../services/myInfo/FileUploaderService";
import { getPsychologicalCheck } from "../../../../../../../store/slices/myInfo/additionalSlice";
import { setFieldValue } from "../../../../../../../store/slices/myInfo/myInfoSlice";
import IntlMessage, {
    IntlMessageText,
} from "../../../../../../../components/util-components/IntlMessage";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const { Dragger } = Upload;

const ModalAddPsycho = ({ isOpen, onClose }) => {
    const [file, setFile] = useState();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const psych_charact = useSelector(
        (state) => state.myInfo.allTabs.additional.psychological_checks,
    );
    const profile = useSelector((state) => state.profile.data);

    useEffect(() => {
        dispatch(getPsychologicalCheck());
    }, [dispatch]);

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    }

    const handleFileUpload = async (fileList) => {
        if (!fileList) {
            return undefined;
        }
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append("file", file.originFileObj);
        });

        try {
            const response = await FileUploaderService.upload(formData);
            setFile(response.link);
            // Return the response link, so it can be used in the onOk function
            return response.link;
        } catch (error) {
            void message.error(<IntlMessage id={"service.data.modalAddPsycho.cannotLoadFile"} />);
        }
    };

    const validateFileList = (rule, value) => {
        return new Promise((resolve, reject) => {
            resolve();
        });
    };

    const props = {
        action: `${S3_BASE_URL}/upload`,
        headers,
        name: "file",
        multiple: true,
        accept: fileExtensions, // разрешенные расширения
        onChange(info) {
            const { status } = info.file;
            if (status === "done") {
                void message.success(
                    `${info.file.name} ${(
                        <IntlMessage id={"service.data.modalAddPsycho.successLoadFile"} />
                    )}`,
                );
            } else if (status === "error") {
                void message.error(
                    `${info.file.name} ${(
                        <IntlMessage id={"service.data.modalAddPsycho.cannotLoadFile2"} />
                    )}`,
                );
            }
        },
        beforeUpload: () => {
            return false;
        },
        rules: [{ validator: validateFileList }],
    };

    const disabledDate = (current) => {
        // Disable dates before today
        return current && current > moment().startOf("day");
    };

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const link = await handleFileUpload(values.dragger);

            const newObject = {
                date_of_issue: values.date.toDate(),
                document_number: values.number,
                issued_by: values.FullName,
                document_link: link,
                id: uuidv4(),
            };

            dispatch(
                setFieldValue({
                    fieldPath: "allTabs.additional.psychological_checks",
                    value: [...psych_charact, newObject],
                }),
            );
            form.resetFields();
            onClose();
        } catch (error) {
            throw new Error(error);
        }
    };

    const onCancel = () => {
        form.resetFields();
        onClose();
    };

    const PsychChar = () => {
        return (
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col xs={24}>
                        <Form.Item
                            label={
                                <span style={{ fontSize: "14px" }}>
                                    <IntlMessage id={"service.data.modalAddPsycho.FullName"} />
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <IntlMessage
                                            id={"service.data.modalAddPsycho.chooseFullName"}
                                        />
                                    ),
                                },
                            ]}
                            name="FullName"
                            required
                        >
                            <Input placeholder="Ашимов Адлет Маратович" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <p className="fam_form_title_symbol">*</p>
                    <p className="fam_form_title_text">
                        <IntlMessage id={"service.data.modalAddPsycho.docInfo"} />
                    </p>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col xs={12}>
                        <Form.Item
                            name="number"
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <IntlMessage id={"service.data.modalAddPsycho.chooseDoc"} />
                                    ),
                                },
                            ]}
                            required
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
                            name="date"
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <IntlMessage
                                            id={"service.data.modalAddPsycho.chooseDateCreate"}
                                        />
                                    ),
                                },
                            ]}
                        >
                            <DatePicker
                                placeholder={IntlMessageText.getText({
                                    id: "service.data.modalAddPsycho.dateCreate",
                                })}
                                style={{ width: "100%" }}
                                format="DD-MM-YYYY"
                                disabledDate={disabledDate}
                                name="date"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Form.Item
                        name="dragger"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        noStyle
                        rules={[{ validator: validateFileList }]}
                    >
                        <Dragger fileList={file} {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                <IntlMessage id={"service.data.modalAddPsycho.clickFileToLoad"} />
                            </p>
                        </Dragger>
                    </Form.Item>
                </Form.Item>
            </Form>
        );
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                // title={'Добавить психологическую характеристику'}
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
                            <IntlMessage id={"service.data.modalAddPsycho.addPsychoCharac"} />
                        </span>
                    </div>
                }
                open={isOpen}
                onCancel={onCancel}
                onOk={onOk}
                okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
                cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
                style={{ height: "100%", width: "100%" }}
            >
                <PsychChar />
            </Modal>
        </div>
    );
};

export default ModalAddPsycho;
