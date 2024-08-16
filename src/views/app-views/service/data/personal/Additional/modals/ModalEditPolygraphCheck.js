import { InboxOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Upload } from 'antd';
import IntlMessage, { IntlMessageText } from 'components/util-components/IntlMessage';
import { fileExtensions } from 'constants/FileExtensionConstants';
import moment from 'moment';
import 'moment/locale/ru';
import { useEffect, useState } from 'react';
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

const ModalEditPolygraphCheck = ({ isOpen, onClose, polygraphObject, source }) => {
    const [file, setFile] = useState();
    const dispatch = useDispatch();

    const polygraphsList = useSelector((state) => state.myInfo.edited.additional.polygraph_checks);

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
                reject(<IntlMessage id={'service.data.modalAddPsycho.pleaseLoadFile'} />);
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
        const link = values.dragger
            ? await handleFileUpload(values.dragger)
            : polygraphObject.document_link;
        const newObject = {
            issued_by: values.issued_by,
            number: values.number,
            date_of_issue: values.date_of_issue.toDate(),
            document_link: link, //+
            profile_id: polygraphObject.profile_id, //+
            id: polygraphObject.id, //+
        };
        if (source === 'get') {
            // Delete from GET slice

            dispatch(
                deleteByPath({
                    path: 'additional.data.polygraph_checks', //+
                    id: polygraphObject.id, // +
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: 'edited.additional.polygraph_checks', //+
                    value: newObject,
                }),
            );
        }
        if (source === 'edited') {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: 'edited.additional.polygraph_checks', //+
                    id: polygraphObject.id, //+
                    newObj: newObject,
                }),
            );
        }
        if (source === 'added') {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: 'allTabs.additional.polygraph_checks',
                    id: polygraphObject.id,
                    newObj: newObject,
                }),
            );
        }
        form.resetFields();
        onClose();
    };

    useEffect(() => {
        form.resetFields();
        const values = {
            issued_by: polygraphObject.issued_by,
            number: polygraphObject.number,
            date_of_issue: moment(polygraphObject.date_of_issue),
        };
        form.setFieldsValue(values);
        const getFile = async () => {
            const file = await FileUploaderService.getFileByLink(polygraphObject.document_link);
            form.setFieldsValue({
                dragger: [file],
            });
        };
        getFile();
    }, [polygraphObject, form, isOpen]);

    const closeAndClear = () => {
        form.resetFields();
        onClose();
    };

    const changeDispatchValues = (obj) => {
        if (source === 'get') {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: 'additional.data.polygraph_checks',
                    id: polygraphObject.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: 'edited.additional.polygraph_checks',
                    value: obj,
                }),
            );
        }
        if (source === 'edited') {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: 'edited.additional.polygraph_checks',
                    id: polygraphObject.id,
                    newObj: obj,
                }),
            );
        }
        if (source === 'added') {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: 'allTabs.additional.polygraph_checks',
                    id: polygraphObject.id,
                    newObj: obj,
                }),
            );
        }
    };

    const onDelete = () => {
        changeDispatchValues({ id: polygraphObject.id, delete: true });
        closeAndClear();
    };

    return (
        <Modal
            // title={'Добавить результаты полиграфа'}
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
                        <IntlMessage id={'service.data.modalAddResultsPolyg.addPolygResult'} />
                    </span>
                </div>
            }
            onClick={(e) => e.stopPropagation()}
            open={isOpen}
            onCancel={onClose}
            onOk={onOk}
            okText={<IntlMessage id={'service.data.modalAddPsycho.save'} />}
            cancelText={<IntlMessage id={'service.data.modalAddPsycho.cancel'} />}
            style={{ height: '100%', width: '100%' }}
        >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col xs={24}>
                        <Form.Item
                            label={
                                <span style={{ fontSize: '14px' }}>
                                    <IntlMessage
                                        id={'service.data.modalAddResultsPolyg.whomPolyg'}
                                    />
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <IntlMessage
                                            id={'service.data.modalAddResultsPolyg.chooseWhomPolyg'}
                                        />
                                    ),
                                },
                            ]}
                            name="issued_by"
                            required
                        >
                            <Input placeholder="Ашимов Адлет Маратович" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={12}>
                        <Form.Item
                            label={
                                <span style={{ fontSize: '14px' }}>
                                    <IntlMessage id={'service.data.modalAddPsycho.docInfo'} />
                                </span>
                            }
                            name="number"
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <IntlMessage id={'service.data.modalAddPsycho.chooseDoc'} />
                                    ),
                                },
                            ]}
                            required
                        >
                            <Input
                                placeholder={IntlMessageText.getText({
                                    id: 'service.data.modalAddPsycho.docNum',
                                })}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={12}>
                        <Form.Item
                            label={<span style={{ fontSize: '14px' }}></span>}
                            name="date_of_issue"
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <IntlMessage
                                            id={'service.data.modalAddPsycho.chooseDateCreate'}
                                        />
                                    ),
                                },
                            ]}
                        >
                            <DatePicker
                                placeholder={IntlMessageText.getText({
                                    id: 'service.data.modalAddPsycho.dateCreate',
                                })}
                                style={{ width: '100%' }}
                                format="DD-MM-YYYY"
                                name="date"
                                disabledDate={disabledDate}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Form.Item
                        name="dragger"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        noStyle
                        // rules={[{ validator: validateFileList }]}
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

export default ModalEditPolygraphCheck;
