import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "antd/es/form/Form";
import { DatePicker, Modal, message, Form, Input } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { fileExtensions } from "constants/FileExtensionConstants";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import FileUploaderService from "services/myInfo/FileUploaderService";
import SelectPickerMenu from "./SelectPickerMenu";
import uuidv4 from "utils/helpers/uuid";
import { setFieldValue } from "store/slices/myInfo/myInfoSlice";
import LanguageSwitcher from "components/shared-components/LanguageSwitcher";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import Dragger from "antd/es/upload/Dragger";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const ModalCourseAdd = ({ isOpen, onClose }) => {
    const [file, setFile] = useState(null);
    const [optionValue, setOptionValue] = useState({});
    const [currentLanguage, setCurrentLanguage] = useState("rus");
    const [organizationOptions, setOrganizationOptions] = useState([]);
    const [courseNames, setCourseNames] = useState({ name: "", nameKZ: "" });

    const [form] = useForm();

    const add_course = useSelector((state) => state.myInfo.allTabs.education.add_course);

    const dispatch = useDispatch();

    const { course_provider } = useSelector((state) => state.education);

    useEffect(() => {
        if(!isOpen) return;
        const options =  course_provider.data.objects.map((item) => ({
            value: item.id,
            label: LocalText.getName(item),
            object: item,
        }));
        setOrganizationOptions(options)
    }, [isOpen, course_provider])

    const validateValues = (rule) => {
        return new Promise((resolve, reject) => {
            if (!optionValue[rule.field]) {
                reject(<IntlMessage id="education.select.empty" />);
            } else {
                resolve();
            }
        });
    };

    const validateFileList = (rule, value) => {
        return new Promise((resolve, reject) => {
            resolve();
        });
    };

    const validateLocalization = () => {
        const isRusEmpty = courseNames.name.trim() === "";
        const isKZEmpty = courseNames.nameKZ.trim() === "";

        return new Promise((resolve, reject) => {
            if (isRusEmpty && isKZEmpty) {
                reject(<IntlMessage id="personal.modals.localization.empty" />);
            } else if (isKZEmpty) {
                reject(<IntlMessage id="personal.modals.localization.kz" />);
            } else if (isRusEmpty) {
                reject(<IntlMessage id="personal.modals.localization.ru" />);
            } else {
                resolve();
            }
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
                    `${info.file.name} ${(<IntlMessage id="medical.file.upload.success" />)}`,
                );
            } else if (status === "error") {
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

    const handleInput = (event) => {
        setCourseNames({
            ...courseNames,
            [currentLanguage === "rus" ? "name" : "nameKZ"]: event.target.value,
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
            // Return the response link, so it can be used in the onOk function
            return response.link;
        } catch (error) {
            void message.error(<IntlMessage id="medical.file.upload.error" />);
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await handleFileUpload(values.dragger);
            const currentOrganization = organizationOptions.find(
                (item) => item.value === optionValue.course_provider,
            );

            const newCourse = {
                name: courseNames.name,
                nameKZ: courseNames.nameKZ,
                course_provider_id: currentOrganization.value,
                start_date: values.date[0].toDate(),
                end_date: values.date[1].toDate(),
                document_link: response,
                id: uuidv4(),
            };

            dispatch(
                setFieldValue({
                    fieldPath: "allTabs.education.add_course",
                    value: [...add_course, newCourse],
                }),
            );

            handleClose();
        } catch (error) {
            console.log("Form validation error", error);
        }
    };

    const handleClose = () => {
        setCourseNames({ name: "", nameKZ: "" });
        setCurrentLanguage("rus");
        setOptionValue({});
        form.resetFields();
        onClose();
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        // title={'Добавить сведения о курсе'}
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
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
                            <IntlMessage id={"service.data.modalAddCourse.addCourseInfo"} />
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
                onCancel={handleClose}
                onOk={handleOk}
                okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
                cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label={<IntlMessage id={"service.data.modalAddCourse.courseName"} />}
                        name="course"
                        rules={[
                            {
                                validator: validateLocalization,
                            },
                        ]}
                        required
                    >
                        <Input
                            placeholder={IntlMessageText.getText({
                                id: "service.data.modalAddCourse.courseName",
                            })}
                            value={
                                currentLanguage === "rus" ? courseNames.name : courseNames.nameKZ
                            }
                            onChange={handleInput}
                        />
                        <p className="fam_invisible_text">
                            {currentLanguage === "rus" ? courseNames.name : courseNames.nameKZ}
                        </p>
                    </Form.Item>

                    <Form.Item
                        label={<IntlMessage id={"service.data.modalAddCourse.orgName"} />}
                        name="course_provider"
                        rules={[
                            {
                                validator: validateValues,
                            },
                        ]}
                        required
                    >
                        <SelectPickerMenu
                            options={organizationOptions}
                            type="course_provider"
                            values={optionValue}
                            setValue={setOptionValue}
                            currentOptions={setOrganizationOptions}
                            placeholder={"service.data.modalAddCourse.orgName"}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<IntlMessage id={"service.data.modalEducation.periodEducation"} />}
                        name="date"
                        rules={[
                            {
                                required: true,
                                message: (
                                    <IntlMessage
                                        id={"service.data.modalEducation.choosePeriodEducation"}
                                    />
                                ),
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
                                    id: "service.data.modalEducation.startEdu",
                                }),
                                IntlMessageText.getText({
                                    id: "service.data.modalEducation.endEdu",
                                }),
                            ]}
                            format="DD-MM-YYYY"
                        />
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

export default ModalCourseAdd;
