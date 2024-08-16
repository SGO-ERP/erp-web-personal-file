import { InboxOutlined } from '@ant-design/icons';
import { DatePicker, Form, Input, message, Modal, Upload } from 'antd';
import { PrivateServices } from 'API';
import { fileExtensions } from 'constants/FileExtensionConstants';
import { defaultViolationNameOption } from 'hooks/useViolationName/data';
import { useViolationName } from 'hooks/useViolationName/useViolationName';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import LanguageSwitcher from '../../../../../../../components/shared-components/LanguageSwitcher';
import { useAppSelector } from '../../../../../../../hooks/useStore';
import FileUploaderService, { headers } from '../../../../../../../services/myInfo/FileUploaderService';
import { setFieldValue } from '../../../../../../../store/slices/myInfo/myInfoSlice';
import uuidv4 from '../../../../../../../utils/helpers/uuid';
import { SelectPickerMenu } from '../../PersonalData/BiographicInfo/SelectPickerMenu';
import { S3_BASE_URL } from "configs/AppConfig";
import { PERMISSION } from 'constants/permission';

const ModelAddCourse = ({ isOpen, onClose }) => {
    const { t } = useTranslation();

    const [fileList, setFileList] = useState();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const violations = useSelector((state) => state.myInfo.allTabs.additional.violations);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    const [currentLanguage, setCurrentLanguage] = useState('rus');

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

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    const disabledDate = (current) => {
        // Disable dates before today
        return current && current > moment().startOf('day');
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
            setFileList(response.link);
            // Return the response link so it can be used in the onOk function
            return response.link;
        } catch (error) {
            message.error(t('service.data.modalAddPsycho.cannotLoadFile'));
        }
    };

    const validateFileList = (rule, value) => {
        return new Promise((resolve, reject) => {
            if (!value) {
                resolve();
            } else if (value.length > 1) {
                reject(t('service.data.modalEditPolygraphCheck.pleaseLoadOneFile'));
            } else {
                resolve();
            }
        });
    };

    const handleDraggerChange = (info) => {
        const { status } = info.file;
        if (status === 'done') {
            message.success(
                `${info.file.name} ${t('service.data.modalAddPsycho.successLoadFile')}`,
            );
        } else if (status === 'error') {
            message.error(`${info.file.name} ${t('service.data.modalAddPsycho.cannotLoadFile2')}`);
        }
    };

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await handleFileUpload(values.dragger);

            const newObject = {
                violation_type_id: violationNameOption.rus.value,
                name: violationNameOption.rus.label,
                nameKZ: violationNameOption.kaz.label,
                issued_by: issued_by.name,
                issued_byKZ: issued_by.nameKZ,
                date: values.date.toDate(),
                article_number: article_number.name,
                article_numberKZ: article_number.nameKZ,
                document_link: response ?? null,
                consequence: consequence.name,
                consequenceKZ: consequence.nameKZ,
                id: uuidv4(),
            };
            dispatch(
                setFieldValue({
                    fieldPath: 'allTabs.additional.violations',
                    value: [...violations, newObject],
                }),
            );
            form.resetFields();
            setViolationNameOption(defaultViolationNameOption);
            setArticle_number({ name: '', nameKZ: '' });
            setIssued_by({ name: '', nameKZ: '' });
            setArticle_number({ name: '', nameKZ: '' });
            setConsequence({ name: '', nameKZ: '' });
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const onCancel = () => {
        form.resetFields();
        setViolationNameOption(defaultViolationNameOption);
        setArticle_number({ name: '', nameKZ: '' });
        setIssued_by({ name: '', nameKZ: '' });
        setArticle_number({ name: '', nameKZ: '' });
        setConsequence({ name: '', nameKZ: '' });
        onClose();
    };

    const validateLocalizationName = () => {
        const isRusEmpty = violationNameOption.rus.label.trim() === '';
        const isKZEmpty = violationNameOption.kaz.label.trim() === '';

        return new Promise((resolve, reject) => {
            if (isRusEmpty && isKZEmpty) {
                reject(t('education.course.names.empty'));
            } else if (isKZEmpty) {
                reject(t('education.course.nameKZ.empty'));
            } else if (isRusEmpty) {
                reject(t('education.course.name.empty'));
            } else {
                resolve();
            }
        });
    };

    const validateLocalizationIssuedBy = () => {
        const isRusEmpty = issued_by.name.trim() === '';
        const isKZEmpty = issued_by.nameKZ.trim() === '';

        return new Promise((resolve, reject) => {
            if (isRusEmpty && isKZEmpty) {
                reject(t('education.course.names.empty'));
            } else if (isKZEmpty) {
                reject(t('education.course.nameKZ.empty'));
            } else if (isRusEmpty) {
                reject(t('education.course.name.empty'));
            } else {
                resolve();
            }
        });
    };

    const validateLocalizationArticleNumber = () => {
        const isRusEmpty = article_number.name.trim() === '';
        const isKZEmpty = article_number.nameKZ.trim() === '';

        return new Promise((resolve, reject) => {
            if (isRusEmpty && isKZEmpty) {
                reject(t('education.course.names.empty'));
            } else if (isKZEmpty) {
                reject(t('education.course.nameKZ.empty'));
            } else if (isRusEmpty) {
                reject(t('education.course.name.empty'));
            } else {
                resolve();
            }
        });
    };

    const validateLocalizationConsequence = () => {
        const isRusEmpty = consequence.name.trim() === '';
        const isKZEmpty = consequence.nameKZ.trim() === '';

        return new Promise((resolve, reject) => {
            if (isRusEmpty && isKZEmpty) {
                reject(t('education.course.names.empty'));
            } else if (isKZEmpty) {
                reject(t('education.course.nameKZ.empty'));
            } else if (isRusEmpty) {
                reject(t('education.course.name.empty'));
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
                        <span>{t('service.data.modalAddViolation.title')}</span>
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
                onCancel={onCancel}
                onOk={onOk}
                okText={t('service.data.modalAddPsycho.save')}
                cancelText={t('service.data.modalAddPsycho.cancel')}
                style={{ height: '500px', width: '400px' }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label={t('schedule.qualreq.name')}
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
                            options={violationNameOptions[currentLanguage]}
                            defaultValue={null}
                            onChange={handleViolationNameChange}
                            optionsLoading={violationNameOptionsLoading}
                            handleAddNewOption={handleAddNewViolationName}
                        />
                    </Form.Item>
                    <Form.Item
                        label={t('personal.additional.offenceList.committedBy')}
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
                        label={t('service.data.modalAddCourse.orgName')}
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
                                currentLanguage === 'rus'
                                    ? article_number.name
                                    : article_number.nameKZ
                            }
                            onChange={handleInputArticleNumber}
                        />
                        <p className="fam_invisible_text">
                            {currentLanguage === 'rus'
                                ? article_number.name
                                : article_number.nameKZ}
                        </p>
                    </Form.Item>
                    <Form.Item
                        label={t('personal.additional.offenceList.consequences')}
                        name="consequence"
                        rules={[
                            {
                                validator: validateLocalizationConsequence,
                            },
                        ]}
                        required
                    >
                        <Input
                            value={
                                currentLanguage === 'rus' ? consequence.name : consequence.nameKZ
                            }
                            onChange={handleInputConsequence}
                        />
                        <p className="fam_invisible_text">
                            {currentLanguage === 'rus' ? consequence.name : consequence.nameKZ}
                        </p>
                    </Form.Item>

                    <Form.Item
                        label={t('personal.additional.offenceList.date')}
                        name="date"
                        rules={[
                            {
                                required: true,
                                message: t('oath.date.placeholder'),
                            },
                        ]}
                        required
                    >
                        <DatePicker
                            style={{
                                width: '100%',
                            }}
                            placeholder={[t('oath.date.placeholder')]}
                            format="DD-MM-YYYY"
                            name="date"
                            disabledDate={disabledDate}
                        />
                    </Form.Item>
                    <Form.Item label={t('service.data.modalAcademicDegree.docAccept')}>
                        <Form.Item
                            name="dragger"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            noStyle
                            rules={[{ validator: validateFileList }]}
                        >
                            <Upload.Dragger
                                action={`${S3_BASE_URL}/upload`}
                                headers={headers}
                                fileList={fileList}
                                name={'file'}
                                multiple
                                accept={fileExtensions}
                                rules={[{ validator: validateFileList }]}
                                onChange={handleDraggerChange}
                            >
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
                                    {t('dragger.text')}
                                </p>
                            </Upload.Dragger>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ModelAddCourse;
