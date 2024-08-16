import { InboxOutlined } from "@ant-design/icons";
import { components } from "API/types";
import { Button, DatePicker, Form, Input, Modal, Row, Upload, message } from "antd";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { S3_BASE_URL } from "configs/AppConfig";
import { fileExtensions } from "constants/FileExtensionConstants";
import { PERMISSION } from "constants/permission";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import moment from "moment";
import React, { FC, useEffect, useState } from "react";
import FileUploaderService, { headers } from "services/myInfo/FileUploaderService";
import { deleteByPath } from "store/slices/myInfo/additionalSlice";
import { addFieldValue, replaceByPath } from "store/slices/myInfo/myInfoSlice";
import { setCorrectDate } from "utils/format/datesFormat";
import { disabledDate } from "utils/helpers/futureDateHelper";

type SpecialInspection = components["schemas"]["SpecialCheckRead"];

type TAbroadTripEditModal = {
    isOpen: boolean;
    currentSpecialInspection: SpecialInspection;
    onClose: () => void;
    source?: "get" | "edited" | "added";
};

const SpecialInspectionEditModal: FC<TAbroadTripEditModal> = ({
    isOpen,
    onClose,
    currentSpecialInspection,
    source,
}) => {
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const [fileList, setFileList] = useState();
    const [filesChanged, setFilesChanged] = useState(false);
    const special_checks = useAppSelector(
        (state) => state.myInfo.allTabs.additional.special_checks,
    );

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const handleFileUpload = async (fileList: any) => {
        setFilesChanged(true);
        const formData = new FormData();
        fileList.forEach((file: any) => {
            formData.append("file", file.originFileObj);
        });

        try {
            const response = await FileUploaderService.upload(formData);
            setFileList(response.link);
            // Return the response link so it can be used in the handleOk function
            return response.link;
        } catch (error) {
            void message.error(<IntlMessage id={"service.data.modalAddPsycho.cannotLoadFile"} />);
        }
    };

    const validateFileList = (rule: any, value: any) => {
        return new Promise<void>((resolve, reject) => {
            if (!value || value.length === 0) {
                resolve();
                // reject(<IntlMessage id={'service.data.modalAddPsycho.pleaseLoadFile'} />);
            } else if (value.length > 1) {
                reject(
                    <IntlMessage id={"service.data.modalEditPolygraphCheck.pleaseLoadOneFile"} />,
                );
            } else {
                resolve();
            }
        });
    };

    const props = {
        action: `${S3_BASE_URL}/upload`,
        headers,
        name: "file",
        multiple: true,
        accept: fileExtensions, // разрешенные расширения
        onChange(info: any) {
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

    useEffect(() => {
        form.resetFields();

        const values = {
            number: currentSpecialInspection.number,
            issued_by: currentSpecialInspection.issued_by,
            date_of_issue: moment(currentSpecialInspection.date_of_issue),

            id: currentSpecialInspection.id,
        };
        form.setFieldsValue(values);
        const getFile = async () => {
            const file = await FileUploaderService.getFileByLink(
                currentSpecialInspection.document_link,
            );
            form.setFieldsValue({
                dragger: [file],
            });
        };
        getFile();
    }, [currentSpecialInspection, form, isOpen]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const link = filesChanged
                ? await handleFileUpload(values.dragger)
                : currentSpecialInspection.document_link;

            const newObject = {
                id: currentSpecialInspection.id,
                number: values.number,
                issued_by: values.issued_by,
                date_of_issue: setCorrectDate(values.date_of_issue),
                document_link: link,
            };

            setNewValue(newObject);
        } catch (error) {
            console.log(error);
        }
    };

    const setNewValue = (obj: any) => {
        if (source === "get") {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: "additional.data.special_checks", //+
                    id: currentSpecialInspection.id, // +
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: "edited.additional.special_checks", //+
                    value: obj,
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: "edited.additional.special_checks", //+
                    id: currentSpecialInspection.id, //+
                    newObj: obj,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.additional.special_checks",
                    id: currentSpecialInspection.id,
                    newObj: obj,
                }),
            );
        }

        handleClose();
    };

    const handleClose = () => {
        form.resetFields();
        setFilesChanged(false);
        onClose();
    };

    const changeDispatchValues = (obj: any) => {
        if (source === "get") {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: "additional.data.special_checks",
                    id: currentSpecialInspection.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: "edited.additional.special_checks",
                    value: obj,
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: "edited.additional.special_checks",
                    id: currentSpecialInspection.id,
                    newObj: obj,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.additional.special_checks",
                    id: currentSpecialInspection.id,
                    newObj: obj,
                }),
            );
        }
    };

    const onDelete = () => {
        changeDispatchValues({ id: currentSpecialInspection.id, delete: true });
        handleClose();
    };

    return (
        <Modal
            // title={'Добавить сведения о курсе'}
            title={<IntlMessage id={"service.data.modalAbroadTravel.specialCheck.title"} />}
            open={isOpen && isHR}
            onCancel={onClose}
            footer={
                <Row justify="end">
                    <Button danger onClick={onDelete}>
                        <IntlMessage id={"initiate.deleteAll"} />
                    </Button>
                    <Button onClick={handleClose}>
                        <IntlMessage id={"candidates.warning.cancel"} />
                    </Button>
                    <Button type="primary" onClick={handleOk}>
                        <IntlMessage id={"initiate.save"} />
                    </Button>
                </Row>
            }
            okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
            cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
            style={{ height: "500px", width: "400px" }}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label={<IntlMessage id={"service.data.modalAddPsycho.docNum"} />}
                    name="number"
                    rules={[
                        {
                            required: true,
                            message: <IntlMessage id={"service.data.modalAddPsycho.chooseDoc"} />,
                        },
                    ]}
                    required
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={<IntlMessage id={"service.data.modalSpecialCheck.issuedBy"} />}
                    name="issued_by"
                    rules={[
                        {
                            required: true,
                            message: (
                                <IntlMessage id={"service.data.modalSpecialCheck.issuedByError"} />
                            ),
                        },
                    ]}
                    required
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={<IntlMessage id={"personal.additional.offenceList.date"} />}
                    name="date_of_issue"
                    rules={[
                        {
                            required: true,
                            message: <IntlMessage id={"oath.date.placeholder"} />,
                        },
                    ]}
                    required
                >
                    <DatePicker
                        style={{
                            width: "100%",
                        }}
                        placeholder={IntlMessageText.getText({
                            id: "oath.date.placeholder",
                        })}
                        format="DD-MM-YYYY"
                        name="date"
                        disabledDate={disabledDate}
                    />
                </Form.Item>

                <Form.Item
                    label={<IntlMessage id={"service.data.modalAcademicDegree.docAccept"} />}
                    // required
                >
                    <Form.Item
                        name="dragger"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        noStyle
                        rules={[{ validator: validateFileList }]}
                    >
                        <Upload.Dragger fileList={fileList} {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                <IntlMessage id="dragger.text" />
                            </p>
                        </Upload.Dragger>
                    </Form.Item>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SpecialInspectionEditModal;
