import { InboxOutlined } from '@ant-design/icons';
import { ConfigProvider, DatePicker, Form, Input, message, Modal } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import ru_RU from 'antd/lib/locale-provider/ru_RU';
import { PrivateServices } from 'API';
import IntlMessage, { IntlMessageText } from 'components/util-components/IntlMessage';
import { fileExtensions } from 'constants/FileExtensionConstants';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import uuidv4 from 'utils/helpers/uuid';
import LanguageSwitcher from '../../../../../../../components/shared-components/LanguageSwitcher';
import FileUploaderService from '../../../../../../../services/myInfo/FileUploaderService';
import { setFieldValue } from '../../../../../../../store/slices/myInfo/myInfoSlice';
import { SelectPickerMenu } from '../../PersonalData/BiographicInfo/SelectPickerMenu';
import { useSickName } from 'hooks/useSickName/useSickName';
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const ModalSickList = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { id } = useParams();

    const sick_list = useSelector((state) => state.myInfo.allTabs.medical_card.sick_list);
    const [currentLanguage, setCurrentLanguage] = useState('rus');
    const [editedNameSickList, setEditedNameSickList] = useState('');
    const [editedDate, setEditedDate] = useState('');
    const [placeName, setPlaceName] = useState({ name: '', nameKZ: '' });
    const [fileList, setFileList] = useState();

    const {
        sickNameOption,
        sickNameOptions,
        sickNameOptionsLoading,
        setSickNameOption,
        handleAddNewSickName,
        resetSickNameOption,
    } = useSickName(currentLanguage);

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
            void message.error(<IntlMessage id={'medical.file.upload.error'} />);
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

    const handleDraggerChange = (info) => {
        const { status } = info.file;
        if (status === 'done') {
            void message.success(
                `${info.file.name} ${(<IntlMessage id={'medical.file.upload.success'} />)}`,
            );
        } else if (status === 'error') {
            void message.error(
                `${info.file.name} ${(<IntlMessage id={'medical.file.upload.error'} />)}`,
            );
        }
    };

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await handleFileUpload(values.dragger);

            const newObject = {
                code: values.code,
                illness_type_id: sickNameOption.rus.value,
                place: placeName.name,
                placeKZ: placeName.nameKZ,
                start_date: values.sick_leave_period[0].toDate(),
                end_date: values.sick_leave_period[1].toDate(),
                document_link: response,
                id: uuidv4(),
                profile_id: id,
            };
            dispatch(
                setFieldValue({
                    fieldPath: 'allTabs.medical_card.sick_list',
                    value: [...sick_list, newObject],
                }),
            );
            form.resetFields();
            setEditedDate('');
            resetSickNameOption();
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const onCancel = () => {
        form.resetFields();
        setEditedDate('');
        onClose();
    };

    const validateLocalizationSick = () => {
        const isRusEmpty = sickNameOption.rus.label.trim() === '';
        const isKZEmpty = sickNameOption.kaz.label.trim() === '';

        return new Promise((resolve, reject) => {
            if (isRusEmpty && isKZEmpty) {
                reject(t('field.required'));
                return;
            }
            if (isKZEmpty) {
                reject(t('field.required.kazakh'));
                return;
            }
            if (isRusEmpty) {
                reject(t('field.required.russian'));
                return;
            }
            resolve();
        });
    };

    const validateLocalizationPlace = () => {
        const isRusEmpty = placeName.name.trim() === '';
        const isKZEmpty = placeName.nameKZ.trim() === '';

        return new Promise((resolve, reject) => {
            if (isRusEmpty && isKZEmpty) {
                reject(t('education.course.names.empty'));
                return;
            }
            if (isKZEmpty) {
                reject(t('education.course.nameKZ.empty'));
                return;
            }
            if (isRusEmpty) {
                reject(t('education.course.name.empty'));
                return;
            }
            resolve();
        });
    };

    const handleSickNameChange = (id) => {
        const sicknessRus = sickNameOptions.rus.find((s) => s.value === id);
        const sicknessKaz = sickNameOptions.kaz.find((s) => s.value === id);
        if (!sicknessRus || !sicknessKaz) {
            return;
        }
        setSickNameOption({
            rus: {
                value: sicknessRus.value,
                label: sicknessRus.label,
            },
            kaz: {
                value: sicknessKaz.value,
                label: sicknessKaz.label,
            },
        });
    };

    const handleInputPlace = (event) => {
        setPlaceName({
            ...placeName,
            [currentLanguage === 'rus' ? 'name' : 'nameKZ']: event.target.value,
        });
    };

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
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
                        <span>{t('medical.add.list')}</span>
                        <LanguageSwitcher
                            size="small"
                            fontSize="12px"
                            height="1.4rem"
                            current={currentLanguage}
                            setLanguage={setCurrentLanguage}
                        />
                    </div>
                }
                open={isOpen}
                onCancel={onCancel}
                onOk={onOk}
                okText={t('initiate.save')}
                cancelText={t('candidates.warning.cancel')}
                style={{ height: '500px', width: '400px' }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label={'Код'}
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: IntlMessageText.getText({
                                    id: 'medical.enter.code',
                                }),
                            },
                        ]}
                        required
                    >
                        <Input
                            value={editedNameSickList}
                            onChange={(event) => setEditedNameSickList(event.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        label={t('medical.name.desiese')}
                        name="name_diseases"
                        rules={[
                            {
                                validator: validateLocalizationSick,
                            },
                        ]}
                        required
                    >
                        <SelectPickerMenu
                            value={sickNameOption[currentLanguage]}
                            defaultValue={null}
                            options={sickNameOptions[currentLanguage]}
                            optionsLoading={sickNameOptionsLoading}
                            onChange={handleSickNameChange}
                            handleAddNewOption={handleAddNewSickName}
                        />
                    </Form.Item>
                    <Form.Item
                        label={t('medical.name.UCH')}
                        name="name_institutions"
                        rules={[
                            {
                                validator: validateLocalizationPlace,
                            },
                        ]}
                        required
                    >
                        <Input
                            value={currentLanguage === 'rus' ? placeName.name : placeName.nameKZ}
                            onChange={handleInputPlace}
                        />
                        <p className="fam_invisible_text">
                            {currentLanguage === 'rus' ? placeName.name : placeName.nameKZ}
                        </p>
                    </Form.Item>
                    <Form.Item
                        label={t('medical.period')}
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
                        <ConfigProvider locale={ru_RU}>
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
                                value={editedDate}
                                onChange={(sick_leave_period) => {
                                    form.setFieldsValue({ sick_leave_period });
                                    setEditedDate(sick_leave_period);
                                }}
                                name="sick_leave_period"
                            />
                        </ConfigProvider>
                    </Form.Item>
                    <Form.Item>
                        <Form.Item
                            name="dragger"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            noStyle
                            rules={[{ validator: validateFileList }]}
                        >
                            <Dragger
                                action={`${S3_BASE_URL}/upload`}
                                headers={headers}
                                fileList={fileList}
                                name={'file'}
                                multiple={true}
                                accept={fileExtensions}
                                rules={[{ validator: validateFileList }]}
                                onChange={handleDraggerChange}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">{t('dragger.text')}</p>
                            </Dragger>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ModalSickList;
