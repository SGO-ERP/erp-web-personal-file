import { InboxOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Upload } from "antd";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { fileExtensions } from "constants/FileExtensionConstants";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LanguageSwitcher from "../../../../../../../components/shared-components/LanguageSwitcher";
import FileUploaderService from "../../../../../../../services/myInfo/FileUploaderService";
import {
    deleteByPath,
    getPsychologicalCheck,
} from "../../../../../../../store/slices/myInfo/additionalSlice";
import {
    addFieldValue,
    replaceByPath,
    setFieldValue,
} from "../../../../../../../store/slices/myInfo/myInfoSlice";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const { Dragger } = Upload;

const ModalAddPsychoEdit = ({ isOpen, onClose, psychoObject, source }) => {
    const [fileList, setFileList] = useState();
    const [filesChanged, setFilesChanged] = useState(false);
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const psych_characts = useSelector(
        (state) => state.myInfo.edited.additional.psychological_checks,
    );

    const editedData = useSelector((state) => state.myInfo.edited.additional);

    const handleFileRemove = () => {
        form.setFieldsValue({ dragger: [] });
        setFilesChanged(true);
    };

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
        setFilesChanged(true);
        if (!fileList || fileList.length === 0) {
            return null;
        }
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append("file", file.originFileObj);
        });

        try {
            const response = await FileUploaderService.upload(formData);
            setFileList(response.link);
            // Return the response link so it can be used in the onOk function
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
            setFilesChanged(true);
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
    const additional = useSelector((state) => state.myInfo.edited.additional);
    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const link = filesChanged
                ? await handleFileUpload(values.dragger)
                : psychoObject.document_link;

            const newObject = {
                date_of_issue: values.date.toDate(),
                document_number: values.number,
                issued_by: values.FullName,
                document_link: link,
                id: psychoObject.id,
                profile_id: psychoObject.profile_id,
            };

            if (source === "get") {
                // Delete from GET slice
                dispatch(
                    deleteByPath({
                        path: "additional.data.psychological_checks",
                        id: psychoObject.id,
                    }),
                );

                // Add to Edited slice
                dispatch(
                    addFieldValue({
                        fieldPath: "edited.additional.psychological_checks",
                        value: newObject,
                    }),
                );
            }
            if (source === "edited") {
                // Edit current item in Edited slice (item already exists)
                dispatch(
                    replaceByPath({
                        path: "edited.additional.psychological_checks",
                        id: psychoObject.id,
                        newObj: newObject,
                    }),
                );
            }
            if (source === "added") {
                // Edit item in myInfo.allTabs
                dispatch(
                    replaceByPath({
                        path: "allTabs.additional.psychological_checks",
                        id: psychoObject.id,
                        newObj: newObject,
                    }),
                );
            }
            form.resetFields();
            setFilesChanged(false);
            onClose();
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    };

    useEffect(() => {
        form.resetFields();
        const values = {
            FullName: psychoObject.issued_by,
            number: psychoObject.document_number,
            date: moment(psychoObject.date_of_issue),
        };
        form.setFieldsValue(values);
        const getFile = async () => {
            const file = await FileUploaderService.getFileByLink(psychoObject.document_link);
            form.setFieldsValue({
                dragger: [file],
            });
        };
        getFile();
    }, [psychoObject, form, isOpen]);

    const closeAndClear = () => {
        form.resetFields();
        onClose();
    };

    const onDelete = () => {
        changeDispatchValues({ id: psychoObject.id, delete: true });
        closeAndClear();
    };

    const changeDispatchValues = (obj) => {
        if (source === "get") {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: "additional.data.psychological_checks",
                    id: psychoObject.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: "edited.additional.psychological_checks",
                    value: obj,
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: "edited.additional.psychological_checks",
                    id: psychoObject.id,
                    newObj: obj,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.additional.psychological_checks",
                    id: psychoObject.id,
                    newObj: obj,
                }),
            );
        }
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
                                name="date"
                                disabledDate={disabledDate}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item required>
                    <Form.Item
                        name="dragger"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        noStyle
                        rules={[{ validator: validateFileList }]}
                    >
                        <Dragger fileList={fileList} {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                <IntlMessage id="dragger.text" />
                            </p>
                        </Dragger>
                    </Form.Item>
                </Form.Item>
            </Form>
        );
    };

    return (
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
            onClick={(e) => e.stopPropagation()}
            open={isOpen}
            onCancel={onClose}
            onOk={onOk}
            okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
            cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
            footer={
                <Row justify="end">
                    <Button danger onClick={onDelete}>
                        <IntlMessage id={"initiate.deleteAll"} />
                    </Button>
                    <Button onClick={closeAndClear}>
                        <IntlMessage id={"candidates.warning.cancel"} />
                    </Button>
                    <Button type="primary" onClick={onOk}>
                        <IntlMessage id={"initiate.save"} />
                    </Button>
                </Row>
            }
            style={{ height: "100%", width: "100%" }}
        >
            <PsychChar />
        </Modal>
    );
};

export default ModalAddPsychoEdit;
