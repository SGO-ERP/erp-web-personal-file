import { InboxOutlined } from "@ant-design/icons";
import { Col, Form, message, Modal, Rate, Row } from "antd";
import IntlMessage from "components/util-components/IntlMessage";
import { fileExtensions } from "constants/FileExtensionConstants";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileUploaderService from "services/myInfo/FileUploaderService";
import { setFieldValue } from "store/slices/myInfo/myInfoSlice";
import uuidv4 from "utils/helpers/uuid";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import { useAppSelector } from "hooks/useStore";
import SelectPickerMenu from "./SelectPickerMenu";
import Dragger from "antd/es/upload/Dragger";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";
import i18n from "lang";
import "./educationModal.css";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";
import { PERMISSION } from "constants/permission";

const textList = {
    ru: ["Слабо", "Неудовлетворительно", "Удовлетворительно", "Хорошо", "Отлично"],
    kk: ["Нашар", "қанағаттанарлықсыз", "Қанағаттандырулы", "Жақсы", "Өте жақсы"],
};

const ModalLanguages = ({ isOpen, onClose, list }) => {
    const [reformattedLanguage, setReformattedLanguage] = useState([]);
    const [optionValue, setOptionValue] = useState({});
    const [editedRate, setEditedRate] = useState("");

    const [form] = Form.useForm();

    const dispatch = useDispatch();

    const { add_language } = useSelector((state) => state.myInfo.allTabs.education);

    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    const language = i18n.language;
    const [file, setFile] = useState();

    const { languages } = useSelector((state) => state.education);

    useEffect(() => {
        if(!isOpen) return;
        const options =  languages.data.objects.map((item) => ({
            value: item.id,
            label: LocalText.getName(item),
            object: item,
        }));
        setReformattedLanguage(options)
    }, [isOpen])

    const validateValues = (rule) => {
        return new Promise((resolve, reject) => {
            if (!optionValue[rule.field]) {
                reject(<IntlMessage id="education.select.empty" />);
            } else {
                resolve();
            }
        });
    };

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

            setFile(response.link);
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

    const props = {
        action: `${S3_BASE_URL}/upload`,
        headers,
        name: "file",
        multiple: true,
        accept: fileExtensions,
        onChange(info) {
            const { status } = info.file;
            if (status === "done") {
                void message.success(
                    `${info.file.name} ${(
                        <IntlMessage id={"service.data.modalAddPsycho.successLoadFile"} />
                    )}`,
                );
            } else if (status === "error") {
                void message.error(
                    `${info.file.name} ${(
                        <IntlMessage id={"service.data.modalAddPsycho.cannotLoadFile2"} />
                    )}`,
                );
            }
        },
        beforeUpload: () => {
            return false;
        },
    };

    const validateFileList = (rule, value) => {
        return new Promise((resolve, reject) => {
            resolve();
        });
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await handleFileUpload(values.dragger);

            const newObject = {
                language_id: optionValue.name_language,
                level: values.rate_language,
                document_link: response,
                id: uuidv4(),
                source: "added",
            };

            dispatch(
                setFieldValue({
                    fieldPath: "allTabs.education.add_language",
                    value: [...add_language, newObject],
                }),
            );
            onCancel();
        } catch (error) {
            console.log(error);
        }
    };

    const onCancel = () => {
        form.resetFields();
        setEditedRate("");
        setOptionValue({});
        onClose();
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            {/* Добавления сведений о знаниях ин. языков */}
            <Modal
                title={<IntlMessage id={"service.data.modalLanguage.add.languages"} />}
                open={isOpen && isHR}
                onCancel={onCancel}
                onOk={handleOk}
                okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
                cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
                width={"700px"}
                style={{ height: "500px" }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label={<IntlMessage id={"service.data.modalLanguage.lanName"} />}
                        name="name_language"
                        rules={[
                            {
                                validator: validateValues,
                            },
                        ]}
                        required
                    >
                        <SelectPickerMenu
                            options={reformattedLanguage}
                            type="name_language"
                            values={optionValue}
                            setValue={setOptionValue}
                            currentOptions={setReformattedLanguage}
                            placeholder={"service.data.modalLanguage.lanName"}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<IntlMessage id={"service.data.modalLanguage.lanSkill"} />}
                        name="rate_language"
                        required
                        rules={[
                            {
                                validator: (_, value) => {
                                    return new Promise((resolve, reject) => {
                                        if (value) {
                                            resolve();
                                        } else {
                                            reject(
                                                <IntlMessage
                                                    id={"service.data.modalLanguage.chooseLanSkill"}
                                                />,
                                            );
                                        }
                                    });
                                },
                            },
                        ]}
                    >
                        <Rate
                            value={editedRate}
                            onChange={(rate_language) => {
                                form.setFieldsValue({ rate_language }); // Update the form field value
                                setEditedRate(rate_language);
                            }}
                            character={
                                <span
                                    style={{
                                        margin: "0 auto",
                                        fontSize: 40,
                                        textAlign: "center",
                                    }}
                                >
                                    •
                                </span>
                            }
                            tooltips={textList[language]}
                            className="modal-language-rate"
                        />
                        <div style={{ marginTop: "10px", display: "flex" }}>
                            {textList[language].map((text, index) => (
                                <span
                                    key={index}
                                    style={{
                                        margin: "0 auto",
                                        width: "20%",
                                        textAlign: "center",
                                        fontSize: "12px",
                                    }}
                                >
                                    {text}
                                </span>
                            ))}
                        </div>
                    </Form.Item>
                    <p className="fam_form_title_text">
                        <IntlMessage id={"service.data.modalAcademicDegree.docAccept"} />
                    </p>
                    <Form.Item
                        name="dragger"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        noStyle
                        rules={[{ validator: validateFileList }]}
                    >
                        <Dragger fileList={file} {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                <IntlMessage id="dragger.text" />
                            </p>
                        </Dragger>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ModalLanguages;
