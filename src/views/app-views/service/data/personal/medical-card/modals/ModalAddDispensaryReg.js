import { InboxOutlined } from '@ant-design/icons';
import {Checkbox, ConfigProvider, DatePicker, Form, Input, message, Modal, Upload} from 'antd';
import ru_RU from 'antd/lib/locale-provider/ru_RU';
import IntlMessage, { IntlMessageText } from 'components/util-components/IntlMessage';
import { fileExtensions } from 'constants/FileExtensionConstants';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uuidv4 from 'utils/helpers/uuid';
import LanguageSwitcher from '../../../../../../../components/shared-components/LanguageSwitcher';
import FileUploaderService from '../../../../../../../services/myInfo/FileUploaderService';
import { setFieldValue } from '../../../../../../../store/slices/myInfo/myInfoSlice';
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const ModalAddDispensaryReg = ({ isOpen, onClose }) => {
    const [editedDate, setEditedDate] = useState('');
    const [fileList, setFileList] = useState();

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const dispensary_reg = useSelector((state) => state.myInfo.allTabs.medical_card.dispensary_reg);

    const [accountingName, setAccountingName] = useState({ name: '', nameKZ: '' });
    const [registered, setRegistered] = useState({ name: '', nameKZ: '' });
    const [currentLanguage, setCurrentLanguage] = useState('rus');
    const [disabledDatePicker, setDisabled] = useState(false);

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
            void message.error(<IntlMessage id="medical.file.upload.error" />);
        }
    };

    const disabledDate = (current) => {
        // Disable dates before today
        return current && current > moment().startOf('day');
    };

    const disabled = () => {
        if(disabledDatePicker===true){
            return [false,true]
        }
        return [false,false]
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
            const link = await handleFileUpload(values.dragger);

            const newObject = {
                name: accountingName.name,
                nameKZ: accountingName.nameKZ,
                initiator: registered.name,
                initiatorKZ: registered.nameKZ,
                start_date: values.accounting_period[0].toDate(),
                end_date: disabledDatePicker=== true ? null : values.accounting_period[1].toDate(),
                document_link: link,
                id: uuidv4(),
            };

            dispatch(
                setFieldValue({
                    fieldPath: 'allTabs.medical_card.dispensary_reg',
                    value: [...dispensary_reg, newObject],
                }),
            );
            onCancel();
        } catch (error) {
            console.log(error);
        }
    };

    const onCancel = () => {
        form.resetFields();
        setEditedDate('');
        setAccountingName({ name: '', nameKZ: '' });
        setRegistered({ name: '', nameKZ: '' });
        onClose();
    };

    const validateLocalizationAccounting = () => {
        const isRusEmpty = accountingName.name.trim() === '';
        const isKZEmpty = accountingName.nameKZ.trim() === '';

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

    const validateLocalizationRegistered = () => {
        const isRusEmpty = registered.name.trim() === '';
        const isKZEmpty = registered.nameKZ.trim() === '';

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


    const handleChange = (e) => {
        if(e.target.checked===true) {
            setDisabled(true)
        } else if (e.target.checked===false) {
            setDisabled(false)
        }
    }

    return (
        <div onClick={(e) => e.stopPropagation()}>
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
                open={isOpen}
                onCancel={onCancel}
                onOk={onOk}
                okText={<IntlMessage id="initiate.save" />}
                cancelText={<IntlMessage id="candidates.warning.cancel" />}
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
                                currentLanguage === 'rus'
                                    ? accountingName.name
                                    : accountingName.nameKZ
                            }
                            onChange={handleInputAccounting}
                        />
                        <p className="fam_invisible_text">
                            {currentLanguage === 'rus'
                                ? accountingName.name
                                : accountingName.nameKZ}
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
                        <ConfigProvider locale={ru_RU}>
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
                                value={editedDate}
                                onChange={(accounting_period) => {
                                    form.setFieldsValue({ accounting_period }); // Update the form field value
                                    setEditedDate(accounting_period);
                                }}
                                name="accounting_period"
                                disabledDate={disabledDate}
                                disabled={disabled()}
                            />
                        </ConfigProvider>
                    </Form.Item>
                    <Form.Item name={"checkbox"}>
                        <Checkbox onChange={(e) => {
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
        </div>
    );
};

export default ModalAddDispensaryReg;
