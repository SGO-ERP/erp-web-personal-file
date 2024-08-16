import {
    DatePicker,
    Form,
    Input,
    message,
    Modal,
    Progress,
    Row,
    Space,
    Typography,
    Upload,
} from 'antd';
import React, { useState } from 'react';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import { InboxOutlined } from '@ant-design/icons';
import { fileExtensions } from '../../../../../../constants/FileExtensionConstants';
import FileUploaderService from '../../../../../../services/myInfo/FileUploaderService';
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const { Dragger } = Upload;

interface Props {
    onClose: () => void;
    isOpen: boolean;
    onSign: (
        signedBy: string,
        createdDate: string,
        rank: string,
        reqNumber: string,
        order: string,
    ) => void;
    progress: number;
    isLoading: boolean;
}

const ModalAcceptChanges = ({ isOpen, onClose, onSign, progress, isLoading }: Props) => {
    const [form] = Form.useForm();
    const [file, setFile] = useState();

    const handleFileUpload = async (fileList: any) => {
        if (!fileList) {
            return undefined;
        }
        const formData = new FormData();
        fileList.forEach((file: any) => {
            formData.append('file', file.originFileObj);
        });

        try {
            const response = await FileUploaderService.upload(formData);
            setFile(response.link);
            // Return the response link, so it can be used in the onOk function
            return response.link;
        } catch (error) {
            void message.error(<IntlMessage id={'service.data.modalAddPsycho.cannotLoadFile'} />);
        }
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const validateFileList = (rule: any, value: any) => {
        return new Promise((resolve, reject) => {
            resolve(value);
        });
    };

    const props = {
        action: `${S3_BASE_URL}/upload`,
        headers,
        name: 'file',
        multiple: true,
        accept: fileExtensions, // разрешенные расширения
        onChange(info: any) {
            const { status } = info.file;
            if (status === 'done') {
                void message.success(
                    `${info.file.name} ${(
                        <IntlMessage id={'service.data.modalAddPsycho.successLoadFile'} />
                    )}`,
                );
            } else if (status === 'error') {
                void message.error(
                    `${info.file.name} ${(
                        <IntlMessage id={'service.data.modalAddPsycho.cannotLoadFile2'} />
                    )}`,
                );
            }
        },
        beforeUpload: () => {
            return false;
        },
        rules: [{ validator: validateFileList }],
    };

    const handleOk = async () => {
        const { signedBy, date, rank, order, reqNumber } = await form.validateFields();
        const response = await handleFileUpload(order);
        onSign(signedBy, date, rank, reqNumber, response);
        // onClose();
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title={<IntlMessage id={'schedule.button.save.approve'} />}
            open={isOpen}
            onCancel={handleCancel}
            onOk={handleOk}
            okText={<IntlMessage id="accept" />}
            cancelText={<IntlMessage id="staffSchedule.cancel" />}
        >
            {isLoading && (
                <Row align="middle" justify="center">
                    <Space
                        direction="vertical"
                        align="center"
                        size="large"
                        style={{ margin: '0 auto' }}
                    >
                        <Progress type="circle" percent={progress} />
                        <Typography>
                            <IntlMessage id="schedule.modal.createInProcess" />{' '}
                        </Typography>
                    </Space>
                </Row>
            )}
            {!isLoading && (
                <Form form={form} layout="vertical">
                    <Form.Item
                        label={
                            <span style={{ fontSize: '14px' }}>
                                <IntlMessage id={'schedule.signed_by'} />
                            </span>
                        }
                        name="signedBy"
                        rules={[{ required: true, message: 'Заполните поле' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={
                            <span style={{ fontSize: '14px' }}>
                                <IntlMessage id={'schedule.rank_signed_by'} />
                            </span>
                        }
                        name="rank"
                        rules={[{ required: true, message: 'Заполните поле' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={
                            <span style={{ fontSize: '14px' }}>
                                <IntlMessage id={'archieve.data.created'} />
                            </span>
                        }
                        name="date"
                        rules={[{ required: true, message: 'Выберите дату создания' }]}
                    >
                        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item
                        label={
                            <span style={{ fontSize: '14px' }}>
                                <IntlMessage id={'schedule.reqNumber_signed_by'} />
                            </span>
                        }
                        name="reqNumber"
                        rules={[{ required: true, message: 'Заполните поле' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={
                            <span style={{ fontSize: '14px' }}>
                                <IntlMessage id={'schedule.order_signed_by'} />
                            </span>
                        }
                        name="order"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >
                        <Dragger fileList={file} {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                <IntlMessage id={'service.data.modalAddPsycho.clickFileToLoad'} />
                            </p>
                        </Dragger>
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
};
export default ModalAcceptChanges;
