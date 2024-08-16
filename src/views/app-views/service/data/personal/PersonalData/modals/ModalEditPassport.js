import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {Button, Form, message, Modal, Row} from "antd";
import FileUploaderService from "../../../../../../../services/myInfo/FileUploaderService";
import IntlMessage from "../../../../../../../components/util-components/IntlMessage";
import {fileExtensions} from "../../../../../../../constants/FileExtensionConstants";
import {deleteByPath} from "../../../../../../../store/slices/myInfo/personalInfoSlice";
import {deleteByPathMyInfo, setFieldValue} from "../../../../../../../store/slices/myInfo/myInfoSlice";
import Dragger from "antd/es/upload/Dragger";
import {InboxOutlined} from "@ant-design/icons";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const ModalEditPassport = ({ isOpen, onClose, passportDocument, source }) => {
    const [file, setFile] = useState();
    const dispatch = useDispatch();
    const [filesChanged, setFilesChanged] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();
        if(passportDocument?.document_link && isOpen===true) {
            const getFile = async () => {
                const file = await FileUploaderService.getFileByLink(passportDocument.document_link);
                form.setFieldsValue({
                    dragger: [file],
                });
            };
            getFile();
        }
    }, [form, isOpen]);

    const handleFileUpload = async (fileList) => {
        setFilesChanged(true);
        if (!fileList || fileList.length === 0) {
            return null;
        }
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('file', file.originFileObj);
        });

        try {
            const response = await FileUploaderService.upload(formData);
            setFile(response.link);
            // Return the response link, so it can be used in the onOk function
            return response.link;
        } catch (error) {
            void message.error(<IntlMessage id="medical.file.upload.error" />);
        }
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };


    const validateFileList = (rule, value) => {
        setFilesChanged(true);
        return new Promise((resolve, reject) => {
            if (!value || value.length === 0) {
                resolve();
            } else if (value.length > 1) {
                reject(<IntlMessage id="candidates.warning.singleFile" />);
            } else {
                resolve();
            }
        });
    };
    const handleFileRemove = () => {
        form.setFieldsValue({ dragger: [] });
        setFilesChanged(true);
    };

    const props = {
        action: `${S3_BASE_URL}/upload`,
        headers,
        onRemove: handleFileRemove,
        name: 'file',
        multiple: true,
        accept: fileExtensions, // разрешенные расширения
        onChange(info) {
            setFilesChanged(true);
            const { status } = info.file;
            if (status === 'done') {
                void message.success(
                    `${info.file.name} ${(<IntlMessage id="medical.file.upload.success" />)}`,
                );
            } else if (status === 'error') {
                void message.error(
                    `${info.file.name} ${(<IntlMessage id="medical.file.upload.error" />)}`,
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
            const response = filesChanged ? await handleFileUpload(values.dragger) : passportDocument.document_link;
            if (response) {
                const newObject = {
                    document_link: response,
                    id: passportDocument?.id,
                };


                changeDispatchValues(newObject);
            }
        } catch (error) {
            throw new Error(error);
        }
    };
    const changeDispatchValues = (obj) => {
        if (source === 'get') {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: 'personalInfoData.driving_license',
                    document_link: passportDocument.document_link,
                }),
            );
            // Add to Edited slice
            dispatch(
                setFieldValue({
                    fieldPath: 'edited.personal_data.driving_license',
                    value: obj,
                }),
            );
        }
        if (source === 'edited') {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                deleteByPathMyInfo({
                    path: 'edited.personal_data.driving_license',
                    id: passportDocument.id,
                }),
            );
        }
        if (source === 'added') {
            // Edit item in myInfo.allTabs
            dispatch(
                deleteByPathMyInfo({
                    fieldPath: 'allTabs.personal_data.driving_license',
                    id: passportDocument.id,
                }),
            );
        }

        onCancel();
    };

    const onDelete = () => {
        changeDispatchValues({ delete: true, id:passportDocument.id });
    };
    const onCancel = () => {
        form.resetFields();
        setFilesChanged(false);
        onClose();
    };
    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                title={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginRight: '20px',
                            alignItems: 'center',
                        }}
                    >
                        <span>
                            <IntlMessage id='edit.passport' />
                        </span>
                    </div>
                }
                open={isOpen}
                onCancel={onCancel}
                onOk={onOk}
                okText={<IntlMessage id='initiate.save' />}
                cancelText={<IntlMessage id='candidates.warning.cancel' />}
                style={{ height: '500px', width: '400px' }}
                onClick={(e) => e.stopPropagation()}
                footer={
                    <Row justify="end">
                        <Button danger onClick={onDelete}>
                            <IntlMessage id={'initiate.deleteAll'} />
                        </Button>
                        <Button onClick={onCancel}>
                            <IntlMessage id={'service.data.modalAddPsycho.cancel'} />
                        </Button>
                        <Button type="primary" onClick={onOk}>
                            <IntlMessage id={'service.data.modalAddPsycho.save'} />
                        </Button>
                    </Row>
                }
            >
                <Form form={form} layout='vertical'>
                    <Form.Item label={<IntlMessage id="service.data.modalAcademicDegree.docAccept" />}>
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
                                    <IntlMessage id="dragger.text" />
                                </p>
                            </Dragger>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ModalEditPassport;
