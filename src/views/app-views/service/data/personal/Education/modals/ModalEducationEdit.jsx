import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InboxOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Select, Radio } from "antd";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { fileExtensions } from "constants/FileExtensionConstants";
import { deleteByPathEducation } from "store/slices/myInfo/educationSlice";
import { replaceByPath, setFieldValue } from "store/slices/myInfo/myInfoSlice";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import { useAppSelector } from "hooks/useStore";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

import FileUploaderService from "services/myInfo/FileUploaderService";
import Dragger from "antd/es/upload/Dragger";
import moment from "moment";
import "moment/locale/ru";
import "../styleModals.css";
import { PERMISSION } from "constants/permission";

const ModalEducationEdit = ({ isOpen, onClose, education }) => {
    const [showSpecialization, setShowSpecialization] = useState(false);
    const [schoolType, setSchoolType] = useState("");
    const [source, setSource] = useState("");

    const [reformattedInstitution, setReformattedInstitution] = useState([]);
    const [reformattedInstitutionMilitary, setReformattedInstitutionMilitary] = useState([]);
    const [reformattedInstitutionDegreeType, setReformattedInstitutionDegreeType] = useState([]);
    const [specialtiesOptions, setSpecialtiesOptions] = useState([]);
    const [filesChanged, setFilesChanged] = useState(false);

    const [file, setFile] = useState();

    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const { add_education } = useSelector((state) => state.myInfo.edited.education);
    const { institutionDegreeType, institutions, institutionsMilitary, specialties } = useSelector(
        (state) => state.education,
    );

    const isHR = useAppSelector((state) => state.profile.permissions)?.includes(
        PERMISSION.PERSONAL_PROFILE_EDITOR,
    );

    useEffect(() => {
        if (!isOpen) return;
        const fetchOptionsData = async (data) => {
            return data.objects.map((item) => ({
                value: item.id,
                label: LocalText.getName(item),
                object: item,
            }));
        };

        const fetchOptions = async () => {
            const fetchData = async (data) => {
                const options = await fetchOptionsData(data);
                return options.filter(
                    (value, index, self) =>
                        self.findIndex((v) => v.value === value.value) === index,
                );
            };

            const [
                institutionOptions,
                institutionMilitaryOptions,
                institutionDegreeOptions,
                specialtyOptions,
            ] = await Promise.all([
                fetchData(institutions.data),
                fetchData(institutionsMilitary.data),
                fetchData(institutionDegreeType.data),
                fetchData(specialties.data),
            ]);

            setReformattedInstitution(institutionOptions);
            setReformattedInstitutionMilitary(institutionMilitaryOptions);
            setReformattedInstitutionDegreeType(institutionDegreeOptions);
            setSpecialtiesOptions(specialtyOptions);
        };

        fetchOptions();
    }, [isOpen]);

    useEffect(() => {
        if (!education) return;
        if (!isOpen) return;

        form.resetFields();
        form.setFieldsValue({
            institution: education.institution_id ?? education.military_institution_id,
            date: [moment(education.start_date), moment(education.end_date)],
            degree: education.degree_id,
            specialization: education.specialty_id,
            document_number: education.document_number,
            date_of_issue:
                education.date_of_issue !== null ? moment(education.date_of_issue) : null,
            document_link: education.document_link ?? null,
        });

        if (education?.specialty_id !== null) {
            setShowSpecialization(true);
        }

        setSchoolType(education.school_type);
        setSource(education.source ? education.source : "get");
        onChange(education.degree_id);

        (async () => {
            const file = await FileUploaderService.getFileByLink(education.document_link);
            form.setFieldsValue({ dragger: [file] });
        })();
    }, [education, form, isOpen]);

    const onChange = (event) => {
        if (!event || reformattedInstitutionDegreeType.length === 0) return;
        const isMiddleSchool = reformattedInstitutionDegreeType.find(
            (item) => item.value === event,
        );

        setShowSpecialization(isMiddleSchool.label !== "Среднее");
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
            message.error(<IntlMessage id="medical.file.upload.error" />);
        }
    };

    const validateFileList = (rule, value) => {
        return new Promise((resolve, reject) => {
            resolve();
        });
    };

    const handleFileRemove = () => {
        form.setFieldsValue({ document_link: [] });
        setFilesChanged(true);
    };

    const onChangeDragger = (info) => {
        setFilesChanged(true);
        const file = info.file;
        const status = file.status;

        const messageContent =
            status === "done"
                ? "service.data.modalAddPsycho.successLoadFile"
                : "service.data.modalAddPsycho.cannotLoadFile2";
        message[status === "done" ? "success" : "error"](
            `${file.name}${(<IntlMessage id={messageContent} />)}`,
        );
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const response = filesChanged
                ? await handleFileUpload(values.dragger)
                : education.document_link;

            const editEducation = {
                specialty_id: values.specialization ?? null,
                institution_id: schoolType === "militaryAcademy" ? null : values.institution,
                military_institution_id:
                    schoolType !== "militaryAcademy" ? null : values.institution,
                school_type: schoolType,
                is_military_school: schoolType === "militaryAcademy",
                start_date: moment(values.date[0].toDate()).format("YYYY-MM-DD"),
                end_date: moment(values.date[1].toDate()).format("YYYY-MM-DD"),
                degree_id: values.degree,
                document_number: values.document_number,
                date_of_issue: moment(values.date_of_issue.toDate()).format("YYYY-MM-DD"),
                document_link: response,
                type_of_top: null,
                id: education.id,
                source: education.source ? education.source : "edited",
            };

            changeDispatchValues(editEducation);
        } catch (error) {
            console.log(error);
        }
    };

    const changeDispatchValues = (obj) => {
        if (source === "get") {
            dispatch(
                deleteByPathEducation({ path: "educationData.data.education", id: education.id }),
            );
            dispatch(
                setFieldValue({
                    fieldPath: "edited.education.add_education",
                    value: [...add_education, obj],
                }),
            );
        }

        if (source === "edited") {
            dispatch(
                replaceByPath({
                    path: "edited.education.add_education",
                    id: education.id,
                    newObj: obj,
                }),
            );
        }

        if (source === "added") {
            dispatch(
                replaceByPath({
                    path: "allTabs.education.add_education",
                    id: education.id,
                    newObj: obj,
                }),
            );
        }

        handleClose();
    };

    const handleClose = () => {
        form.resetFields();

        setShowSpecialization(false);
        setSource("");
        setFilesChanged(false);
        onClose();
    };

    const handleDelete = () => {
        changeDispatchValues({ id: education.id, delete: true });
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const handleRadioSelect = (e, name) => {
        setSchoolType(e.target.value);
        form.setFieldsValue({ institution: "" });
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                // title={'Редактировать образование'}
                title={
                    <Row align="middle" justify="space-between">
                        <IntlMessage id={"service.data.modalEducation.edit.Education"} />
                    </Row>
                }
                open={isOpen && isHR}
                onCancel={handleClose}
                footer={
                    <Row justify="end">
                        <Button danger onClick={handleDelete}>
                            <IntlMessage id={"initiate.deleteAll"} />
                        </Button>
                        <Button onClick={handleClose}>
                            <IntlMessage id={"service.data.modalAddPsycho.cancel"} />
                        </Button>
                        <Button type="primary" onClick={handleOk}>
                            <IntlMessage id={"service.data.modalAddPsycho.save"} />
                        </Button>
                    </Row>
                }
            >
                <Form form={form} layout="vertical">
                    <Row gutter={[5, 5]}>
                        <Col span={24}>
                            <Form.Item name="schoolType">
                                <Radio
                                    className="fam_check_box"
                                    name={"schoolType"}
                                    value={"militaryAcademy"}
                                    checked={schoolType === "militaryAcademy"}
                                    onChange={(e) => handleRadioSelect(e, "militaryAcademy")}
                                >
                                    <IntlMessage
                                        id={"service.data.modalEducation.militaryAcademy"}
                                    />
                                </Radio>
                                <Radio
                                    className="fam_check_box"
                                    name={"schoolType"}
                                    checked={schoolType === "fullTime"}
                                    value={"fullTime"}
                                    onChange={(e) => handleRadioSelect(e, "fullTime")}
                                >
                                    <IntlMessage id={"service.data.modalEducation.fullTime"} />
                                </Radio>
                                <Radio
                                    className="fam_check_box"
                                    name={"schoolType"}
                                    checked={schoolType === "correspondence"}
                                    value={"correspondence"}
                                    onChange={(e) => handleRadioSelect(e, "correspondence")}
                                >
                                    <IntlMessage
                                        id={"service.data.modalEducation.correspondence"}
                                    />
                                </Radio>
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item
                                label={
                                    <IntlMessage
                                        id={
                                            "service.data.modalEducation.nameEducationalInstitution"
                                        }
                                    />
                                }
                                name="institution"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <IntlMessage
                                                id={
                                                    "service.data.modalEducation.chooseNameEducationalInstitution"
                                                }
                                            />
                                        ),
                                    },
                                ]}
                                required
                            >
                                <Select
                                    options={
                                        schoolType !== "militaryAcademy"
                                            ? reformattedInstitution
                                            : reformattedInstitutionMilitary
                                    }
                                    showSearch
                                    filterOption={(inputValue, option) =>
                                        option.label
                                            .toLowerCase()
                                            .indexOf(inputValue.toLowerCase()) >= 0
                                    }
                                    disabled={schoolType === ""}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
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
                            className="fam_full_width"
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
                        label={<IntlMessage id={"service.data.modalEducation.degreeEdu"} />}
                        name="degree"
                        rules={[
                            {
                                required: true,
                                message: (
                                    <IntlMessage
                                        id={"service.data.modalEducation.chooseDegreeEdu"}
                                    />
                                ),
                            },
                        ]}
                        required
                    >
                        <Select
                            options={reformattedInstitutionDegreeType}
                            onChange={onChange}
                            placeholder={
                                <IntlMessage id={"service.data.modalEducation.degreeEdu"} />
                            }
                            showSearch
                            filterOption={(inputValue, option) =>
                                option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                            }
                        />
                    </Form.Item>

                    {showSpecialization ? (
                        <Form.Item
                            label={
                                <IntlMessage
                                    id={"service.data.modalAcademicDegree.specialization"}
                                />
                            }
                            name="specialization"
                        >
                            <Select
                                options={specialtiesOptions}
                                filterOption={(inputValue, option) =>
                                    option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >=
                                    0
                                }
                                showSearch
                            />
                        </Form.Item>
                    ) : null}
                    <Row>
                        <p className="fam_form_title_symbol">*</p>
                        <p className="fam_form_title_text">
                            <IntlMessage id={"service.data.modalAddPsycho.docInfo"} />
                        </p>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col xs={12}>
                            <Form.Item
                                name="document_number"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <IntlMessage
                                                id={
                                                    "service.data.modalAcademicDegree.document.number"
                                                }
                                            />
                                        ),
                                    },
                                ]}
                            >
                                <Input
                                    placeholder={IntlMessageText.getText({
                                        id: "service.data.modalAddPsycho.docNum",
                                    })}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={12}>
                            <Form.Item
                                name="date_of_issue"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <IntlMessage
                                                id={"service.data.modalAcademicDegree.dateGive"}
                                            />
                                        ),
                                    },
                                ]}
                            >
                                <DatePicker
                                    placeholder={IntlMessageText.getText({
                                        id: "service.data.modalAcademicDegree.dateGiveTxt",
                                    })}
                                    name="date_of_issue"
                                    format="DD-MM-YYYY"
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
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
                        <Dragger
                            action={`${S3_BASE_URL}/upload`}
                            headers={headers}
                            fileList={file}
                            maxCount={1}
                            onRemove={handleFileRemove}
                            name={"file"}
                            accept={fileExtensions}
                            onChange={onChangeDragger}
                            progress={true}
                            openFileDialogOnClick={true}
                        >
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

export default ModalEducationEdit;
