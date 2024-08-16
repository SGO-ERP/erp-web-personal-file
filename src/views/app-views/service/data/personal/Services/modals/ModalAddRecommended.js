import { InboxOutlined } from '@ant-design/icons';
import { Col, Form, message, Modal, Row, Select, Upload } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LanguageSwitcher from '../../../../../../../components/shared-components/LanguageSwitcher';
import FileUploaderService from '../../../../../../../services/myInfo/FileUploaderService';
import { setFieldValue } from '../../../../../../../store/slices/myInfo/myInfoSlice';
import uuidv4 from '../../../../../../../utils/helpers/uuid';
import IntlMessage from 'components/util-components/IntlMessage';
import { useAppSelector } from '../../../../../../../hooks/useStore';
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";
import { PERMISSION } from 'constants/permission';

export default function ModalAddRecommended({ isOpen, onClose }) {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const users = useSelector((state) => state.services.characteristic);
    const formattedUsers = users.map((user) => ({
        value: user.id,
        label: `${user.last_name} ${user.first_name} ${user.father_name}`,
    }));

    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);

    const validateFileList = (rule, value) => {
        return new Promise((resolve, reject) => {
            if (!value || value.length === 0) {
                reject(<IntlMessage id={'service.data.modalAddPsycho.pleaseLoadFile'} />);
            } else if (value.length > 1) {
                reject(
                    <IntlMessage id={'service.data.modalEditPolygraphCheck.pleaseLoadOneFile'} />,
                );
            } else {
                resolve();
            }
        });
    };

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    }

    const props = {
        action: `${S3_BASE_URL}/upload`,
        headers,
        name: 'file',
        multiple: true,
        accept: '.pdf,.jpg,.jpeg, .png', // разрешенные расширения
        onChange(info) {
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

    const handleFileUpload = async (file) => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file.originFileObj);

        try {
            const response = await FileUploaderService.upload(formData);
            // Return the response link, so it can be used in the onOk function
            return response.link;
        } catch (error) {
            void message.error(<IntlMessage id={'service.data.modalAddPsycho.cannotLoadFile'} />);
        }
    };

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await handleFileUpload(values.dragger);
            const newObject = {
                document_link: response,
                user_by_id: values.user_by_id,
                // view only
                id: uuidv4(),
                name: formattedUsers.find((user) => user.value === values.user_by_id).label,
            };
            dispatch(
                setFieldValue({
                    fieldPath: 'allTabs.services.recommendation',
                    value: newObject,
                }),
            );
            onClose();
            form.resetFields();
            onClose();
        } catch (error) {
            console.log('Form validation error', error);
        }
    };

    const onCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <div>
            <Modal
                // title="Добавить рекомендовавшего"
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
                            <IntlMessage id="add.recommend" />
                        </span>
                        <LanguageSwitcher size="small" fontSize="12px" height="1.4rem" />
                    </div>
                }
                open={isOpen && isHR}
                onOk={onOk}
                okText={<IntlMessage id={'service.data.modalAddPsycho.save'} />}
                cancelText={<IntlMessage id={'service.data.modalAddPsycho.cancel'} />}
                onCancel={onCancel}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col xs={24}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: '14px' }}>
                                        <IntlMessage id="recommended" />
                                    </span>
                                }
                                name="user_by_id"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="recommended.enter" />,
                                    },
                                ]}
                                required
                            >
                                <Select options={formattedUsers} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label={
                            <span style={{ fontSize: '14px' }}>
                                <IntlMessage id="recommend.doc" />
                            </span>
                        }
                    >
                        <Form.Item
                            name="dragger"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            noStyle
                        >
                            <Upload.Dragger {...props}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">
                                    <IntlMessage id="service.data.modalAddPsycho.clickFileToLoad" />
                                </p>
                            </Upload.Dragger>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
