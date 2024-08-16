import { InboxOutlined } from '@ant-design/icons';
import {Button, Checkbox, DatePicker, Form, Input, message, Modal, Row, Upload} from 'antd';
import IntlMessage, { IntlMessageText } from 'components/util-components/IntlMessage';
import { fileExtensions } from 'constants/FileExtensionConstants';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteByPath } from 'store/slices/myInfo/medicalInfoSlice';
import LanguageSwitcher from '../../../../../../../components/shared-components/LanguageSwitcher';
import FileUploaderService from '../../../../../../../services/myInfo/FileUploaderService';
import {
    addFieldValue,
    replaceByPath,
    setFieldValue,
} from '../../../../../../../store/slices/myInfo/myInfoSlice';
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const ModalAddDispensaryRegEdit = ({ isOpen, onClose, dispensaryObject, source = 'get' }) => {
    const [fileList, setFileList] = useState();
    const [filesChanged, setFilesChanged] = useState(false);
    const [accountingName, setAccountingName] = useState({ name: '', nameKZ: '' });
    const [registered, setRegistered] = useState({ name: '', nameKZ: '' });
    const [currentLanguage, setCurrentLanguage] = useState('rus');
    const [disabledDatePicker, setDisabled] = useState(false);

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const dispensary_registrations = useSelector(
        (state) => state.myInfo.edited.medical_card.dispensary_reg,
    );

    const handleFileRemove = () => {
        form.setFieldsValue({ dragger: [] });
        setFilesChanged(true);
    };

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
            setFileList(response.link);
            // Return the response link so it can be used in the onOk function
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
        return new Promise((resolve, reject) => {
            resolve();
        });
    };

    const handleChange = (e) => {
        if(e.target.checked===true) {
            setDisabled(true)
        } else if (e.target.checked===false) {
            setDisabled(false)
        }
    }

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

    const disabledDate = (current) => {
        // Disable dates before today
        return current && current > moment().startOf('day');
    };

    const onOk = async () => {
        try {
            const values = await form.validateFields();

            const link = filesChanged
                ? await handleFileUpload(values.dragger)
                : dispensaryObject.document_link;

            const newObject = {
                name: accountingName.name,
                nameKZ: accountingName.nameKZ,
                initiator: registered.name,
                initiatorKZ: registered.nameKZ,
                start_date: values.accounting_period[0].toDate(),
                end_date: disabledDatePicker=== true ? null : values.accounting_period[1].toDate(),
                document_link: link,
                id: dispensaryObject.id,
                profile_id: dispensaryObject.profile_id,
            };
            if (source === 'get') {
                // Delete from GET slice
                dispatch(
                    deleteByPath({
                        path: 'medicalInfo.dispensary_registrations',
                        id: dispensaryObject.id,
                    }),
                );
                // Add to Edited slice
                dispatch(
                    setFieldValue({
                        fieldPath: 'edited.medical_card.dispensary_reg',
                        value: [...dispensary_registrations, newObject],
                    }),
                );
            }
            if (source === 'edited') {
                // Edit current item in Edited slice (item already exists)
                dispatch(
                    replaceByPath({
                        path: 'edited.medical_card.dispensary_reg',
                        id: dispensaryObject.id,
                        newObj: newObject,
                    }),
                );
            }
            if (source === 'added') {
                // Edit item in myInfo.allTabs
                dispatch(
                    replaceByPath({
                        path: 'allTabs.medical_card.dispensary_reg',
                        id: dispensaryObject.id,
                        newObj: newObject,
                    }),
                );
            }

            form.resetFields();
            setFilesChanged(false);
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const validateLocalizationAccounting = () => {
        const isRusEmpty = accountingName.name===null || accountingName.name.trim() === '';
        const isKZEmpty = accountingName.nameKZ===null || accountingName.nameKZ.trim() === '';

        return new Promise((resolve, reject) => {
            if (isRusEmpty && isKZEmpty) {
                reject(<IntlMessage id="education.course.names.empty" />);
            } else if (isKZEmpty) {
                reject(<IntlMessage id="education.course.nameKZ.empty" />);
            } else if (isRusEmpty) {
                reject(<IntlMessage id="education.course.name.empty" />);
            } else {
                resolve();
            }
        });
    };

    const validateLocalizationRegistered = () => {
        const isRusEmpty = registered.name===null || registered.name.trim() === '';
        const isKZEmpty = registered.nameKZ===null || registered.nameKZ.trim() === '';

        return new Promise((resolve, reject) => {
            if (isRusEmpty && isKZEmpty) {
                reject(<IntlMessage id="education.course.names.empty" />);
            } else if (isKZEmpty) {
                reject(<IntlMessage id="education.course.nameKZ.empty" />);
            } else if (isRusEmpty) {
                reject(<IntlMessage id="education.course.name.empty" />);
            } else {
                resolve();
            }
        });
    };

    const handleInputAccounting = (event) => {
        setAccountingName({
            ...accountingName,
            [currentLanguage === 'rus' ? 'name' : 'nameKZ']: event.target.value,
        });
    };

    const handleInputRegistered = (event) => {
        setRegistered({
            ...registered,
            [currentLanguage === 'rus' ? 'name' : 'nameKZ']: event.target.value,
        });
    };

    const disabled = () => {
        if(disabledDatePicker===true){
            return [false,true]
        }
        return [false,false]
    };


    useEffect(() => {
        form.resetFields();
        const values = {
            accounting_period: [
                moment(dispensaryObject.start_date),
                dispensaryObject.end_date ? moment(dispensaryObject.end_date) : null,
            ],
        };
        setRegistered({ name: dispensaryObject.initiator, nameKZ: dispensaryObject.initiatorKZ });
        setAccountingName({ name: dispensaryObject.name, nameKZ: dispensaryObject.nameKZ });
        if(dispensaryObject.end_date===null) {
            setDisabled(true);
        }
        form.setFieldsValue(values);
        const getFile = async () => {
            const file = await FileUploaderService.getFileByLink(dispensaryObject.document_link);
            form.setFieldsValue({
                dragger: [file],
            });
        };
        getFile();
    }, [isOpen]);

    const changeDispatchValues = (obj) => {
        if (source === 'get') {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: 'medicalInfo.dispensary_registrations',
                    id: dispensaryObject.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: 'edited.medical_card.dispensary_reg',
                    value: obj,
                }),
            );
        }
        if (source === 'edited') {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: 'edited.medical_card.dispensary_reg',
                    id: dispensaryObject.id,
                    newObj: obj,
                }),
            );
        }
        if (source === 'added') {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: 'allTabs.medical_card.dispensary_reg',
                    id: dispensaryObject.id,
                    newObj: obj,
                }),
            );
        }
    };

    const closeAndClear = () => {
        form.resetFields();
        setFilesChanged(false);
        onClose();
    };
    const onDelete = () => {
        changeDispatchValues({ id: dispensaryObject.id, delete: true });
        closeAndClear();
    };

    return (
        <Modal
            // title={'Добавить сведения о диспансерном учете'}
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
                        <IntlMessage id="medical.add.dispanser" />
                    </span>
                    <LanguageSwitcher
                        size="small"
                        fontSize="12px"
                        height="1.4rem"
                        current={currentLanguage}
                        setLanguage={setCurrentLanguage}
                    />
                </div>
            }
            onClick={(e) => e.stopPropagation()}
            open={isOpen}
            onCancel={closeAndClear}
            onOk={onOk}
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
            style={{ height: '500px', width: '400px' }}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label={<IntlMessage id="medical.dispanser.desiese" />}
                    name="accounting_illness"
                    rules={[
                        {
                            validator: validateLocalizationAccounting,
                        },
                    ]}
                    required
                >
                    <Input
                        value={
                            currentLanguage === 'rus' ? accountingName.name : accountingName.nameKZ
                        }
                        onChange={handleInputAccounting}
                    />
                    <p className="fam_invisible_text">
                        {currentLanguage === 'rus' ? accountingName.name : accountingName.nameKZ}
                    </p>
                </Form.Item>

                <Form.Item
                    label={<IntlMessage id="medical.dispanser.place" />}
                    name="accounting_place"
                    rules={[
                        {
                            validator: validateLocalizationRegistered,
                        },
                    ]}
                    required
                >
                    <Input
                        value={currentLanguage === 'rus' ? registered.name : registered.nameKZ}
                        onChange={handleInputRegistered}
                    />
                    <p className="fam_invisible_text">
                        {currentLanguage === 'rus' ? registered.name : registered.nameKZ}
                    </p>
                </Form.Item>

                <Form.Item
                    label={<IntlMessage id="medical.dispanser.period" />}
                    name="accounting_period"
                    rules={[
                        {
                            required: true,
                            message: IntlMessageText.getText({
                                id: 'medical.dispanser.period.enter',
                            }),
                        },
                    ]}
                    required
                >
                    <DatePicker.RangePicker
                        style={{
                            width: '100%',
                        }}
                        placeholder={[
                            IntlMessageText.getText({
                                id: 'medical.dispanser.period.from',
                            }),
                            IntlMessageText.getText({
                                id: 'medical.dispanser.period.to',
                            }),
                        ]}
                        format="DD-MM-YYYY"
                        name="accounting_period"
                        disabledDate={disabledDate}
                        disabled={disabled()}
                    />
                </Form.Item>
                <Form.Item name={"checkbox"}>
                    <Checkbox defaultChecked={disabledDatePicker} onChange={(e) => {
                        handleChange(e)
                    }}><IntlMessage id={'present'} /></Checkbox>
                </Form.Item>
                <Form.Item>
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
    );
};

export default ModalAddDispensaryRegEdit;
