import { InboxOutlined } from "@ant-design/icons";
import { DatePicker, Form, Input, message, Modal, Upload } from "antd";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { fileExtensions } from "constants/FileExtensionConstants";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileUploaderService from "../../../../../../../services/myInfo/FileUploaderService";
import uuidv4 from "../../../../../../../utils/helpers/uuid";
import { setFieldValue } from "../../../../../../../store/slices/myInfo/myInfoSlice";
import { useAppSelector } from "../../../../../../../hooks/useStore";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";
import { PERMISSION } from "constants/permission";
import { setCorrectDate } from "utils/format/datesFormat";
import { disabledDate } from "utils/helpers/futureDateHelper";

const ModelAddSpecialCheck = ({ isOpen, onClose }) => {
    const [fileList, setFileList] = useState();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const special_checks = useSelector((state) => state.myInfo.allTabs.additional.special_checks);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

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
            setFileList(response.link);
            // Return the response link so it can be used in the onOk function
            return response.link;
        } catch (error) {
            void message.error(<IntlMessage id={"service.data.modalAddPsycho.cannotLoadFile"} />);
        }
    };

    const validateFileList = (rule, value) => {
        return new Promise((resolve, reject) => {
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

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await handleFileUpload(values.dragger);

            const newObject = {
                number: values.number,
                issued_by: values.issued_by,
                date_of_issue: setCorrectDate(values.date_of_issue),
                document_link: response,
                id: uuidv4(),
            };
            dispatch(
                setFieldValue({
                    fieldPath: "allTabs.additional.special_checks",
                    value: [...special_checks, newObject],
                }),
            );
            form.resetFields();
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const onCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                // title={'Добавить сведения о курсе'}
                title={<IntlMessage id={"service.data.modalAbroadTravel.specialCheck.title"} />}
                open={isOpen && isHR}
                onCancel={onCancel}
                onOk={onOk}
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
                                message: (
                                    <IntlMessage id={"service.data.modalAddPsycho.chooseDoc"} />
                                ),
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
                                    <IntlMessage
                                        id={"service.data.modalSpecialCheck.issuedByError"}
                                    />
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
                            placeholder={[
                                IntlMessageText.getText({
                                    id: "oath.date.placeholder",
                                }),
                            ]}
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
        </div>
    );
};

export default ModelAddSpecialCheck;
