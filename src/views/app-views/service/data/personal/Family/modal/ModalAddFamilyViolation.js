import React, { useState } from 'react';
import { DatePicker, Form, Input, message, Modal, Upload } from 'antd';
import IntlMessage, {
    IntlMessageText,
} from '../../../../../../../components/util-components/IntlMessage';
import LanguageSwitcher from '../../../../../../../components/shared-components/LanguageSwitcher';
import { InboxOutlined } from '@ant-design/icons';
import uuidv4 from '../../../../../../../utils/helpers/uuid';
import {
    addAllTabsFamilyViolationsRemote,
    addAllTabsFamilyViolationsLocal,
} from '../../../../../../../store/slices/myInfo/myInfoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useAppSelector } from '../../../../../../../hooks/useStore';
import moment from 'moment/moment';
import FileUploaderService, { headers } from '../../../../../../../services/myInfo/FileUploaderService';
import { fileExtensions } from '../../../../../../../constants/FileExtensionConstants';
import { SelectPickerMenu } from '../../PersonalData/BiographicInfo/SelectPickerMenu';
import { useViolationName } from 'hooks/useViolationName/useViolationName';
import { S3_BASE_URL } from "configs/AppConfig";
import { PERMISSION } from 'constants/permission';

const ModalAddFamilyViolation = ({ isOpen, onClose, data }) => {
    const [fileList, setFileList] = useState([]);
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    const familyDataRemote = useSelector((state) => state.familyProfile.familyProfile);

    const [organizationName, setOrganizationName] = useState({ name: '', nameKZ: '' });
    const [effects, setEffects] = useState({ name: '', nameKZ: '' });
    const [issuedBy, setIssuedBy] = useState({ name: '', nameKZ: '' });
    const [currentLanguage, setCurrentLanguage] = useState('rus');

    const personalId = useAppSelector((state) => state.personalInfo.personalInfoData.id);

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
            setFileList([response.link]);
            // Return the response link so it can be used in the onOk function
            return response.link;
        } catch (error) {
            void message.error(<IntlMessage id={'service.data.modalAddPsycho.cannotLoadFile'} />);
        }
    };

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

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await handleFileUpload(values.dragger);

            const find = familyDataRemote.family.find((item) => item.id === data.id);

            const ids = find
                ? {
                      family_id: data.id,
                  }
                : {
                      local_id: data.id,
                  };

            const newObject = {
                ...ids,
                name: violationNameOption.rus.label,
                nameKZ: violationNameOption.kaz.label,
                issued_by: issuedBy.name,
                issued_byKZ: issuedBy.nameKZ,
                date: values.date.toDate(),
                article_number: organizationName.name,
                article_numberKZ: organizationName.nameKZ,
                document_link: response || '',
                consequence: effects.name,
                consequenceKZ: effects.nameKZ,
                id: uuidv4(),
                violation_type_id: violationNameOption.rus.value,
                profile_id: personalId,
                violation_type: {
                    id: violationNameOption.rus.value,
                    name: violationNameOption.rus.label,
                    nameKZ: violationNameOption.kaz.label
                }
            };

            if (find) {
                dispatch(addAllTabsFamilyViolationsRemote(newObject));
            } else {
                dispatch(addAllTabsFamilyViolationsLocal(newObject));
            }
            form.resetFields();
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const onCancel = () => {
        form.resetFields();
        onClose();
    };

    const validateLocalizationIssuedBy = () => {
        const isRusEmpty = issuedBy.name.trim() === '';
        const isKZEmpty = issuedBy.nameKZ.trim() === '';

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

    const validateLocalizationViolation = () => {
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

    const validateLocalizationOrganization = () => {
        const isRusEmpty = organizationName.name.trim() === '';
        const isKZEmpty = organizationName.nameKZ.trim() === '';

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

    const validateLocalizationEffect = () => {
        const isRusEmpty = effects.name.trim() === '';
        const isKZEmpty = effects.nameKZ.trim() === '';

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

    const handleInputIssuedBy = (event) => {
        setIssuedBy({
            ...issuedBy,
            [currentLanguage === 'rus' ? 'name' : 'nameKZ']: event.target.value,
        });
    };

    const handleInputOrganization = (event) => {
        setOrganizationName({
            ...organizationName,
            [currentLanguage === 'rus' ? 'name' : 'nameKZ']: event.target.value,
        });
    };

    const handleInputEffects = (event) => {
        setEffects({
            ...effects,
            [currentLanguage === 'rus' ? 'name' : 'nameKZ']: event.target.value,
        });
    };

    const handleDraggerChange = (info) => {
        const { status } = info.file;
        console.log(info)
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
    };

    const {
        violationNameOption,
        violationNameOptions,
        violationNameOptionsLoading,
        handleViolationNameChange,
        handleAddNewViolationName,
        getAllViolationTypes,
    } = useViolationName(currentLanguage);

    const handleViolationChange = (id) => {
        handleViolationNameChange(id);
    };

    const handleAddNewViolation = ({ kz, ru }) => {
        handleAddNewViolationName({ name: ru, nameKZ: kz });
        getAllViolationTypes();
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
                onCancel={onCancel}
                onOk={onOk}
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
                                validator: validateLocalizationViolation,
                            },
                        ]}
                        required
                    >
                        <SelectPickerMenu
                            defaultValue={null}
                            value={violationNameOption[currentLanguage]}
                            options={violationNameOptions[currentLanguage]}
                            optionsLoading={violationNameOptionsLoading}
                            onChange={handleViolationChange}
                            handleAddNewOption={handleAddNewViolation}
                        />
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
                            value={currentLanguage === 'rus' ? issuedBy.name : issuedBy.nameKZ}
                            onChange={handleInputIssuedBy}
                        />
                        <p className="fam_invisible_text">
                            {currentLanguage === 'rus' ? issuedBy.name : issuedBy.nameKZ}
                        </p>
                    </Form.Item>

                    <Form.Item
                        label={<IntlMessage id={'service.data.modalAddCourse.orgName'} />}
                        name="article_number"
                        rules={[
                            {
                                validator: validateLocalizationOrganization,
                            },
                        ]}
                        required
                    >
                        <Input
                            value={
                                currentLanguage === 'rus'
                                    ? organizationName.name
                                    : organizationName.nameKZ
                            }
                            onChange={handleInputOrganization}
                        />
                        <p className="fam_invisible_text">
                            {currentLanguage === 'rus'
                                ? organizationName.name
                                : organizationName.nameKZ}
                        </p>
                    </Form.Item>

                    <Form.Item
                        label={<IntlMessage id={'personal.additional.offenceList.consequences'} />}
                        name="consequence"
                        rules={[
                            {
                                validator: validateLocalizationEffect,
                            },
                        ]}
                        required
                    >
                        <Input
                            value={currentLanguage === 'rus' ? effects.name : effects.nameKZ}
                            onChange={handleInputEffects}
                        />
                        <p className="fam_invisible_text">
                            {currentLanguage === 'rus' ? effects.name : effects.nameKZ}
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
                            placeholder={[
                                IntlMessageText.getText({
                                    id: 'oath.date.placeholder',
                                }),
                            ]}
                            format="DD-MM-YYYY"
                            name="date"
                            disabledDate={disabledDate}
                        />
                    </Form.Item>
                    <Form.Item
                        name="dragger"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        noStyle
                        label={<IntlMessage id={'service.data.modalAcademicDegree.docAccept'} />}
                    >
                        <Upload.Dragger
                            action={`${S3_BASE_URL}/upload`}
                            headers={headers}
                            fileList={fileList}
                            name={'file'}
                            accept={fileExtensions}
                            progress
                            onChange={handleDraggerChange}
                            rules={[{ validator: validateFileList }]}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                <IntlMessage id="dragger.text" />
                            </p>
                        </Upload.Dragger>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ModalAddFamilyViolation;
