import { InboxOutlined } from '@ant-design/icons';
import {Button, DatePicker, Form, Input, message, Modal, Row} from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import IntlMessage, { IntlMessageText } from 'components/util-components/IntlMessage';
import { fileExtensions } from 'constants/FileExtensionConstants';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteByPath } from 'store/slices/myInfo/medicalInfoSlice';
import {addFieldValue, replaceByPath, setFieldValue} from 'store/slices/myInfo/myInfoSlice';
import LanguageSwitcher from '../../../../../../../components/shared-components/LanguageSwitcher';
import FileUploaderService from '../../../../../../../services/myInfo/FileUploaderService';
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const ModalSickListEdit = ({ isOpen, onClose, sickObject, source = 'get' }) => {
    const [editedNameSickList, setEditedNameSickList] = useState('');
    const [editedNameInstitution, setEditedNameInstitution] = useState('');
    const [fileList, setFileList] = useState();
    const [filesChanged, setFilesChanged] = useState(false);

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const sick_list = useSelector((state) => state.myInfo.edited.medical_card.sick_list);
    const [sickName, setSickName] = useState({ name: '', nameKZ: '' });
    const [placeName, setPlaceName] = useState({ name: '', nameKZ: '' });
    const [currentLanguage, setCurrentLanguage] = useState('rus');

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

            const link = filesChanged
                ? await handleFileUpload(values.dragger)
                : sickObject.document_link;

            const newObject = {
                code: values.code,
                reason: sickName.name,
                reasonKZ: sickName.nameKZ,
                place: placeName.name,
                placeKZ: placeName.nameKZ,
                start_date: values.sick_leave_period[0].toDate(),
                end_date: values.sick_leave_period[1].toDate(),
                document_link: link,
                id: sickObject.id,
                profile_id: sickObject.profile_id,
            };

            if (source === 'get') {
                // Delete from GET slice
                dispatch(
                    deleteByPath({
                        path: 'medicalInfo.hospital_datas',
                        id: sickObject.id,
                    }),
                );
                // Add to Edited slice
                dispatch(
                    setFieldValue({
                        fieldPath: 'edited.medical_card.sick_list',
                        value: [...sick_list, newObject],
                    }),
                );
            }
            if (source === 'edited') {
                // Edit current item in Edited slice (item already exists)
                dispatch(
                    replaceByPath({
                        path: 'edited.medical_card.sick_list',
                        id: sickObject.id,
                        newObj: newObject,
                    }),
                );
            }
            if (source === 'added') {
                // Edit item in myInfo.allTabs
                dispatch(
                    replaceByPath({
                        path: 'allTabs.medical_card.sick_list',
                        id: sickObject.id,
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
    const validateLocalizationSick = () => {
        const isRusEmpty = sickName.name===null || sickName.name.trim() === '';
        const isKZEmpty = sickName.nameKZ===null || sickName.nameKZ.trim() === '';

        return new Promise((resolve, reject) => {
            if (isRusEmpty && isKZEmpty) {
                reject(<IntlMessage id="field.required" />);
            } else if (isKZEmpty) {
                reject(<IntlMessage id="field.required.kazakh" />);
            } else if (isRusEmpty) {
                reject(<IntlMessage id="field.required.russian" />);
            } else {
                resolve();
            }
        });
    };

    const validateLocalizationPlace = () => {
        const isRusEmpty = placeName.name.trim() === '';
        const isKZEmpty = placeName.nameKZ.trim() === '';

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


    const handleInputSick = (event) => {
        setSickName({
            ...sickName,
            [currentLanguage === 'rus' ? 'name' : 'nameKZ']: event.target.value,
        });
    };

    const handleInputPlace = (event) => {
        setPlaceName({
            ...placeName,
            [currentLanguage === 'rus' ? 'name' : 'nameKZ']: event.target.value,
        });
    };


    useEffect(() => {
        form.resetFields();
        const values = {
            code: sickObject.code,
            sick_leave_period: [moment(sickObject.start_date), moment(sickObject.end_date)],
        };
        setSickName({name: sickObject.reason, nameKZ: sickObject.reasonKZ});
        setPlaceName({name: sickObject.place, nameKZ: sickObject.placeKZ});

        form.setFieldsValue(values);
        const getFile = async () => {
            const file = await FileUploaderService.getFileByLink(sickObject.document_link);
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
                    path: 'medicalInfo.hospital_datas',
                    id: sickObject.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: 'edited.medical_card.sick_list',
                    value: obj,
                }),
            );
        }
        if (source === 'edited') {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: 'edited.medical_card.sick_list',
                    id: sickObject.id,
                    newObj: obj,
                }),
            );
        }
        if (source === 'added') {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: 'allTabs.medical_card.sick_list',
                    id: sickObject.id,
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
        changeDispatchValues({ id: sickObject.id, delete: true });

        closeAndClear();
    };

    return (
        <Modal
            // title={'Добавить больничный лист'}
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
                        <IntlMessage id="medical.add.list" />
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
            onCancel={onClose}
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
                    label={'Код'}
                    name="code"
                    rules={[{ required: true, message: 'Введите код' }]}
                    required
                >
                    <Input
                        value={editedNameSickList}
                        onChange={(event) => setEditedNameSickList(event.target.value)}
                    />
                </Form.Item>
                <Form.Item
                    label={<IntlMessage id="medical.name.desiese" />}
                    name="name_diseases"
                    rules={[
                        {
                            validator: validateLocalizationSick,
                        },
                    ]}
                    required
                >
                    <Input
                        value={
                            currentLanguage === 'rus' ? sickName.name : sickName.nameKZ
                        }
                        onChange={handleInputSick}
                    />
                    <p className="fam_invisible_text">
                        {currentLanguage === 'rus' ? sickName.name : sickName.nameKZ}
                    </p>
                </Form.Item>
                <Form.Item
                    label={<IntlMessage id="medical.name.UCH" />}
                    name="name_institutions"
                    rules={[
                        {
                            validator: validateLocalizationPlace,
                        },
                    ]}
                    required
                >
                    <Input
                        value={
                            currentLanguage === 'rus' ? placeName.name : placeName.nameKZ
                        }
                        onChange={handleInputPlace}
                    />
                    <p className="fam_invisible_text">
                        {currentLanguage === 'rus' ? placeName.name : placeName.nameKZ}
                    </p>
                </Form.Item>
                <Form.Item
                    label={<IntlMessage id="medical.period" />}
                    name="sick_leave_period"
                    rules={[
                        {
                            required: true,
                            message: IntlMessageText.getText({
                                id: 'medical.enter.period',
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
                                id: 'medical.period.from',
                            }),
                            IntlMessageText.getText({
                                id: 'medical.period.to',
                            }),
                        ]}
                        format="DD-MM-YYYY"
                        name="sick_leave_period"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item
                        name="dragger"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        noStyle
                        rules={[{ validator: validateFileList }]}
                    >
                        <Dragger fileList={fileList} {...props}>
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

export default ModalSickListEdit;
