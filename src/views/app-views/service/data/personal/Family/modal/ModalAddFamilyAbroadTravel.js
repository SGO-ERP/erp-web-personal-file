import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker, Form, Input, message, Modal, Select, Upload } from 'antd';
import { useAppSelector } from '../../../../../../../hooks/useStore';
import { PrivateServices } from '../../../../../../../API';
import FileUploaderService, {
    headers,
} from '../../../../../../../services/myInfo/FileUploaderService';
import IntlMessage, {
    IntlMessageText,
} from '../../../../../../../components/util-components/IntlMessage';
import { fileExtensions } from '../../../../../../../constants/FileExtensionConstants';
import uuidv4 from '../../../../../../../utils/helpers/uuid';
import { setFieldValue } from '../../../../../../../store/slices/myInfo/myInfoSlice';
import LanguageSwitcher from '../../../../../../../components/shared-components/LanguageSwitcher';
import { InboxOutlined } from '@ant-design/icons';
import { SelectPickerMenu } from '../../PersonalData/BiographicInfo/SelectPickerMenu';
import { useVehicleType } from 'hooks/useVehicleType/useVehicleType';
import { useCountryOptions } from 'hooks/useCountryOptions/useCountryOptions';
import { S3_BASE_URL } from 'configs/AppConfig';
import { PERMISSION } from 'constants/permission';

const ModalAddFamilyAbroadTravel = ({ isOpen, onClose, data }) => {
    const [fileList, setFileList] = useState();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const abroad_travels = useSelector(
        (state) => state.myInfo.allTabs.family.family_abroad_travels.remote,
    );
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    // const [countries, setCountries] = useState([]);
    const familyDataRemote = useSelector((state) => state.familyProfile.familyProfile);
    const [vehicleTypeName, setVehicleTypeName] = useState({ name: '', nameKZ: '' });
    const [reason, setReason] = useState({ name: '', nameKZ: '' });
    const [currentLanguage, setCurrentLanguage] = useState('rus');

    const {
        vehicleTypeOption,
        vehicleTypeOptions,
        vehicleTypeOptionsLoading,
        onChange,
        fetchAll,
        setVehicleTypeOption,
        handleAddNewVehicleType,
    } = useVehicleType(currentLanguage);

    const [countryOption, setCountryOption] = useState({ label: '', value: '' });

    const { countryOptions, countryOptionsLoading, getCountryOptions, createNew } =
        useCountryOptions(currentLanguage === 'rus' ? 'ru' : 'kz');

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
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

    const handleDraggerChange = (info) => {
        const { status } = info.file;
        if (status === 'done') {
            message.success(
                `${info.file.name} ${(
                    <IntlMessage id={'service.data.modalAddPsycho.successLoadFile'} />
                )}`,
            );
        } else if (status === 'error') {
            message.error(
                `${info.file.name} ${(
                    <IntlMessage id={'service.data.modalAddPsycho.cannotLoadFile2'} />
                )}`,
            );
        }
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
                vehicle_type: vehicleTypeOption.rus.label,
                vehicle_typeKZ: vehicleTypeOption.kaz.label,
                destination_country_id: countryOption.value,
                destination_country: {
                    name: countryOption.label,
                },
                date_from: values.date[0].toDate(),
                date_to: values.date[1].toDate(),
                reason: reason.name,
                reasonKZ: reason.nameKZ,
                document_link: response,
                id: uuidv4(),
            };
            if (find) {
                dispatch(
                    setFieldValue({
                        fieldPath: 'allTabs.family.family_abroad_travels.remote',
                        value: [...abroad_travels, newObject],
                    }),
                );
            } else {
                dispatch(
                    setFieldValue({
                        fieldPath: 'allTabs.family.family_abroad_travels.local',
                        value: [...abroad_travels, newObject],
                    }),
                );
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

    const validateLocalizationReason = () => {
        const isRusEmpty = reason.name.trim() === '';
        const isKZEmpty = reason.nameKZ.trim() === '';

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

    const validateLocalizationVehicleType = () => {
        const isRusEmpty = vehicleTypeOption.rus.label.trim() === '';
        const isKZEmpty = vehicleTypeOption.kaz.label.trim() === '';

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

    const handleInputReason = (event) => {
        setReason({
            ...reason,
            [currentLanguage === 'rus' ? 'name' : 'nameKZ']: event.target.value,
        });
    };

    const handleVehicleTypeChange = (id) => {
        onChange(id);
    };

    const handleCountryOptionChange = (_, option) => {
        setCountryOption(option);
    };

    const handleAddNewCountry = ({ kz, ru }) => {
        createNew({ name: ru, nameKZ: kz }).then(() => {
            getCountryOptions();
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
                            <IntlMessage id={'service.data.modalAbroadTravel.title'} />
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
                        label={<IntlMessage id={'service.data.modalAbroadTravel.vehicleType'} />}
                        name="vehicle_type"
                        rules={[
                            {
                                validator: validateLocalizationVehicleType,
                            },
                        ]}
                        required
                    >
                        <SelectPickerMenu
                            defaultValue={null}
                            value={vehicleTypeOption[currentLanguage]}
                            options={vehicleTypeOptions[currentLanguage]}
                            optionsLoading={vehicleTypeOptionsLoading}
                            onChange={handleVehicleTypeChange}
                            handleAddNewOption={handleAddNewVehicleType}
                        />
                    </Form.Item>
                    <Form.Item
                        label={
                            <IntlMessage id={'service.data.modalAbroadTravel.destinationCountry'} />
                        }
                        name="destination_country_id"
                        rules={[
                            {
                                required: true,
                                message: (
                                    <IntlMessage
                                        id={
                                            'service.data.modalAbroadTravel.destinationCountryError'
                                        }
                                    />
                                ),
                            },
                        ]}
                        required
                    >
                        <SelectPickerMenu
                            defaultValue={null}
                            value={countryOption}
                            options={countryOptions}
                            optionsLoading={countryOptionsLoading}
                            onChange={handleCountryOptionChange}
                            handleAddNewOption={handleAddNewCountry}
                        />
                        {/* <Select
                            options={countries}
                            showSearch
                            filterOption={(inputValue, option) =>
                                option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                            }
                        /> */}
                    </Form.Item>

                    <Form.Item
                        label={<IntlMessage id={'service.data.modalAbroadTravel.reason'} />}
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
                        <DatePicker.RangePicker
                            style={{
                                width: '100%',
                            }}
                            placeholder={[
                                IntlMessageText.getText({
                                    id: 'service.data.modalAbroadTravel.dateStart',
                                }),
                                IntlMessageText.getText({
                                    id: 'service.data.modalAbroadTravel.dateEnd',
                                }),
                            ]}
                            format="DD-MM-YYYY"
                            name="date"
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
                        >
                            <Upload.Dragger
                                action={`${S3_BASE_URL}/upload`}
                                headers={headers}
                                fileList={fileList}
                                name={'file'}
                                multiple
                                accept={fileExtensions}
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
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ModalAddFamilyAbroadTravel;
