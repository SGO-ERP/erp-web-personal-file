import React, { useEffect, useState } from 'react';
import { Button, Form, message, Modal, Row, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import FileUploaderService from '../../../../../../services/myInfo/FileUploaderService';
import { useNavigate } from 'react-router';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";
const { Dragger } = Upload;

const ModalFile = ({ modalCase, openModal, question11Answer, setQuestion11Answer, stageInfo }) => {
    const [openFileUpload, setOpenFileUpload] = useState(false);
    const [file, setFile] = useState();

    const navigate = useNavigate();

    const [form] = Form.useForm();

    function handleCancel() {
        setOpenFileUpload(false);
        modalCase.showModalFileUpload(openFileUpload);
    }

    useEffect(() => {
        const getFile = async () => {
            const file = await FileUploaderService.getFileByLink(question11Answer);
            form.setFieldsValue({
                dragger: [file],
            });
        };

        if (question11Answer !== '' && question11Answer !== undefined) {
            getFile();
        }
    }, [question11Answer]);

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const link = await handleFileUpload(values.dragger);
            if (link) {
                question11Answer = link;
                setQuestion11Answer(link);
                handleCancel();
            }
        } catch (error) {
            throw new Error(error);
        }
    };

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
            void message.error('Не удалось загрузить файл.');
        }
    };

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    }

    const validateFileList = (rule, value) => {
        return new Promise((resolve, reject) => {
            if (!value || value.length === 0) {
                reject(<IntlMessage id={'candidates.warning.file'} />);
            } else if (value.length > 1) {
                reject(<IntlMessage id={'candidates.warning.singleFile'} />);
            } else {
                resolve();
            }
        });
    };
    const props = {
        action: `${S3_BASE_URL}/upload`,
        headers,
        name: 'file',
        multiple: false,
        accept: '.pdf,.docx,.doc', // разрешенные расширения
        onChange(info) {
            const { status } = info.file;
            if (status === 'done') {
                void message.success(`${info.file.name} файл успешно загружен.`);
            } else if (status === 'error') {
                void message.error(`${info.file.name} не удалось загрузить файл.`);
            }
        },
        beforeUpload: () => {
            return false;
        },
        rules: [{ validator: validateFileList }],
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                title={<IntlMessage id={'candidates.warning.downloadfile'} />}
                open={openModal}
                onCancel={handleCancel}
                onOk={onOk}
                okText={<IntlMessage id={'personal.button.save'} />}
                cancelText={<IntlMessage id={'candidates.warning.cancel'} />}
                style={{ height: '100%', width: '100%' }}
                okButtonProps={{
                    disabled: stageInfo?.candidate_stage_info?.status !== 'Не начат',
                }}
                cancelButtonProps={{
                    disabled: stageInfo?.candidate_stage_info?.status !== 'Не начат',
                }}
            >
                {question11Answer !== '' &&
                question11Answer !== undefined &&
                stageInfo?.candidate_stage_info?.status !== 'Не начат' ? (
                    <Button>
                        <a href={question11Answer}>Скачать</a>
                    </Button>
                ) : (
                    <Form form={form} layout="vertical" required>
                        <Form.Item required>
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
                                        <IntlMessage id={'candidates.warning.fileUpload'} />
                                    </p>
                                </Dragger>
                            </Form.Item>
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </div>
    );
};

export default ModalFile;
