import { InboxOutlined } from "@ant-design/icons";
import { Button, Select, Form, message, Modal, Rate, Row, Upload } from "antd";
import { fileExtensions } from "constants/FileExtensionConstants";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileUploaderService from "services/myInfo/FileUploaderService";
import { deleteByPathEducation } from "store/slices/myInfo/educationSlice";
import { replaceByPath, setFieldValue } from "store/slices/myInfo/myInfoSlice";
import "./educationModal.css";
import IntlMessage from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import i18n from "lang";
import EducationService from "services/myInfo/EducationService";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const textList = {
    ru: ["Слабо", "Неудовлетворительно", "Удовлетворительно", "Хорошо", "Отлично"],
    kk: ["Нашар", "қанағаттанарлықсыз", "Қанағаттандырулы", "Жақсы", "Өте жақсы"],
};

const ModalLanguagesEdit = ({ isOpen, onClose, language }) => {
    const [reformattedLanguage, setReformattedLanguage] = useState([]);
    const [filesChanged, setFilesChanged] = useState(false);
    const [editedRate, setEditedRate] = useState("");
    const [fileList, setFileList] = useState(null);

    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const edited_languages = useSelector((state) => state.myInfo.edited.education.add_language);
    const education_remote = useSelector((state) => state.education.educationData.data);
    const education_local = useSelector((state) => state.myInfo.allTabs.education.add_language);
    const lang = i18n.language;

    const { languages } = useSelector((state) => state.education);

    useEffect(() => {
        if (!isOpen) return;
        const uniqueArr = languages.data.objects.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
        if (
            education_remote.language_proficiency.length > 0 ||
            education_local.length > 0 ||
            edited_languages.length > 0
        ) {
            const combinedLanguages = [
                ...education_remote.language_proficiency,
                ...education_local,
                ...edited_languages,
            ];

            const filteredCombinedLanguages = combinedLanguages.filter(
                (item) => item.language_id !== language.language_id,
            );

            const filteredLanguages = uniqueArr.filter((item) => {
                return !filteredCombinedLanguages.some((lang) => lang.language_id === item.value);
            });

            setReformattedLanguage(filteredLanguages);
        } else {
            setReformattedLanguage(uniqueArr);
        }
    }, [isOpen]);

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
            formData.append("file", file.originFileObj);
        });

        try {
            const response = await FileUploaderService.upload(formData);
            setFileList(response.link);
            // Return the response link so it can be used in the handleOk function
            return response.link;
        } catch (error) {
            void message.error(<IntlMessage id={"service.data.modalAddPsycho.cannotLoadFile"} />);
        }
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const getFile = async () => {
        const file = await FileUploaderService.getFileByLink(language.document_link);
        form.setFieldsValue({
            dragger: [file],
        });
    };

    const props = {
        action: `${S3_BASE_URL}/upload`,
        headers,
        onRemove: handleFileRemove,
        name: "file",
        multiple: true,
        accept: fileExtensions, // разрешенные расширения
        onChange(info) {
            setFilesChanged(true);
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

    const changeDispatchValues = (obj, source) => {
        if (source === "get") {
            // Delete from GET slice
            dispatch(
                deleteByPathEducation({
                    path: "educationData.data.language_proficiency",
                    id: language.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                setFieldValue({
                    fieldPath: "edited.education.add_language",
                    value: [...edited_languages, obj],
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: "edited.education.add_language",
                    id: language.id,
                    newObj: obj,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.education.add_language",
                    id: language.id,
                    newObj: obj,
                }),
            );
        }
        handleClose();
    };

    const handleOk = async () => {
        const values = await form.validateFields();
        const response = filesChanged
            ? await handleFileUpload(values.dragger)
            : language.document_link;

        const editedLanguage = {
            language_id: values.name_language,
            level: values.rate_language,
            profile_id: language.profile_id,
            id: language.id,
            document_link: response ?? null,
            source: language.source ? language.source : "edited",
        };

        changeDispatchValues(editedLanguage);
    };

    const handleDelete = () => {
        changeDispatchValues({ id: language.id, delete: true }, language.source ?? "get");
    };

    const handleClose = () => {
        form.resetFields();
        setFilesChanged(false);

        onClose();
    };

    useEffect(() => {
        form.resetFields();
        findSelectOption(language.language_id);
        const values = {
            name_language: language.language_id,
            rate_language: language.level,
        };
        setEditedRate(language.level);
        form.setFieldsValue(values);
        if (language.document_link) {
            getFile();
        }
    }, [form, language, isOpen]);

    const findSelectOption = async (id) => {
        const response = await EducationService.get_language_id(id);

        setReformattedLanguage((prevData) => [
            ...new Set(prevData),
            { value: response.id, label: LocalText.getName(response) },
        ]);
    };

    return (
        // Редактирование сведений о знаниях ин. языков
        <Modal
            title={<IntlMessage id={"service.data.modalLanguage.edit.languages"} />}
            onClick={(e) => e.stopPropagation()}
            onCancel={onClose}
            open={isOpen}
            footer={
                <Row justify="end">
                    <Button danger onClick={handleDelete}>
                        <IntlMessage id={"initiate.deleteAll"} />
                    </Button>
                    <Button onClick={onClose}>
                        <IntlMessage id={"service.data.modalAddPsycho.cancel"} />
                    </Button>
                    <Button type="primary" onClick={handleOk}>
                        <IntlMessage id={"service.data.modalAddPsycho.save"} />
                    </Button>
                </Row>
            }
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label={<IntlMessage id={"service.data.modalLanguage.lanName"} />}
                    name="name_language"
                    rules={[
                        {
                            required: true,
                            message: (
                                <IntlMessage id={"service.data.modalLanguage.chooseLanName"} />
                            ),
                        },
                    ]}
                    required
                >
                    <Select
                        options={reformattedLanguage}
                        showSearch
                        filterOption={(inputValue, option) =>
                            option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                        }
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
                            form.setFieldsValue({ rate_language });
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
                        tooltips={textList[lang]}
                        className="modal-language-rate"
                    />
                    <div style={{ marginTop: "10px", display: "flex" }}>
                        {textList[lang].map((text, index) => (
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
                >
                    <Upload.Dragger fileList={fileList} {...props} maxCount={1}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                            <IntlMessage id={"service.data.modalLanguage.chooseFileLoad"} />
                        </p>
                    </Upload.Dragger>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalLanguagesEdit;
