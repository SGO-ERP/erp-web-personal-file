import { components } from 'API/types';
import React, { FC, useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, Modal, Row, Upload, message } from 'antd';
import IntlMessage, { IntlMessageText } from 'components/util-components/IntlMessage';
import LanguageSwitcher from 'components/shared-components/LanguageSwitcher';
import { useAppSelector } from 'hooks/useStore';
import moment from 'moment';
import { fileExtensions } from 'constants/FileExtensionConstants';
import { InboxOutlined } from '@ant-design/icons';
import FileUploaderService, { headers } from 'services/myInfo/FileUploaderService';
import { useDispatch } from 'react-redux';
import { deleteByPath } from 'store/slices/myInfo/additionalSlice';
import { addFieldValue, replaceByPath, setFieldValue } from 'store/slices/myInfo/myInfoSlice';
import { UploadChangeParam } from 'antd/lib/upload';
import { useViolationName } from 'hooks/useViolationName/useViolationName';
import { SelectPickerMenu } from '../../../PersonalData/BiographicInfo/SelectPickerMenu';
import { defaultViolationNameOption } from 'hooks/useViolationName/data';
import { PrivateServices } from 'API';
import { S3_BASE_URL } from 'configs/AppConfig';
import { PERMISSION } from 'constants/permission';

type Offense = components['schemas']['ViolationRead'];

type TOffenseEditModal = {
    isOpen: boolean;
    offense: Offense;
    onClose: () => void;
    source?: 'get' | 'edited' | 'added';
};

const OffenseEditModal: FC<TOffenseEditModal> = ({ isOpen, offense, onClose, source = 'get' }) => {
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    const [file, setFile] = useState();
    const [filesChanged, setFilesChanged] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState('rus');
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const [article_number, setArticle_number] = useState({ name: '', nameKZ: '' });
    const [issued_by, setIssued_by] = useState({ name: '', nameKZ: '' });
    const [consequence, setConsequence] = useState({ name: '', nameKZ: '' });

    const {
        violationNameOption,
        violationNameOptions,
        violationNameOptionsLoading,
        setViolationNameOption,
        getAllViolationTypes,
        handleViolationNameChange,
        handleAddNewViolationName
    } = useViolationName(currentLanguage);

    const violations = useAppSelector((state) => state.myInfo.edited.additional.violations);

    const handleInputArticleNumber = (event) => {
        setArticle_number({
            ...article_number,
            [currentLanguage === 'rus' ? 'name' : 'nameKZ']: event.target.value,
        });
    };

    const handleInputIssuedBy = (event) => {
        setIssued_by({
            ...issued_by,
            [currentLanguage === 'rus' ? 'name' : 'nameKZ']: event.target.value,
        });
    };

    const handleInputConsequence = (event) => {
        setConsequence({
            ...consequence,
            [currentLanguage === 'rus' ? 'name' : 'nameKZ']: event.target.value,
        });
    };

    const disabledDate = (current: moment.Moment) => {
        // Disable dates before today
        return current && current > moment().startOf('day');
    };

    const normFile = (e: UploadChangeParam) => {
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

    const handleFileUpload = async (fileList: any[]) => {
        setFilesChanged(true);
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
            message.error(<IntlMessage id={'service.data.modalAddPsycho.cannotLoadFile'} />);
        }
    };

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const link = filesChanged
                ? await handleFileUpload(values.dragger)
                : offense.document_link;

            const newObject = {
                id: offense.id,
                violation_type_id: violationNameOption.rus.value,
                name: violationNameOption.rus.label,
                nameKZ: violationNameOption.kaz.label,
                date: values.date.toDate(),
                issued_by: issued_by.name,
                issued_byKZ: issued_by.nameKZ,
                article_number: article_number.name,
                article_numberKZ: article_number.nameKZ,
                consequence: consequence.name,
                document_link: link ?? null,
                consequenceKZ: consequence.nameKZ,
            };

            if (source === 'get') {
                // Delete from GET slice
                dispatch(
                    deleteByPath({
                        path: 'additional.data.violations', //+
                        id: offense.id, // +
                    }),
                );
                // Add to Edited slice
                dispatch(
                    setFieldValue({
                        fieldPath: 'edited.additional.violations', //+
                        value: [...violations, newObject],
                    }),
                );
            }
            if (source === 'edited') {
                // Edit current item in Edited slice (item already exists)
                dispatch(
                    replaceByPath({
                        path: 'edited.additional.violations', //+
                        id: offense.id, //+
                        newObj: newObject,
                    }),
                );
            }
            if (source === 'added') {
                // Edit item in myInfo.allTabs
                dispatch(
                    replaceByPath({
                        path: 'allTabs.additional.violations',
                        id: offense.id,
                        newObj: newObject,
                    }),
                );
            }
            closeAndClear();
        } catch (error) {
            console.log(error);
        }
    };

    const handleFileRemove = () => {
        form.setFieldsValue({ dragger: [] });
        setFilesChanged(true);
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

    useEffect(() => {
        form.resetFields();
        const values = {
            date: moment(offense.date),
        };
        form.setFieldsValue(values);

        setViolationNameOption({
            rus: {
                value: '',
                label: offense.name || '',
            },
            kaz: {
                value: '',
                label: offense.nameKZ || '',
            },
        });
        setIssued_by({ name: offense.issued_by, nameKZ: offense.issued_byKZ || '' });
        setArticle_number({ name: offense.article_number, nameKZ: offense.article_numberKZ || '' });
        setConsequence({ name: offense.consequence, nameKZ: offense.consequenceKZ || '' });

        const getFile = async () => {
            const file = await FileUploaderService.getFileByLink(offense.document_link);
            form.setFieldsValue({
                dragger: [file],
            });
        };
        getFile();
    }, [offense, isOpen, form]);

    const closeAndClear = () => {
        form.resetFields();
        setFilesChanged(false);
        setViolationNameOption(defaultViolationNameOption);
        setArticle_number({ name: '', nameKZ: '' });
        setIssued_by({ name: '', nameKZ: '' });
        setArticle_number({ name: '', nameKZ: '' });
        setConsequence({ name: '', nameKZ: '' });
        onClose();
    };

    const changeDispatchValues = (obj: any) => {
        if (source === 'get') {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: 'additional.data.violations',
                    id: offense.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: 'edited.additional.violations',
                    value: obj,
                }),
            );
        }
        if (source === 'edited') {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: 'edited.additional.violations',
                    id: offense.id,
                    newObj: obj,
                }),
            );
        }
        if (source === 'added') {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: 'allTabs.additional.violations',
                    id: offense.id,
                    newObj: obj,
                }),
            );
        }
    };

    const onDelete = () => {
        changeDispatchValues({ id: offense.id, delete: true });
        closeAndClear();
    };

    const validateLocalizationName = () => {
        if (violationNameOption.rus.label == null || violationNameOption.kaz.label == null) {
            return;
        }
        const isRusEmpty = violationNameOption.rus.label.trim() === '';
        const isKZEmpty = violationNameOption.kaz.label.trim() === '';

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

    const validateLocalizationIssuedBy = () => {
        const isRusEmpty = issued_by.name === null || issued_by.name.trim() === '';
        const isKZEmpty = issued_by.nameKZ === null || issued_by.nameKZ.trim() === '';

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

    const validateLocalizationArticleNumber = () => {
        const isRusEmpty = article_number.name === null || article_number.name.trim() === '';
        const isKZEmpty = article_number.nameKZ === null || article_number.nameKZ.trim() === '';

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

    const validateLocalizationConsequence = () => {
        const isRusEmpty = consequence.name === null || consequence.name.trim() === '';
        const isKZEmpty = consequence.nameKZ === null || consequence.nameKZ.trim() === '';

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

    return (
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
                        <IntlMessage id={'service.data.modalAddViolation.title'} />
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
            open={isOpen && isHR}
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
            okText={<IntlMessage id={'service.data.modalAddPsycho.save'} />}
            cancelText={<IntlMessage id={'service.data.modalAddPsycho.cancel'} />}
            style={{ height: '500px', width: '400px' }}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label={<IntlMessage id={'schedule.qualreq.name'} />}
                    name="name"
                    rules={[
                        {
                            validator: validateLocalizationName,
                        },
                    ]}
                    required
                >
                    <SelectPickerMenu
                        value={violationNameOption[currentLanguage]}
                        defaultValue={offense.violation_type_id}
                        options={violationNameOptions[currentLanguage]}
                        onChange={handleViolationNameChange}
                        optionsLoading={violationNameOptionsLoading}
                        handleAddNewOption={handleAddNewViolationName}
                    />
                    {/* <Input
                        value={currentLanguage === "rus" ? name.name : name.nameKZ}
                        onChange={handleInputName}
                    /> */}
                </Form.Item>
                <Form.Item
                    label={<IntlMessage id={'personal.additional.offenceList.committedBy'} />}
                    name="issued_by"
                    rules={[
                        {
                            validator: validateLocalizationIssuedBy,
                        },
                    ]}
                    required
                >
                    <Input
                        value={currentLanguage === 'rus' ? issued_by.name : issued_by.nameKZ}
                        onChange={handleInputIssuedBy}
                    />
                    <p className="fam_invisible_text">
                        {currentLanguage === 'rus' ? issued_by.name : issued_by.nameKZ}
                    </p>
                </Form.Item>

                <Form.Item
                    label={<IntlMessage id={'service.data.modalAddCourse.orgName'} />}
                    name="article_number"
                    rules={[
                        {
                            validator: validateLocalizationArticleNumber,
                        },
                    ]}
                    required
                >
                    <Input
                        value={
                            currentLanguage === 'rus' ? article_number.name : article_number.nameKZ
                        }
                        onChange={handleInputArticleNumber}
                    />
                    <p className="fam_invisible_text">
                        {currentLanguage === 'rus' ? article_number.name : article_number.nameKZ}
                    </p>
                </Form.Item>
                <Form.Item
                    label={<IntlMessage id={'personal.additional.offenceList.consequences'} />}
                    name="consequence"
                    rules={[
                        {
                            validator: validateLocalizationConsequence,
                        },
                    ]}
                    required
                >
                    <Input
                        value={currentLanguage === 'rus' ? consequence.name : consequence.nameKZ}
                        onChange={handleInputConsequence}
                    />
                    <p className="fam_invisible_text">
                        {currentLanguage === 'rus' ? consequence.name : consequence.nameKZ}
                    </p>
                </Form.Item>

                <Form.Item
                    label={<IntlMessage id={'personal.additional.offenceList.date'} />}
                    name="date"
                    rules={[
                        {
                            required: true,
                            message: <IntlMessage id={'oath.date.placeholder'} />,
                        },
                    ]}
                    required
                >
                    <DatePicker
                        style={{
                            width: '100%',
                        }}
                        placeholder={IntlMessageText.getText({
                            id: 'oath.date.placeholder',
                        })}
                        format="DD-MM-YYYY"
                        name="date"
                        disabledDate={disabledDate}
                    />
                </Form.Item>
                <Form.Item
                    label={<IntlMessage id={'service.data.modalAcademicDegree.docAccept'} />}
                >
                    <Form.Item
                        name="dragger"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        noStyle
                        rules={[{ validator: validateFileList }]}
                    >
                        <Upload.Dragger fileList={file} {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p
                                className="ant-upload-text"
                                style={{
                                    marginBottom: '0px',
                                    fontSize: '14px',
                                }}
                            >
                                <IntlMessage id="dragger.text" />
                            </p>
                        </Upload.Dragger>
                    </Form.Item>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default OffenseEditModal;
