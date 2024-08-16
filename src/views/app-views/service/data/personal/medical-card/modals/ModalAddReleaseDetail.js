import { InboxOutlined } from "@ant-design/icons";
import { DatePicker, Form, Input, message, Modal, Select, Tag, Divider, Row, Space, Button } from "antd";
import Dragger from "antd/es/upload/Dragger";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { fileExtensions } from "constants/FileExtensionConstants";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import uuidv4 from "utils/helpers/uuid";
import LanguageSwitcher from "../../../../../../../components/shared-components/LanguageSwitcher";
import FileUploaderService from "../../../../../../../services/myInfo/FileUploaderService";
import { setFieldValue } from "../../../../../../../store/slices/myInfo/myInfoSlice";
import { useTranslation } from "react-i18next";
import MedicalService from 'services/myInfo/MedicalService';
import { PlusOutlined } from '@ant-design/icons';
import { setLiberaltions } from "store/slices/myInfo/medicalInfoSlice";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const defaultValues = {
    kz: '',
    ru: '',
};
const languages = Object.keys(defaultValues);
const ModalAddReleaseDetail = ({ isOpen, onClose }) => {
    const [editedReason, setEditedReason] = useState("");
    const [editedNameInstitution, setEditedNameInstitution] = useState("");
    const [editedReleaseFrom, setEditedReleaseFrom] = useState("");
    const [editedDate, setEditedDate] = useState("");
    const [fileList, setFileList] = useState();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const release_detail = useSelector((state) => state.myInfo.allTabs.medical_card.release_detail);
    const liberations = useSelector((state) => state.medicalInfo.liberations);

    const [reason, setReason] = useState({ name: "", nameKZ: "" });
    const [institutionsName, setInstitutionsName] = useState({ name: "", nameKZ: "" });
    const [currentLanguage, setCurrentLanguage] = useState("rus");

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

    const liberationOptions =
        liberations &&
        liberations?.objects?.map((item) => ({
            value: item.id,
            label: item.name,
        }));

    const handleFileUpload = async (fileList) => {
        if (!fileList) {
            return undefined;
        }
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append("file", file.originFileObj);
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
        name: "file",
        multiple: true,
        accept: fileExtensions, // разрешенные расширения
        onChange(info) {
            const { status } = info.file;
            if (status === "done") {
                void message.success(
                    `${info.file.name} ${(<IntlMessage id="edical.file.upload.success" />)}`,
                );
            } else if (status === "error") {
                void message.error(
                    `${info.file.name} ${(<IntlMessage id="edical.file.upload.error" />)}`,
                );
            }
        },
        beforeUpload: () => {
            return false;
        },
        rules: [{ validator: validateFileList }],
    };

    const validateLocalizationReason = () => {
        const isRusEmpty = reason.name.trim() === "";
        const isKZEmpty = reason.nameKZ.trim() === "";

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
        const isRusEmpty = institutionsName.name.trim() === "";
        const isKZEmpty = institutionsName.nameKZ.trim() === "";

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
            [currentLanguage === "rus" ? "name" : "nameKZ"]: event.target.value,
        });
    };

    const handleInputInstitution = (event) => {
        setInstitutionsName({
            ...institutionsName,
            [currentLanguage === "rus" ? "name" : "nameKZ"]: event.target.value,
        });
    };

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const link = await handleFileUpload(values.dragger);

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
                liberation_ids: released,
                id: uuidv4(),
            };

            dispatch(
                setFieldValue({
                    fieldPath: "allTabs.medical_card.release_detail",
                    value: [...release_detail, newObject],
                }),
            );
            form.resetFields();
            setEditedDate("");
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const tagRender = (props) => {
        const { label, value, closable, onClose } = props;
        const onPreventMouseDown = (event) => {
            event.preventDefault();
            event.stopPropagation();
        };
        return (
            <Tag
                color={"#F0F5FF"}
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={onClose}
                style={{
                    marginRight: 3,
                    fontSize: "10px",
                    borderColor: "#ADC6FF",
                    color: "#2F54EB",
                    borderRadius: "15px",
                }}
            >
                {label}
            </Tag>
        );
    };

    const onCancel = () => {
        form.resetFields();
        setEditedDate("");
        onClose();
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                // title={'Добавить сведения об освобождении'}
                title={
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginRight: "20px",
                            alignItems: "center",
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
                open={isOpen}
                onCancel={onCancel}
                onOk={onOk}
                okText={<IntlMessage id="initiate.save" />}
                cancelText={<IntlMessage id="candidates.warning.cancel" />}
                style={{ height: "500px", width: "400px" }}
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
                            value={currentLanguage === "rus" ? reason.name : reason.nameKZ}
                            onChange={handleInputReason}
                        />
                        <p className="fam_invisible_text">
                            {currentLanguage === "rus" ? reason.name : reason.nameKZ}
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
                                currentLanguage === "rus"
                                    ? institutionsName.name
                                    : institutionsName.nameKZ
                            }
                            onChange={handleInputInstitution}
                        />
                        <p className="fam_invisible_text">
                            {currentLanguage === "rus"
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
                                    id: "medical.upload.doc.free.for.enter",
                                }),
                            },
                        ]}
                        name="released"
                        required
                    >
                        <Select
                            mode={"multiple"}
                            showArrow
                            tagRender={tagRender}
                            style={{
                                width: "100%",
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
                                    id: "medical.upload.doc.free.period.enter",
                                }),
                            },
                        ]}
                        required
                    >
                        <DatePicker.RangePicker
                            style={{
                                width: "100%",
                            }}
                            placeholder={[
                                IntlMessageText.getText({
                                    id: "medical.upload.doc.free.period.from",
                                }),
                                IntlMessageText.getText({
                                    id: "medical.upload.doc.free.period.to",
                                }),
                            ]}
                            format="DD-MM-YYYY"
                            value={editedDate}
                            onChange={(released_period) => {
                                form.setFieldsValue({ released_period }); // Update the form field value
                                setEditedDate(released_period);
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
        </div>
    );
};

export default ModalAddReleaseDetail;
