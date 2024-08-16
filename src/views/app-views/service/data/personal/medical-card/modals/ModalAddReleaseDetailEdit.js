import { InboxOutlined } from '@ant-design/icons';
import { DatePicker, Form, Input, message, Modal, Select, Tag, Divider, Row, Space, Button } from "antd";
import Dragger from 'antd/es/upload/Dragger';
import IntlMessage, { IntlMessageText } from 'components/util-components/IntlMessage';
import { fileExtensions } from 'constants/FileExtensionConstants';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LanguageSwitcher from '../../../../../../../components/shared-components/LanguageSwitcher';
import FileUploaderService from '../../../../../../../services/myInfo/FileUploaderService';
import { deleteByPath } from '../../../../../../../store/slices/myInfo/medicalInfoSlice';
import {
    addFieldValue,
    replaceByPath,
    setFieldValue,
} from '../../../../../../../store/slices/myInfo/myInfoSlice';
import { useTranslation } from 'react-i18next';
import MedicalService from 'services/myInfo/MedicalService';
import { PlusOutlined } from '@ant-design/icons';
import { setLiberaltions } from 'store/slices/myInfo/medicalInfoSlice';
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const defaultValues = {
    kz: '',
    ru: '',
};
const languages = Object.keys(defaultValues);
const ModalAddReleaseDetailEdit = ({ isOpen, onClose, releaseObject, source = 'get' }) => {
    const [editedReason, setEditedReason] = useState('');
    const [editedNameInstitution, setEditedNameInstitution] = useState('');
    const [editedReleaseFrom, setEditedReleaseFrom] = useState('');
    const [fileList, setFileList] = useState();
    const [filesChanged, setFilesChanged] = useState(false);

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const release_detail = useSelector((state) => state.myInfo.edited.medical_card.release_detail);
    const liberations = useSelector((state) => state.medicalInfo.liberations);
    const liberationOptions =
        liberations &&
        liberations?.objects?.map((item) => ({
            value: item.id,
            label: item.name,
        }));
    const [reason, setReason] = useState({ name: '', nameKZ: '' });
    const [institutionsName, setInstitutionsName] = useState({ name: '', nameKZ: '' });
    const [currentLanguage, setCurrentLanguage] = useState('rus');

    const { t } = useTranslation();

    const [values, setValues] = useState(defaultValues);

    const handleValuesChange = (event, language) => {
        setValues((prev) => ({ ...prev, [language]: event.target.value }));
    };

    const handleButtonClick = async () => {
        try {
            await MedicalService.createLibearations({ name: values.ru, nameKZ: values.kz })

            const response = await MedicalService.getLiberations()
            dispatch(setLiberaltions(response))

            setValues(defaultValues)
        } catch (error) {
            console.log(error)
        }
    }

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

    const validateLocalizationReason = () => {
        const isRusEmpty = reason.name === null || reason.name.trim() === '';
        const isKZEmpty = reason.nameKZ === null || reason.nameKZ.trim() === '';

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

    const validateLocalizationInstitutions = () => {
        const isRusEmpty = institutionsName.name.trim() === '';
        const isKZEmpty = institutionsName.nameKZ.trim() === '';

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

    const handleInputReason = (event) => {
        setReason({
            ...reason,
            [currentLanguage === 'rus' ? 'name' : 'nameKZ']: event.target.value,
        });
    };

    const handleInputInstitution = (event) => {
        setInstitutionsName({
            ...institutionsName,
            [currentLanguage === 'rus' ? 'name' : 'nameKZ']: event.target.value,
        });
    };

    const onOk = async () => {
        try {
            const values = await form.validateFields();

            const link = filesChanged
                ? await handleFileUpload(values.dragger)
                : releaseObject.document_link;

            const released = [];

            values.released.forEach((id) => {
                const liberation = liberations?.objects?.find((item) => item.id === id);

                if (liberation) {
                    released.push(liberation);
                }
            });

            const newObject = {
                reason: reason.name,
                reasonKZ: reason.nameKZ,
                initiator: institutionsName.name,
                initiatorKZ: institutionsName.nameKZ,
                start_date: values.released_period[0].toDate(),
                end_date: values.released_period[1].toDate(),
                document_link: link,
                id: releaseObject.id,
                profile_id: releaseObject.profile_id,
                liberation_ids: released,
            };

            if (source === 'get') {
                // Delete from GET slice
                dispatch(
                    deleteByPath({
                        path: 'medicalInfo.user_liberations',
                        id: releaseObject.id,
                    }),
                );
                // Add to Edited slice
                dispatch(
                    setFieldValue({
                        fieldPath: 'edited.medical_card.release_detail',
                        value: [...release_detail, newObject],
                    }),
                );
            }
            if (source === 'edited') {
                // Edit current item in Edited slice (item already exists)
                dispatch(
                    replaceByPath({
                        path: 'edited.medical_card.release_detail',
                        id: releaseObject.id,
                        newObj: newObject,
                    }),
                );
            }
            if (source === 'added') {
                // Edit item in myInfo.allTabs
                dispatch(
                    replaceByPath({
                        path: 'allTabs.medical_card.release_detail',
                        id: releaseObject.id,
                        newObj: newObject,
                    }),
                );
            }
            form.resetFields();
            setFilesChanged(false);
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        form.resetFields();
        const liberationIds = releaseObject.liberation_ids.map((item) => item.id);
        const flatLiberationIds = liberationIds.flat();
        const values = {
            released: flatLiberationIds,
            released_period: [moment(releaseObject.start_date), moment(releaseObject.end_date)],
        };
        setReason({ name: releaseObject.reason, nameKZ: releaseObject.reasonKZ });
        setInstitutionsName({ name: releaseObject.initiator, nameKZ: releaseObject.initiatorKZ });
        form.setFieldsValue(values);

        if (releaseObject.document_link) {
            const getFile = async () => {
                const file = await FileUploaderService.getFileByLink(releaseObject.document_link);
                form.setFieldsValue({
                    dragger: [file],
                });
            };
            getFile();
        }
    }, [isOpen]);
    const changeDispatchValues = (obj) => {
        if (source === 'get') {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: 'medicalInfo.user_liberations',
                    id: releaseObject.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: 'edited.medical_card.release_detail',
                    value: obj,
                }),
            );
        }
        if (source === 'edited') {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: 'edited.medical_card.release_detail',
                    id: releaseObject.id,
                    newObj: obj,
                }),
            );
        }
        if (source === 'added') {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: 'allTabs.medical_card.release_detail',
                    id: releaseObject.id,
                    newObj: obj,
                }),
            );
        }
    };

    const onDelete = () => {
        changeDispatchValues({ id: releaseObject.id, delete: true });

        closeAndClear();
    };

    const tagRender = (props) => {
        const { label, value, closable, onClose } = props;
        const onPreventMouseDown = (event) => {
            event.preventDefault();
            event.stopPropagation();
        };
        return (
            <Tag
                color={'#F0F5FF'}
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={onClose}
                style={{
                    marginRight: 3,
                    fontSize: '10px',
                    borderColor: '#ADC6FF',
                    color: '#2F54EB',
                    borderRadius: '15px',
                }}
            >
                {label}
            </Tag>
        );
    };
    const closeAndClear = () => {
        form.resetFields();
        setFilesChanged(false);
        onClose();
    };

    return (
        <Modal
            // title={'Добавить сведения об освобождении'}
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
                        <IntlMessage id="medical.upload.doc.free" />
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
                    label={<IntlMessage id="medical.upload.doc.free.reason" />}
                    name="reason"
                    rules={[
                        {
                            validator: validateLocalizationReason,
                        },
                    ]}
                    required
                >
                    <Input
                        value={currentLanguage === 'rus' ? reason.name : reason.nameKZ}
                        onChange={handleInputReason}
                    />
                    <p className="fam_invisible_text">
                        {currentLanguage === 'rus' ? reason.name : reason.nameKZ}
                    </p>
                </Form.Item>
                <Form.Item
                    label={<IntlMessage id="medical.name.UCH" />}
                    name="name"
                    rules={[
                        {
                            validator: validateLocalizationInstitutions,
                        },
                    ]}
                    required
                >
                    <Input
                        value={
                            currentLanguage === 'rus'
                                ? institutionsName.name
                                : institutionsName.nameKZ
                        }
                        onChange={handleInputInstitution}
                    />
                    <p className="fam_invisible_text">
                        {currentLanguage === 'rus'
                            ? institutionsName.name
                            : institutionsName.nameKZ}
                    </p>
                </Form.Item>

                <Form.Item
                    label={<IntlMessage id="medical.upload.doc.free.for" />}
                    rules={[
                        {
                            required: true,
                            message: IntlMessageText.getText({
                                id: 'medical.upload.doc.free.for.enter',
                            }),
                        },
                    ]}
                    name="released"
                    required
                >
                    <Select
                        mode="multiple"
                        showArrow
                        tagRender={tagRender}
                        style={{
                            width: '100%',
                        }}
                        options={liberationOptions}
                        value={editedReleaseFrom}
                        showSearch
                        filterOption={(inputValue, option) =>
                            option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                        }
                        dropdownRender={(menu) => {
                            return (
                                <>
                                    {menu}
                                    <Divider style={{ margin: '8px 0' }} />
                                    <Space style={{ padding: '4px 8px' }}>
                                        <Row>
                                            {languages.map((lang, idx) => (
                                                <Input
                                                    key={lang}
                                                    value={values[lang]}
                                                    onChange={(e) => handleValuesChange(e, lang)}
                                                    placeholder={t(`userData.modals.add.type.${lang}`)}
                                                    style={
                                                        idx !== 0
                                                            ? {
                                                                marginTop: 10,
                                                            }
                                                            : {}
                                                    }
                                                />
                                            ))}
                                        </Row>
                                        <Row align="top" className="fam_select_add_button">
                                            <Button
                                                type="text"
                                                icon={<PlusOutlined />}
                                                onClick={handleButtonClick}
                                                disabled={Object.values(values).some((value) => !value)}
                                            >
                                                {t('select.picker.menu.add')}
                                            </Button>
                                        </Row>
                                    </Space>
                                </>
                            )
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label={<IntlMessage id="medical.upload.doc.free.period" />}
                    name="released_period"
                    rules={[
                        {
                            required: true,
                            message: IntlMessageText.getText({
                                id: 'medical.upload.doc.free.period.enter',
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
                                id: 'medical.upload.doc.free.period.from',
                            }),
                            IntlMessageText.getText({
                                id: 'medical.upload.doc.free.period.to',
                            }),
                        ]}
                        format="DD-MM-YYYY"
                        onChange={(released_period) => {
                            form.setFieldsValue({ released_period }); // Update the form field value
                        }}
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

export default ModalAddReleaseDetailEdit;
