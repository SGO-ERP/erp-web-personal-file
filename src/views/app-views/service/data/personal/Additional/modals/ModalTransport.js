import { InboxOutlined } from '@ant-design/icons';
import { Col, DatePicker, Form, Input, message, Modal, Row, Upload } from 'antd';
import { fileExtensions } from 'constants/FileExtensionConstants';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LanguageSwitcher from '../../../../../../../components/shared-components/LanguageSwitcher';
import FileUploaderService from '../../../../../../../services/myInfo/FileUploaderService';
import { setFieldValue } from '../../../../../../../store/slices/myInfo/myInfoSlice';
import uuidv4 from '../../../../../../../utils/helpers/uuid';
import IntlMessage, {
    IntlMessageText,
} from '../../../../../../../components/util-components/IntlMessage';
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const { Dragger } = Upload;
const ModalTransport = ({ isOpen, onClose }) => {
    const [form] = Form.useForm();
    const [file, setFile] = useState();
    const dispatch = useDispatch();
    const transport = useSelector((state) => state.myInfo.allTabs.additional.transport);
    const [currentLanguage, setCurrentLanguage] = useState('rus');
    const [name, setName] = useState({ name: '', nameKZ: '' });

    const handleInputName = (event) => {
        setName({
            ...name,
            [currentLanguage === 'rus' ? 'name' : 'nameKZ']: event.target.value,
        });
    };

    const handleFileUpload = async (fileList) => {
        if (!fileList) {
            return undefined;
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
            void message.error(<IntlMessage id={'service.data.modalAddPsycho.cannotLoadFile'} />);
        }
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const validateFileList = (rule, value) => {
        return new Promise((resolve, reject) => {
            resolve();
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
        try {
            const values = await form.validateFields();
            const response = await handleFileUpload(values.dragger);
            const newObject = {
                name: name.name,
                nameKZ: name.nameKZ,
                number: values.number,
                date_from: values.date_from.toDate(),
                document_link: response,
                id: uuidv4(),
                vin_code: values.vin_code,
            };
            dispatch(
                setFieldValue({
                    fieldPath: 'allTabs.additional.transport',
                    value: [...transport, newObject],
                }),
            );
            form.resetFields();
            onCancel();
        } catch (error) {
            throw new Error(error);
        }
    };

    const onCancel = () => {
        form.resetFields();
        setName({ name: '', nameKZ: '' });
        onClose();
    };

    const validateLocalizationName = () => {
        const isRusEmpty = name.name.trim() === '';
        const isKZEmpty = name.nameKZ.trim() === '';

        return new Promise((resolve, reject) => {
            if (isRusEmpty && isKZEmpty) {
                reject(<IntlMessage id={'service.data.modalTransport.chooseMark'} />);
            } else if (isKZEmpty) {
                reject(<IntlMessage id={'field.required.kazakh'} />);
            } else if (isRusEmpty) {
                reject(<IntlMessage id={'field.required.russian'} />);
            } else {
                resolve();
            }
        });
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
                            <IntlMessage id={'service.data.modalTransport.addTransport'} />
                        </span>
                        <LanguageSwitcher
                            current={currentLanguage}
                            setLanguage={setCurrentLanguage}
                            size="small"
                            fontSize="12px"
                            height="1.4rem"
                        />
                    </div>
                }
                open={isOpen}
                onCancel={onCancel}
                onOk={onOk}
                okText={<IntlMessage id={'service.data.modalAddPsycho.save'} />}
                cancelText={<IntlMessage id={'service.data.modalAddPsycho.cancel'} />}
                style={{ height: '100%', width: '100%' }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label={
                            <span style={{ fontSize: '14px' }}>
                                <IntlMessage id={'service.data.modalTransport.marka'} />
                            </span>
                        }
                        name="name"
                        rules={[
                            {
                                validator: validateLocalizationName,
                            },
                        ]}
                        required
                    >
                        <Input
                            value={currentLanguage === 'rus' ? name.name : name.nameKZ}
                            onChange={handleInputName}
                        />
                        <p className="fam_invisible_text">
                            {currentLanguage === 'rus' ? name.name : name.nameKZ}
                        </p>
                    </Form.Item>

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
                                    <IntlMessage
                                        id={'service.data.modalAddPsycho.clickFileToLoad'}
                                    />
                                </p>
                            </Dragger>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ModalTransport;
