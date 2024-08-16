import { InboxOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, message, Modal, Row, Select, Upload } from "antd";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { fileExtensions } from "constants/FileExtensionConstants";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileUploaderService from "services/myInfo/FileUploaderService";
import { deleteByPathEducation } from "store/slices/myInfo/educationSlice";
import { replaceByPath, setFieldValue } from "store/slices/myInfo/myInfoSlice";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";
import EducationService from "services/myInfo/EducationService";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const ModalAcademicTitleEdit = ({ isOpen, onClose, title }) => {
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10_000 });
    const [searchText, setSearchText] = useState({});
    const [maxCount, setMaxCount] = useState(0);

    const [source, setSource] = useState("");
    const [titleDegreeOptions, setTitleDegreeOptions] = useState([]);
    const [specialtyOptions, setSpecialtyOptions] = useState([]);
    const [fileList, setFileList] = useState(null);
    const [filesChanged, setFilesChanged] = useState(false);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const edited_academic_titles = useSelector(
        (state) => state.myInfo.edited.education.add_academic_title,
    );

    useEffect(() => {
        fetchOptions();
    }, [scrollingLength, searchText, isOpen]);

    const fetchOptionsData = async (baseUrl, type) => {
        const response = await SelectPickerMenuService.getEducation({
            ...scrollingLength,
            search: searchText[type],
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
            "/education/academic_title_degrees",
            "degree_title",
        );
        const specialtyOptions = await fetchOptionsData("/education/specialties", "specialization");

        setTitleDegreeOptions(degreeOptions);
        setSpecialtyOptions(specialtyOptions);
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

    const handleOk = async () => {
        const values = await form.validateFields();
        const link = filesChanged ? await handleFileUpload(values.dragger) : title.document_link;
        const newObject = {
            id: title.id,
            degree_id: values.degree,
            specialty_id: values.specialization,
            assignment_date: values.date.toDate(),
            document_number: values.number_doc,
            document_link: link,
            profile_id: title.profile_id,
            source: title.source ? title.source : "edited",
        };

        changeDispatchValues(newObject);
    };

    const changeDispatchValues = (obj) => {
        if (source === "get") {
            // Delete from GET slice
            dispatch(
                deleteByPathEducation({
                    path: "educationData.data.academic_title",
                    id: title.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                setFieldValue({
                    fieldPath: "edited.education.add_academic_title",
                    value: [...edited_academic_titles, obj],
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: "edited.education.add_academic_title",
                    id: title.id,
                    newObj: obj,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.education.add_academic_title",
                    id: title.id,
                    newObj: obj,
                }),
            );
        }

        handleClose();
    };

    const onDelete = () => {
        changeDispatchValues({ id: title.id, delete: true });
    };

    const handleClose = () => {
        form.resetFields();

        setScrollingLength({ skip: 0, limit: 10_000 });
        setSearchText({});
        setMaxCount(0);
        setSource("");
        setFileList(null);
        setFilesChanged(false);

        onClose();
    };

    useEffect(() => {
        form.resetFields();
        const values = {
            date: moment(title.assignment_date),
            degree: title.degree_id,
            specialization: title.specialty_id,
            number_doc: title.document_number,
        };

        findSelectOption(title.degree_id, "degree", setTitleDegreeOptions);
        findSelectOption(title.specialty_id, "specialization", setSpecialtyOptions);
        setSource(title.source ? title.source : "get");

        form.setFieldsValue(values);
        const getFile = async () => {
            const file = await FileUploaderService.getFileByLink(title.document_link);
            form.setFieldsValue({
                dragger: [file],
            });
        };
        void getFile();
    }, [form, title, isOpen]);

    const findSelectOption = async (id, type, setOptions) => {
        let response;

        if (type === "degree" && id) {
            response = await EducationService.get_academic_title_degree_id(id);
        }
        if (type === "specialization" && id) {
            response = await EducationService.get_specialties_id(id);
        }

        if (response) {
            setOptions((prevData) => [
                ...new Set(prevData),
                { value: response.id, label: LocalText.getName(response) },
            ]);
        }
    };

    return (
        <Modal
            // title={'Редактирование учёного звания'}
            title={<IntlMessage id={"service.data.modalAcademicTitle.AddRank"} />}
            onClick={(e) => e.stopPropagation()}
            open={isOpen}
            onCancel={handleClose}
            footer={
                <Row justify="end">
                    <Button danger onClick={onDelete}>
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
                        options={titleDegreeOptions}
                        showSearch
                        onSearch={(e) => handleSearch(e, "institution")}
                        onPopupScroll={(e) => handlePopupScroll(e, "institution")}
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
                        onSearch={(e) => handleSearch(e, "institution")}
                        onPopupScroll={(e) => handlePopupScroll(e, "institution")}
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

                <Form.Item
                    label={<IntlMessage id={"service.data.modalAcademicDegree.docAccept"} />}
                >
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
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalAcademicTitleEdit;
