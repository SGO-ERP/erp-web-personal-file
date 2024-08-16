import React, {useState} from 'react';
import {Form, message, Modal} from 'antd';
import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import {InboxOutlined} from '@ant-design/icons';
import {useDispatch} from 'react-redux';
import FileUploaderService from '../../../../../../../services/myInfo/FileUploaderService';
import {fileExtensions} from '../../../../../../../constants/FileExtensionConstants';
import {setFieldValue} from '../../../../../../../store/slices/myInfo/myInfoSlice';
import Dragger from "antd/es/upload/Dragger";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const ModalAddIdentityCard = ({ isOpen, onClose, identitycard, source }) => {
    const [file, setFile] = useState();
    const dispatch = useDispatch();

    const handleFileUpload = async (fileList) => {
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
            void message.error(<IntlMessage id='medical.file.upload.error' />);
        }
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const [form] = Form.useForm();

    const validateFileList = (rule, value) => {
        return new Promise((resolve, reject) => {
            if (!value || value.length === 0) {
                reject(<IntlMessage id='candidates.warning.file' />);
            } else if (value.length > 1) {
                reject(<IntlMessage id='candidates.warning.singleFile' />);
            } else {
                resolve();
            }
        });
    };

    const props = {
        action: `${S3_BASE_URL}/upload`,
        headers,
        name: 'file',
        multiple: true,
        accept: fileExtensions, // разрешенные расширения

        onChange(info) {
            const { status } = info.file;
            if (status === 'done') {
                void message.success(
                    `${info.file.name} ${(<IntlMessage id='medical.file.upload.success' />)}`,
                );
            } else if (status === 'error') {
                void message.error(
                    `${info.file.name} ${(<IntlMessage id='medical.file.upload.error' />)}`,
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
            if (response) {
                const newObject = {
                    document_link: response,
                    id: identitycard?.id,
                };
                if(source==='edit') {
                    dispatch(
                        setFieldValue({
                            fieldPath: 'edited.personal_data.identification_card_document_link',
                            value: newObject,
                        }),
                    );
                } else if (source==='add') {
                    dispatch(
                        setFieldValue({
                            fieldPath: 'allTabs.personal_data.identification_card_document_link',
                            value: newObject,
                        }),
                    );
                }
                form.resetFields();
                onClose();
            }
        } catch (error) {
            throw new Error(error);
        }
    };

    const onCancel = () => {
        form.resetFields();
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
                            <IntlMessage id='modal.add.edit.identification_card' />
                        </span>
                </div>
            }
            open={isOpen}
            onCancel={onCancel}
            onOk={onOk}
            okText={<IntlMessage id='initiate.save' />}
            cancelText={<IntlMessage id='candidates.warning.cancel' />}
            style={{ height: '500px', width: '400px' }}
        >
            <Form form={form} layout='vertical'>
                <Form.Item
                    label={<IntlMessage id='service.data.modalAcademicDegree.docAccept' />}
                >
                    <Form.Item
                        name='dragger'
                        valuePropName='fileList'
                        getValueFromEvent={normFile}
                        noStyle
                        rules={[{ validator: validateFileList }]}
                    >
                        <Dragger fileList={file} {...props}>
                            <p className='ant-upload-drag-icon'>
                                <InboxOutlined />
                            </p>
                            <p className='ant-upload-text'>
                                <IntlMessage id='dragger.text' />
                            </p>
                        </Dragger>
                    </Form.Item>
                </Form.Item>
            </Form>
        </Modal>
        </div>
    );
};

export default ModalAddIdentityCard;
