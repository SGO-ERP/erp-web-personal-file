// prettier-ignore
import { InboxOutlined } from '@ant-design/icons';
// prettier-ignore
import {  Col, Form, Input, message, Modal, Row, Upload } from 'antd';
// prettier-ignore
import React, { useEffect, useState } from 'react';
// prettier-ignore
import { useDispatch, useSelector } from 'react-redux';
// prettier-ignore
import FileUploaderService from 'services/myInfo/FileUploaderService';
// prettier-ignore
import { setFieldValue } from 'store/slices/myInfo/myInfoSlice';
// prettier-ignore
import { setServiceFieldValue } from 'store/slices/myInfo/servicesSlice';
// prettier-ignore
import IntlMessage from 'components/util-components/IntlMessage';
// prettier-ignore
import { useAppSelector } from 'hooks/useStore';
// prettier-ignore
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";
import { PERMISSION } from 'constants/permission';

export default function ModalEditRecommended({ isOpen, onClose, recommendation, source = 'get' }) {
    // const [selectValue, setSelectValue] = useState('');
    // const profile = useSelector((state) => state.profile.data);
    const [formattedUsers, setFormattedUsers] = useState([]);

    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [filesChanged, setFilesChanged] = useState(false);
    const users = useSelector((state) => state.services.characteristic);

    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);

    useEffect(() => {
        setFormattedUsers(
            users.map((user) => ({
                value: user.id,
                label:
                    user.father_name !== null
                        ? `${user.last_name} ${user.first_name} ${user.father_name}`
                        : `${user.last_name} ${user.first_name}`,
            })),
        );
    }, [users]);

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
            setFilesChanged(true);
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

    const handleFileUpload = async (fileList) => {
        setFilesChanged(true);
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('file', file.originFileObj);
        });

        try {
            const response = await FileUploaderService.upload(formData);
            return response.link;
        } catch (error) {
            void message.error(<IntlMessage id={'service.data.modalAddPsycho.cannotLoadFile'} />);
        }
    };

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const link = filesChanged
                ? await handleFileUpload(values.dragger)
                : recommendation.document_link;

            const newObject = {
                name: values.user_by_id,
                user_by_id: values.user_by_id,
                document_link: link,
                id: recommendation.id,
            };

            if (source === 'get') {
                // Delete from GET slice
                dispatch(
                    setServiceFieldValue({
                        fieldPath: 'serviceData.general_information.recommender',
                        value: {},
                    }),
                );
                // Add to Edited slice
                dispatch(
                    setFieldValue({
                        fieldPath: 'edited.services.recommendation',
                        value: newObject,
                    }),
                );
            }
            if (source === 'added') {
                // Edit item in myInfo.allTabs
                dispatch(
                    setFieldValue({
                        fieldPath: 'allTabs.services.recommendation',
                        value: newObject,
                    }),
                );
            }
            if (source === 'edited') {
                // Edit current item in Edited slice (item already exists)
                dispatch(
                    setFieldValue({
                        fieldPath: 'edited.services.recommendation',
                        value: newObject,
                    }),
                );
            }
            setFilesChanged(false);
            form.resetFields();
            onClose();
        } catch (error) {
            console.log('Form validation error', error);
        }
    };

    useEffect(() => {
        form.resetFields();
        const values = {
            user_by_id: recommendation.user_by_id,
        };
        form.setFieldsValue(values);
        const getFile = async () => {
            const file = await FileUploaderService.getFileByLink(recommendation.document_link);
            form.setFieldsValue({
                dragger: [file],
            });
        };
        getFile();
    }, [recommendation, form, isOpen]);

    // const handleSelect = (val) => {
    //     if (val) {
    //         const arg = formattedUsers.filter((arg) => arg.value === val);
    //         setSelectValue(arg[0].label);
    //     }
    // };

    // const handleSearch = (string) => {
    //     const val = string.toLowerCase();
    //     if (val) {
    //         const filterUser = users.filter(
    //             (user) =>
    //                 user.last_name.toLowerCase().includes(val) ||
    //                 user.first_name.toLowerCase().includes(val) ||
    //                 user?.father_name?.toLowerCase()?.includes(val),
    //         );

    //         setFormattedUsers(
    //             filterUser.map((user) => ({
    //                 value: user.id,
    //                 label:
    //                     user.father_name !== null
    //                         ? `${user.last_name} ${user.first_name} ${user.father_name}`
    //                         : `${user.last_name} ${user.first_name}`,
    //             })),
    //         );
    //     } else {
    //         setFormattedUsers(
    //             users.map((user) => ({
    //                 value: user.id,
    //                 label:
    //                     user.father_name !== null
    //                         ? `${user.last_name} ${user.first_name} ${user.father_name}`
    //                         : `${user.last_name} ${user.first_name}`,
    //             })),
    //         );
    //     }
    // };

    return (
        <div>
            <Modal
                // title='Редактировать рекомендовавшего'
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
                            <IntlMessage id='recommend.edit' />
                        </span>
                    </div>
                }
                open={isOpen && isHR}
                onOk={onOk}
                okText={<IntlMessage id={'service.data.modalAddPsycho.save'} />}
                cancelText={<IntlMessage id={'service.data.modalAddPsycho.cancel'} />}
                onCancel={onClose}
            >
                <Form form={form} layout='vertical'>
                    <Row gutter={16}>
                        <Col xs={24}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: '14px' }}>
                                        <IntlMessage id='recommended' />
                                    </span>
                                }
                                name='user_by_id'
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id='recommended.enter' />,
                                    },
                                ]}
                                required
                            >
                                {/* <AutoComplete
                                    options={formattedUsers}
                                    onSelect={handleSelect}
                                    value={selectValue}
                                    defaultValue={selectValue}
                                    onSearch={handleSearch}
                                /> */}
                                {/* <Select
                                    options={formattedUsers}
                                    onSelect={handleSelect}
                                    value={selectValue}
                                    onSearch={handleSearch}
                                    filterOption={false}
                                    showSearch
                                /> */}

                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label={
                            <span style={{ fontSize: '14px' }}>
                                <IntlMessage id='recommend.doc' />
                            </span>
                        }
                    >
                        <Form.Item
                            name='dragger'
                            valuePropName='fileList'
                            getValueFromEvent={normFile}
                            noStyle
                        >
                            <Upload.Dragger {...props}>
                                <p className='ant-upload-drag-icon'>
                                    <InboxOutlined />
                                </p>
                                <p className='ant-upload-text'>
                                    <IntlMessage id='service.data.modalAddPsycho.clickFileToLoad' />
                                </p>
                            </Upload.Dragger>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
