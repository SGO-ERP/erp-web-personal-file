import React, { useEffect, useState } from "react";
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Upload, Select } from "antd";
import { deleteByPathEducation } from "store/slices/myInfo/educationSlice";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { replaceByPath, setFieldValue } from "store/slices/myInfo/myInfoSlice";
import { fileExtensions } from "constants/FileExtensionConstants";
import { CloseOutlined, InboxOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import LanguageSwitcher from "components/shared-components/LanguageSwitcher";
import FileUploaderService from "services/myInfo/FileUploaderService";
import Dragger from "antd/es/upload/Dragger";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";
import moment from "moment";
import "../styleModals.css";
import EducationService from "services/myInfo/EducationService";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const ModalCourseEdit = ({ isOpen, onClose, source = "get", course }) => {
    const [courseNames, setCourseNames] = useState({ name: "", nameKZ: "" });
    const [organizationOptions, setOrganizationOptions] = useState([]);
    const [currentLanguage, setCurrentLanguage] = useState("rus");
    const [filesChanged, setFilesChanged] = useState(false);
    const [file, setFile] = useState();

    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const edited_courses = useSelector((state) => state.myInfo.edited.education.add_course);
    const { course_provider } = useSelector((state) => state.education);

    useEffect(() => {
        if(!isOpen) return;
        const options =  course_provider.data.objects.map((item) => ({
            value: item.id,
            label: LocalText.getName(item),
            object: item,
        }));
        setOrganizationOptions(options)
    }, [isOpen]);

    const handleFileRemove = () => {
        form.setFieldsValue({ document_link: [] });
        setFilesChanged(true);
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

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.document_link;
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
            setFile(response.link);
            // Return the response link, so it can be used in the onOk function
            return response.link;
        } catch (error) {
            void message.error(<IntlMessage id="medical.file.upload.error" />);
        }
    };

    const handleInput = (event) => {
        setCourseNames({
            ...courseNames,
            [currentLanguage === "rus" ? "name" : "nameKZ"]: event.target.value,
        });
    };

    const changeDispatchValues = (obj) => {
        if (source === "get") {
            // Delete from GET slice
            dispatch(
                deleteByPathEducation({
                    path: "educationData.data.course",
                    id: course.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                setFieldValue({
                    fieldPath: "edited.education.add_course",
                    value: [...edited_courses, obj],
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: "edited.education.add_course",
                    id: course.id,
                    newObj: obj,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.education.add_course",
                    id: course.id,
                    newObj: obj,
                }),
            );
        }

        handleClose();
    };

    useEffect(() => {
        form.resetFields();

        const values = {
            course_provider: course.course_provider_id,
            date: [moment(course.start_date), moment(course.end_date)],
        };

        setCourseNames({ name: course.name, nameKZ: course.nameKZ });
        findSelectOption(course.course_provider_id, "course_provider", setOrganizationOptions);

        form.setFieldsValue(values);

        if (course.document_link) {
            const getFile = async () => {
                const file = await FileUploaderService.getFileByLink(course.document_link);
                form.setFieldsValue({
                    dragger: [file],
                });
            };
            getFile();
        }
    }, [form, course, isOpen]);

    const findSelectOption = async (id, type, setOptions) => {
        const response = await EducationService.get_course_provider_id(id);

        setOptions((prevData) => [
            ...new Set(prevData),
            { value: response.id, label: LocalText.getName(response) },
        ]);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const link = filesChanged
                ? await handleFileUpload(values.dragger)
                : course.document_link;
            const currentOrganization = organizationOptions.find(
                (item) => item.value === values.course_provider,
            );

            const editCourse = {
                name: courseNames.name,
                nameKZ: courseNames.nameKZ,
                course_provider_id: currentOrganization.value,
                start_date: values.date[0].toDate(),
                end_date: values.date[1].toDate(),
                document_link: link,
                id: course.id,
            };

            changeDispatchValues(editCourse);
        } catch (error) {
            console.log("Form validation error", error);
        }
    };

    const handleDelete = () => {
        changeDispatchValues({ id: course.id, delete: true });
    };

    const handleClose = () => {
        setCourseNames({ name: "", nameKZ: "" });
        setCurrentLanguage("rus");
        setFilesChanged(false);
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            // title={'Редактировать сведения о курсе'}
            title={
                <Row align="middle" justify="space-between">
                    <Col>
                        <IntlMessage id={"service.data.modalEducation.edit.course"} />
                    </Col>
                    <Col xs={5}>
                        <Row align="middle" justify="space-between">
                            <LanguageSwitcher
                                size="small"
                                fontSize="12px"
                                height="1.4rem"
                                current={currentLanguage}
                                setLanguage={setCurrentLanguage}
                            />
                            <Col onClick={handleClose}>
                                <CloseOutlined />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            }
            onClick={(e) => e.stopPropagation()}
            onCancel={handleClose}
            closeIcon={true}
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
                        value={currentLanguage === "rus" ? courseNames.name : courseNames.nameKZ}
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
                            required: true,
                            message: (
                                <IntlMessage id={"service.data.modalAddCourse.chooseOrgName"} />
                            ),
                        },
                    ]}
                    required
                >
                    <Select
                        showSearch
                        options={organizationOptions}
                        filterOption={(inputValue, option) =>
                            option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                        }
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
                        name="date"
                    />
                </Form.Item>

                <Form.Item
                    label={<IntlMessage id={"service.data.modalAcademicDegree.docAccept"} />}
                >
                    <Form.Item
                        name="dragger"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        noStyle
                        rules={[{ validator: validateFileList }]}
                    >
                        <Dragger fileList={file} {...props} multiple={false} maxCount={1}>
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
    );
};

export default ModalCourseEdit;
