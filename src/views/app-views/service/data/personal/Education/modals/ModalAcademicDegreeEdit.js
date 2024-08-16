import { InboxOutlined } from "@ant-design/icons";
import { Button, Select, DatePicker, Form, Input, message, Modal, Row, Upload } from "antd";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { fileExtensions } from "constants/FileExtensionConstants";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileUploaderService from "services/myInfo/FileUploaderService";
import { deleteByPathEducation } from "store/slices/myInfo/educationSlice";
import { replaceByPath, setFieldValue } from "store/slices/myInfo/myInfoSlice";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import React from "react";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";
import EducationService from "services/myInfo/EducationService";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const ModalAcademicDegreeEdit = ({ isOpen, onClose, degree }) => {
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10_000 });
    const [maxCount, setMaxCount] = useState(0);
    const [searchText, setSearchText] = useState({});

    const [degreeOptions, setDegreeOptions] = useState([]);
    const [scienceOptions, setScienceOptions] = useState([]);
    const [specialtyOptions, setSpecialtyOptions] = useState([]);
    const [fileList, setFileList] = useState(null);
    const [filesChanged, setFilesChanged] = useState(false);
    const [source, setSource] = useState("");

    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const { add_academic_degree } = useSelector((state) => state.myInfo.edited.education);

    const handleFileRemove = () => {
        form.setFieldsValue({ dragger: [] });
        setFilesChanged(true);
    };

    useEffect(() => {
        fetchOptions();
    }, [scrollingLength, searchText]);

    const fetchOptionsData = async (baseUrl, type) => {
        const response = await SelectPickerMenuService.getEducation({
            ...scrollingLength,
            baseUrl,
        });

        setMaxCount((prevData) => ({ ...prevData, [type]: response.total }));

        return response.objects.map((item) => ({
            value: item.id,
            label: LocalText.getName(item),
            object: item,
        }));
    };

    const fetchOptions = async () => {
        const degreeOptions = await fetchOptionsData(
            "/education/academic_degree_degrees",
            "degree_academic",
        );
        const scienceOptions = await fetchOptionsData("/education/sciences", "science");
        const specialtyOptions = await fetchOptionsData("/education/specialties", "specialization");

        let uniqueArrDegree = degreeOptions.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });

        let uniqueArrScienceOption = scienceOptions.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });

        let uniqueArrSpecOption = specialtyOptions.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });

        // we use set to delete dublicates
        setDegreeOptions(uniqueArrDegree);
        setScienceOptions(uniqueArrScienceOption);
        setSpecialtyOptions(uniqueArrSpecOption);
    };

    const loadMoreOptions = (type) => {
        const newLimit = scrollingLength.limit + 10_000;
        const limitedLimit = newLimit > maxCount[type] ? maxCount[type] : newLimit;

        setScrollingLength({ skip: scrollingLength.skip, limit: limitedLimit });
    };

    const handlePopupScroll = (e, type) => {
        const { target } = e;
        if (target.scrollTop + target.clientHeight === target.scrollHeight) {
            loadMoreOptions(type);
        }
    };

    const handleSearch = (value, type) => {
        setSearchText((prevData) => ({ ...prevData, [type]: value }));
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

    const handleClose = () => {
        form.resetFields();

        setScrollingLength({ skip: 0, limit: 10_000 });
        setMaxCount(0);
        setSearchText({});
        setFileList(null);
        setFilesChanged(false);
        setSource("");

        onClose();
    };

    const handleOk = async () => {
        const values = await form.validateFields();
        const link = filesChanged ? await handleFileUpload(values.dragger) : degree.document_link;
        const newObject = {
            id: degree.id,
            profile_id: degree.profile_id,
            degree_id: values.degree,
            degree: degree.degree,
            science_id: values.science,
            science: degree.science,
            specialty_id: values.specialization,
            specialty: degree.specialty,
            document_number: values.number_doc,
            document_link: link,
            assignment_date: values.date.toDate(),
            source: degree.source ? degree.source : "edited",
        };

        changeDispatchValues(newObject);
    };
    const changeDispatchValues = (obj) => {
        if (source === "get") {
            dispatch(
                deleteByPathEducation({
                    path: "educationData.data.academic_degree",
                    id: degree.id,
                }),
            );
            dispatch(
                setFieldValue({
                    fieldPath: "edited.education.add_academic_degree",
                    value: [...add_academic_degree, obj],
                }),
            );
        }
        if (source === "edited") {
            dispatch(
                replaceByPath({
                    path: "edited.education.add_academic_degree",
                    id: degree.id,
                    newObj: obj,
                }),
            );
        }
        if (source === "added") {
            dispatch(
                replaceByPath({
                    path: "allTabs.education.add_academic_degree",
                    id: degree.id,
                    newObj: obj,
                }),
            );
        }

        handleClose();
    };

    const handleDelete = () => {
        changeDispatchValues({ id: degree.id, delete: true });
    };

    useEffect(() => {
        form.resetFields();

        const values = {
            date: moment(degree.assignment_date),
            degree: degree.degree_id,
            number_doc: degree.document_number,
            science: degree.science_id,
            specialization: degree.specialty_id,
        };

        findSelectOption(degree.degree_id, "degree", setDegreeOptions,degreeOptions);
        findSelectOption(degree.science_id, "science", setScienceOptions,scienceOptions);
        findSelectOption(degree.specialty_id, "specialization", setSpecialtyOptions, specialtyOptions);
        setSource(degree.source ? degree.source : "get");

        form.setFieldsValue(values);
        const getFile = async () => {
            const file = await FileUploaderService.getFileByLink(degree.document_link);
            form.setFieldsValue({
                dragger: [file],
            });
        };
        void getFile();
    }, [form, degree, isOpen]);

    const findSelectOption = async (id, type, setOptions,options) => {
        let response;

        if (type === "degree" && id) {
            response = await EducationService.get_academic_degree_types_id(id);
        }
        if (type === "science" && id) {
            response = await EducationService.get_sciences_id(id);
        }
        if (type === "specialization" && id) {
            response = await EducationService.get_specialties_id(id);
        }

        if (options.find((item) => item.id===response.id)===undefined) {
            setOptions((prevData) => [
                ...new Set(prevData),
                { value: response.id, label: LocalText.getName(response),object: response },
            ]);
        }
    };

    return (
        <Modal
            title={<IntlMessage id={"service.data.modalAcademicDegree.addLevelDegree"} />}
            onClick={(e) => e.stopPropagation()}
            open={isOpen}
            onCancel={handleClose}
            okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
            cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
            style={{ height: "500px", width: "400px" }}
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
                <Form.Item
                    label={<IntlMessage id={"service.data.modalAcademicDegree.degree"} />}
                    name="degree"
                    rules={[
                        {
                            required: true,
                            message: (
                                <IntlMessage id={"service.data.modalAcademicDegree.chooseDegree"} />
                            ),
                        },
                    ]}
                    required
                >
                    <Select
                        options={degreeOptions}
                        showSearch
                        onSearch={(e) => handleSearch(e, "degree")}
                        onPopupScroll={(e) => handlePopupScroll(e, "degree")}
                    />
                </Form.Item>

                <Form.Item
                    label={<IntlMessage id={"service.data.modalAcademicDegree.science"} />}
                    name="science"
                    rules={[
                        {
                            required: true,
                            message: (
                                <IntlMessage
                                    id={"service.data.modalAcademicDegree.chooseScience"}
                                />
                            ),
                        },
                    ]}
                    required
                >
                    <Select
                        options={scienceOptions}
                        showSearch
                        onSearch={(e) => handleSearch(e, "science")}
                        onPopupScroll={(e) => handlePopupScroll(e, "science")}
                    />
                </Form.Item>

                <Form.Item
                    label={<IntlMessage id={"service.data.modalAcademicDegree.specialization"} />}
                    name="specialization"
                    rules={[
                        {
                            required: true,
                            message: (
                                <IntlMessage
                                    id={"service.data.modalAcademicDegree.chooseSpecialization"}
                                />
                            ),
                        },
                    ]}
                    required
                >
                    <Select
                        options={specialtyOptions}
                        showSearch
                        onSearch={(e) => handleSearch(e, "specialization")}
                        onPopupScroll={(e) => handlePopupScroll(e, "specialization")}
                    />
                </Form.Item>

                <Form.Item
                    label={<IntlMessage id={"service.data.modalAcademicDegree.dateAwarded"} />}
                    name="date"
                    rules={[
                        {
                            required: true,
                            message: (
                                <IntlMessage
                                    id={"service.data.modalAcademicDegree.chooseDateAwarded"}
                                />
                            ),
                        },
                    ]}
                    required
                >
                    <DatePicker
                        placeholder={IntlMessageText.getText({
                            id: "service.data.modalAcademicDegree.dateGive",
                        })}
                        style={{ width: "250px" }}
                        format="DD-MM-YYYY"
                        name="date"
                    />
                </Form.Item>

                <Form.Item
                    label={<IntlMessage id={"service.data.modalAddPsycho.docNum"} />}
                    name="number_doc"
                    rules={[
                        {
                            required: true,
                            message: <IntlMessage id={"service.data.modalAddPsycho.chooseDoc"} />,
                        },
                    ]}
                    required
                >
                    <Input
                        placeholder={IntlMessageText.getText({
                            id: "service.data.modalAcademicDegree.docNumAccept",
                        })}
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
                >
                    <Upload.Dragger fileList={fileList} {...props} maxCount={1}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                            <IntlMessage id="dragger.text" />
                        </p>
                    </Upload.Dragger>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalAcademicDegreeEdit;
