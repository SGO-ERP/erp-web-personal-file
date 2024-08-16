import { InboxOutlined } from "@ant-design/icons";
import { Row, Col, DatePicker, Form, Input, message, Modal, Upload } from "antd";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { fileExtensions } from "constants/FileExtensionConstants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileUploaderService from "services/myInfo/FileUploaderService";
import { setFieldValue } from "store/slices/myInfo/myInfoSlice";
import uuidv4 from "utils/helpers/uuid";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import { useAppSelector } from "hooks/useStore";
import SelectPickerMenu from "./SelectPickerMenu";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";
import { PERMISSION } from "constants/permission";

const ModalAcademicDegree = ({ isOpen, onClose }) => {
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10_000 });
    const [maxCount, setMaxCount] = useState(0);
    const [searchText, setSearchText] = useState({});

    const [optionValue, setOptionValue] = useState({});
    const [degreeOptions, setDegreeOptions] = useState([]);
    const [scienceOptions, setScienceOptions] = useState([]);
    const [specialtyOptions, setSpecialtyOptions] = useState([]);
    const [fileList, setFileList] = useState(null);
    const [form] = Form.useForm();

    const dispatch = useDispatch();

    const { add_academic_degree } = useSelector((state) => state.myInfo.allTabs.education);

    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);

    useEffect(() => {
        fetchOptions();
    }, [scrollingLength, searchText]);

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
            "/education/academic_degree_degrees",
            "degree_academic",
        );
        const scienceOptions = await fetchOptionsData("/education/sciences", "science");
        const specialtyOptions = await fetchOptionsData("/education/specialties", "specialization");

        setDegreeOptions(degreeOptions);
        setScienceOptions(scienceOptions);
        setSpecialtyOptions(specialtyOptions);
    };

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
        name: "file",
        multiple: true,
        accept: fileExtensions, // разрешенные расширения
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

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await handleFileUpload(values.dragger);

            const degree_name = degreeOptions.filter((d => d.value === optionValue.degree_academic))[0].label
            const science_name = scienceOptions.filter((s => s.value === optionValue.science))[0].label
            const specialty_name = specialtyOptions.filter((s => s.value === optionValue.specialization))[0].label

            const newAcademicDegree = {
                degree_name,
                degree_id: optionValue.degree_academic,
                science_name,
                science_id: optionValue.science,
                specialty_name,
                specialty_id: optionValue.specialization,
                date: values.date.toDate(),
                document_number: values.document_number,
                document_link: response ?? null,
                id: uuidv4(),
                source: "added",
            };

            dispatch(
                setFieldValue({
                    fieldPath: "allTabs.education.add_academic_degree",
                    value: [...add_academic_degree, newAcademicDegree],
                }),
            );

            onCancel();
        } catch (error) {
            console.log(error);
        }
    };

    const onCancel = () => {
        form.resetFields();

        setScrollingLength({ skip: 0, limit: 10_000 });
        setMaxCount(0);
        setSearchText({});
        setOptionValue({});
        setFileList(null);

        onClose();
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                // title={'Добавление учёной степени'}
                title={<IntlMessage id={"service.data.modalAcademicDegree.addLevelDegree"} />}
                open={isOpen && isHR}
                onCancel={onCancel}
                onOk={onOk}
                okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
                cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label={<IntlMessage id={"service.data.modalAcademicDegree.degree"} />}
                        name="degree_academic"
                        rules={[
                            {
                                validator: validateValues,
                            },
                        ]}
                        required
                    >
                        <SelectPickerMenu
                            options={degreeOptions}
                            type="degree_academic"
                            setScrollingLength={setScrollingLength}
                            scrollingLength={scrollingLength}
                            maxCount={maxCount}
                            setSearchText={setSearchText}
                            currentOptions={setDegreeOptions}
                            searchText={searchText}
                            placeholder={"service.data.modalAcademicDegree.degree"}
                            values={optionValue}
                            setValue={setOptionValue}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<IntlMessage id={"service.data.modalAcademicDegree.science"} />}
                        name="science"
                        rules={[
                            {
                                validator: validateValues,
                            },
                        ]}
                        required
                    >
                        <SelectPickerMenu
                            options={scienceOptions}
                            type="science"
                            setScrollingLength={setScrollingLength}
                            scrollingLength={scrollingLength}
                            maxCount={maxCount}
                            setSearchText={setSearchText}
                            currentOptions={setScienceOptions}
                            searchText={searchText}
                            placeholder={"service.data.modalAcademicDegree.science"}
                            values={optionValue}
                            setValue={setOptionValue}
                        />
                    </Form.Item>

                    <Form.Item
                        label={
                            <IntlMessage id={"service.data.modalAcademicDegree.specialization"} />
                        }
                        name="specialization"
                        rules={[
                            {
                                validator: validateValues,
                            },
                        ]}
                        required
                    >
                        <SelectPickerMenu
                            options={specialtyOptions}
                            type="specialization"
                            values={optionValue}
                            setValue={setOptionValue}
                            setScrollingLength={setScrollingLength}
                            scrollingLength={scrollingLength}
                            maxCount={maxCount}
                            setSearchText={setSearchText}
                            currentOptions={setSpecialtyOptions}
                            searchText={searchText}
                            placeholder={"service.data.modalAcademicDegree.specialization"}
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
                                name="date"
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
                                    name="date"
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
        </div>
    );
};

export default ModalAcademicDegree;
