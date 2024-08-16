import { InboxOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Upload } from 'antd';
import IntlMessage, { IntlMessageText } from 'components/util-components/IntlMessage';
import { fileExtensions } from 'constants/FileExtensionConstants';
import moment from 'moment';
import 'moment/locale/ru';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LanguageSwitcher from '../../../../../../../components/shared-components/LanguageSwitcher';
import FileUploaderService from '../../../../../../../services/myInfo/FileUploaderService';
import { deleteByPath } from '../../../../../../../store/slices/myInfo/additionalSlice';
import {
    addFieldValue,
    replaceByPath,
    setFieldValue,
} from '../../../../../../../store/slices/myInfo/myInfoSlice';
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const { Dragger } = Upload;

const ModalTransportEdit = ({ isOpen, onClose, vehicle, source = 'get' }) => {
    const [file, setFile] = useState();
    const dispatch = useDispatch();
    const [filesChanged, setFilesChanged] = useState(false);

    const transport = useSelector((state) => state.myInfo.edited.additional.transport);

    // const reformattedSportTypes =
    //     sportTypes &&
    //     sportTypes.map((item) => ({
    //         value: item.id,
    //         label: item.name,
    //     }));

    // useEffect(() => {
    //     if (sportTypes.length === 0) {
    //         dispatch(getSportTypes());
    //     }
    // }, [dispatch, sportTypes]);

    const handleFileUpload = async (fileList) => {
        setFilesChanged(true); //+
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
            void message.error(<IntlMessage id={'service.data.modalAddPsycho.cannotLoadFile'} />);
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
                resolve();
                // reject(<IntlMessage id={'service.data.modalAddPsycho.pleaseLoadFile'} />);
            } else if (value.length > 1) {
                reject(
                    <IntlMessage id={'service.data.modalEditPolygraphCheck.pleaseLoadOneFile'} />,
                ); //+
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
            setFilesChanged(true); //+
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
    const disabledDate = (current) => {
        // Disable dates before today
        return current && current > moment().startOf('day');
    };

    const onOk = async () => {
        const values = await form.validateFields();
        const link = filesChanged ? await handleFileUpload(values.dragger) : vehicle.document_link;
        const newObject = {
            name: values.name,
            number: values.number,
            date_from: values.date_from.toDate(),
            document_link: link, //+
            profile_id: vehicle.profile_id, //+
            id: vehicle.id, //+
            vin_code: values.vin_code,
        };

        if (source === 'get') {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: 'additional.data.user_vehicles', //+
                    id: vehicle.id, // +
                }),
            );
            // Add to Edited slice
            dispatch(
                setFieldValue({
                    fieldPath: 'edited.additional.transport', //+
                    value: [...transport, newObject],
                }),
            );
        }
        if (source === 'edited') {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: 'edited.additional.transport', //+
                    id: vehicle.id, //+
                    newObj: newObject,
                }),
            );
        }
        if (source === 'added') {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: 'allTabs.additional.transport',
                    id: vehicle.id,
                    newObj: newObject,
                }),
            );
        }
        form.resetFields();
        setFilesChanged(false);
        onClose();
    };


    useEffect(() => {
        form.resetFields();
        const values = {
            name: vehicle.name,
            number: vehicle.number,
            date_from: moment(vehicle.date_from),
            vin_code: vehicle.vin_code,
        };
        form.setFieldsValue(values);
        const getFile = async () => {
            const file = await FileUploaderService.getFileByLink(vehicle.document_link);
            form.setFieldsValue({
                dragger: [file],
            });
        };
        getFile();
    }, [isOpen]);

    const closeAndClear = () => {
        form.resetFields();
        setFilesChanged(false);
        onClose();
    };

    const changeDispatchValues = (obj) => {
        if (source === 'get') {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: 'additional.data.user_vehicles',
                    id: vehicle.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: 'edited.additional.transport',
                    value: obj,
                }),
            );
        }
        if (source === 'edited') {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: 'edited.additional.transport',
                    id: vehicle.id,
                    newObj: obj,
                }),
            );
        }
        if (source === 'added') {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: 'allTabs.additional.transport',
                    id: vehicle.id,
                    newObj: obj,
                }),
            );
        }
    };

    const onDelete = () => {
        changeDispatchValues({ id: vehicle.id, delete: true });
        closeAndClear();
    };

    return (
        <Modal
            // title={'Добавление транспорта'}
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
                        <IntlMessage id={'service.data.modalTransport.addTransport'} />
                    </span>
                    <LanguageSwitcher size="small" fontSize="12px" height="1.4rem" />
                </div>
            }
            onClick={(e) => e.stopPropagation()}
            open={isOpen}
            onCancel={onClose}
            onOk={onOk}
            okText={<IntlMessage id={'service.data.modalAddPsycho.save'} />}
            cancelText={<IntlMessage id={'service.data.modalAddPsycho.cancel'} />}
            style={{ height: '100%', width: '100%' }}
            footer={
                <Row justify="end">
                    <Button danger onClick={onDelete}>
                        <IntlMessage id={'initiate.deleteAll'} />
                    </Button>
                    <Button onClick={closeAndClear}>
                        <IntlMessage id={'candidates.warning.cancel'} />
                    </Button>
                    <Button type="primary" onClick={onOk}>
                        <IntlMessage id={'initiate.save'} />
                    </Button>
                </Row>
            }
        >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col xs={24}>
                        <Form.Item
                            label={
                                <span style={{ fontSize: '14px' }}>
                                    <IntlMessage id={'service.data.modalTransport.marka'} />
                                </span>
                            }
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <IntlMessage
                                            id={'service.data.modalTransport.chooseMark'}
                                        />
                                    ),
                                },
                            ]}
                            required
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col xs={12}>
                        <Form.Item
                            label={
                                <span style={{ fontSize: '14px' }}>
                                    <IntlMessage id={'service.data.modalTransport.gosNumber'} />
                                </span>
                            }
                            name="number"
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <IntlMessage
                                            id={'service.data.modalTransport.chooseGosNum'}
                                        />
                                    ),
                                },
                            ]}
                            required
                        >
                            <Input
                                placeholder={IntlMessageText.getText({
                                    id: 'service.data.modalTransport.gosNumTransport',
                                })}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={12}>
                        <Form.Item
                            label={
                                <span style={{ fontSize: '14px' }}>
                                    <IntlMessage id={'service.data.modalRealty.buyDate'} />
                                </span>
                            }
                            name="date_from"
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <IntlMessage
                                            id={'service.data.modalTransport.chooseBuyDate'}
                                        />
                                    ),
                                },
                            ]}
                            required
                        >
                            <DatePicker
                                placeholder={IntlMessageText.getText({
                                    id: 'service.data.modalTransport.dateBuy',
                                })}
                                format="DD-MM-YYYY"
                                name="date_from"
                                style={{ width: '100%' }}
                                disabledDate={disabledDate}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24}>
                        <Form.Item
                            label={
                                <span style={{ fontSize: '14px' }}>
                                    <IntlMessage id={'service.data.modalTransport.vinCode'} />
                                </span>
                            }
                            name="vin_code"
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <IntlMessage
                                            id={'service.data.modalTransport.chooseVinCode'}
                                        />
                                    ),
                                },
                            ]}
                            required
                        >
                            <Input
                                placeholder={IntlMessageText.getText({
                                    id: 'service.data.modalTransport.vinCode',
                                })}
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
    );
};

export default ModalTransportEdit;
