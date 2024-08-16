import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InboxOutlined } from "@ant-design/icons";
import { Col, DatePicker, Form, Input, message, Modal, Row, Radio, Select } from "antd";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { fileExtensions } from "constants/FileExtensionConstants";
import { setFieldValue } from "store/slices/myInfo/myInfoSlice";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import { useAppSelector } from "hooks/useStore";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

import FileUploaderService from "services/myInfo/FileUploaderService";
import uuidv4 from "utils/helpers/uuid";
import "../styleModals.css";
import SelectPickerMenu from "./SelectPickerMenu";
import Dragger from "antd/es/upload/Dragger";
import {
    getInstitution,
    getInstitutionDegreeType,
    getInstitutionMilitary,
    getSpecialties,
} from "store/slices/myInfo/educationSlice";
import { PERMISSION } from "constants/permission";

const ModalEductionAdd = ({ isOpen, onClose }) => {
    const [updateOptions, setUpdateOptions] = useState(false);
    const [optionValue, setOptionValue] = useState({});

    const [reformattedInstitution, setReformattedInstitution] = useState([]);
    const [reformattedInstitutionMilitary, setReformattedInstitutionMilitary] = useState([]);
    const [reformattedInstitutionDegreeType, setReformattedInstitutionDegreeType] = useState([]);
    const [specialtiesOptions, setSpecialtiesOptions] = useState([]);
    const [schoolType, setSchoolType] = useState("");

    const [file, setFile] = useState();

    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const { add_education } = useSelector((state) => state.myInfo.allTabs.education);
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

    const validateValues = (rule) => {
        return new Promise((resolve, reject) => {
            if (rule.field === "institution") {
                if (!optionValue[rule.field] && !optionValue["institutionMilitary"]) {
                    reject(<IntlMessage id="education.select.empty" />);
                } else {
                    resolve();
                }
            } else if (!optionValue[rule.field]) {
                reject(<IntlMessage id="education.select.empty" />);
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

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await handleFileUpload(values.dragger);

            const newEducation = {
                specialty_id: optionValue.specialization ?? null,
                institution_id: optionValue.institution ?? null,
                military_institution_id: optionValue.institutionMilitary ?? null,
                school_type: schoolType,
                is_military_school: schoolType === "militaryAcademy",
                start_date: values.date[0].toDate(),
                end_date: values.date[1].toDate(),
                degree_id: optionValue.degree,
                document_number: values.document_number,
                date_of_issue: values.date_of_issue.toDate(),
                document_link: response ?? null,
                type_of_top: null,
                id: uuidv4(),
                source: "added",
            };

            if (updateOptions) {
                dispatch(getInstitution());
                dispatch(getInstitutionMilitary());
                dispatch(getInstitutionDegreeType());
                dispatch(getSpecialties());
            }

            dispatch(
                setFieldValue({
                    fieldPath: "allTabs.education.add_education",
                    value: [...add_education, newEducation],
                }),
            );

            handleClose();
        } catch (error) {
            console.log(error);
        }
    };

    const handleClose = () => {
        form.resetFields();

        setOptionValue({});
        setSchoolType("");
        onClose();
    };

    const handleRadioSelect = (e, name) => {
        setSchoolType(e.target.value);
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                // title={'Добавить образование'}
                title={
                    <Row align="middle" justify="space-between">
                        <IntlMessage id={"service.data.modalEducation.addEducation"} />
                    </Row>
                }
                open={isOpen && isHR}
                onCancel={handleClose}
                onOk={handleOk}
                okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
                cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={[5, 5]}>
                        <Col span={24}>
                            <Form.Item
                                name="schoolType"
                                label={
                                    <IntlMessage
                                        id={"service.data.modalEducation.nameIsMilitary"}
                                    />
                                }
                                required
                            >
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
                                        validator: validateValues,
                                    },
                                ]}
                                required
                                className="modalEducationAdd__institutionNameInput"
                            >
                                {schoolType === "militaryAcademy" && schoolType !== "" && (
                                    <SelectPickerMenu
                                        setUpdate={setUpdateOptions}
                                        options={reformattedInstitutionMilitary}
                                        type="institutionMilitary"
                                        setValue={setOptionValue}
                                        values={optionValue}
                                        currentOptions={setReformattedInstitutionMilitary}
                                        placeholder={IntlMessageText.getText({
                                            id: "service.data.modalEducation.nameEducationalInstitution",
                                        })}
                                    />
                                )}
                                {schoolType === "" && (
                                    <Select
                                        disabled={true}
                                        placeholder={IntlMessageText.getText({
                                            id: `service.data.modalEducation.nameEducationalInstitution`,
                                        })}
                                    />
                                )}
                                {schoolType !== "militaryAcademy" && schoolType !== "" && (
                                    <SelectPickerMenu
                                        setUpdate={setUpdateOptions}
                                        options={reformattedInstitution}
                                        type="institution"
                                        setValue={setOptionValue}
                                        values={optionValue}
                                        currentOptions={setReformattedInstitution}
                                        placeholder={IntlMessageText.getText({
                                            id: "service.data.modalEducation.nameEducationalInstitution",
                                        })}
                                    />
                                )}
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
                        <DatePicker.RangePicker className="fam_full_width" format="DD-MM-YYYY" />
                    </Form.Item>
                    <Form.Item
                        label={<IntlMessage id={"service.data.modalEducation.degreeEdu"} />}
                        name="degree"
                        rules={[
                            {
                                validator: validateValues,
                            },
                        ]}
                        required
                    >
                        <SelectPickerMenu
                            setUpdate={setUpdateOptions}
                            options={reformattedInstitutionDegreeType}
                            type="degree"
                            setValue={setOptionValue}
                            values={optionValue}
                            currentOptions={setReformattedInstitutionDegreeType}
                            placeholder={"service.data.modalEducation.degreeEdu"}
                        />
                    </Form.Item>

                    <Form.Item
                        label={
                            <IntlMessage id={"service.data.modalAcademicDegree.specialization"} />
                        }
                        name="specialization"
                    >
                        <SelectPickerMenu
                            setUpdate={setUpdateOptions}
                            options={specialtiesOptions}
                            type="specialization"
                            setValue={setOptionValue}
                            values={optionValue}
                            currentOptions={setSpecialtiesOptions}
                            placeholder={"service.data.modalEducation.choosePeriodEducation"}
                        />
                    </Form.Item>
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

export default ModalEductionAdd;
