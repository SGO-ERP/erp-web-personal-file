import React, { useEffect, useState } from "react";
import { DatePicker, Form, Input, message, Modal, Upload } from "antd";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { useAppSelector } from "hooks/useStore";
import { useForm } from "antd/es/form/Form";
import { InboxOutlined } from "@ant-design/icons";
import { fileExtensions } from "constants/FileExtensionConstants";
import { disabledDate } from "utils/helpers/futureDateHelper";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import FileUploaderService from "services/myInfo/FileUploaderService";
import { setFieldValue } from "store/slices/myInfo/myInfoSlice";
import { useDispatch, useSelector } from "react-redux";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";
import SelectPickerMenu from "../../Education/modals/SelectPickerMenu";
import AdditionalService from "../../../../../../../services/myInfo/AdditionalService";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";
import { PERMISSION } from "constants/permission";

const ModalAddServiceHousing = ({ isOpen, onClose }) => {
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10 });
    const [searchText, setSearchText] = useState({});
    const [maxCount, setMaxCount] = useState(0);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [optionValue, setOptionValue] = useState({});

    const [form] = useForm();
    const [types, setTypes] = useState([]);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    const [fileList, setFileList] = useState();
    const dispatch = useDispatch();
    const service_housing = useSelector((state) => state.myInfo.allTabs.additional.service_housing);

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
        const propertyOptions = await fetchOptionsData("/additional/property_types", "type_id");

        setPropertyTypes(propertyOptions);
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

    const onCancel = () => {
        form.resetFields();
        onClose();
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
            // Return the response link so it can be used in the onOk function
            return response.link;
        } catch (error) {
            void message.error(<IntlMessage id={"service.data.modalAddPsycho.cannotLoadFile"} />);
        }
    };

    const onOk = async () => {
        try {
            const values = form.getFieldsValue();
            const response = await handleFileUpload(values.dragger);
            let type = (await AdditionalService.get_property_type_id(optionValue.type_id));

            const newObject = {
                type_id: optionValue.type_id,
                address: values.address,
                document_link: response,
                issue_date: values.purchase_date.toDate(),
                type: type,
            };

            dispatch(
                setFieldValue({
                    fieldPath: "allTabs.additional.service_housing",
                    value: [...service_housing, newObject],
                }),
            );

            form.resetFields();
            onClose();
        } catch (error) {
            console.log(error);
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
            if (!value || value.length === 0) {
                resolve();
                // reject(<IntlMessage id={'service.data.modalAddPsycho.pleaseLoadFile'} />);
            } else if (value.length > 1) {
                reject(
                    <IntlMessage id={"service.data.modalEditPolygraphCheck.pleaseLoadOneFile"} />,
                );
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
        rules: [{ validator: validateFileList }],
    };

    return (
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
                            <IntlMessage id={"personal.data.additional.service.housing"} />
                        </span>
                        {/*<LanguageSwitcher size="small" fontSize="12px" height="1.4rem" />*/}
                    </div>
                }
                open={isOpen && isHR}
                onCancel={onCancel}
                onOk={onOk}
                okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
                cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
                style={{ height: "500px", width: "400px" }}
            >
                <Form form={form} layout={"vertical"}>
                    <Form.Item
                        label={<IntlMessage id={"personal.additional.serviceReality.objectType"} />}
                        name={"type_id"}
                        rules={[
                            {
                                validator: validateValues,
                            },
                        ]}
                        required
                    >
                        <SelectPickerMenu
                            options={propertyTypes}
                            type="type_id"
                            setScrollingLength={setScrollingLength}
                            scrollingLength={scrollingLength}
                            maxCount={maxCount}
                            setSearchText={setSearchText}
                            currentOptions={setPropertyTypes}
                            searchText={searchText}
                            placeholder={"personal.additional.serviceReality.objectType"}
                            values={optionValue}
                            setValue={setOptionValue}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<IntlMessage id={"service.data.modalRealty.address"} />}
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: (
                                    <IntlMessage id={"service.data.modalProperty.addressError"} />
                                ),
                            },
                        ]}
                        required
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={<IntlMessage id={"personal.additional.offenceList.date"} />}
                        name="purchase_date"
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={"oath.date.placeholder"} />,
                            },
                        ]}
                        required
                    >
                        <DatePicker
                            style={{
                                width: "100%",
                            }}
                            placeholder={[
                                IntlMessageText.getText({
                                    id: "oath.date.placeholder",
                                }),
                            ]}
                            format="DD-MM-YYYY"
                            name="date"
                            disabledDate={disabledDate}
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
                            <Upload.Dragger fileList={fileList} {...props}>
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
        </div>
    );
};

export default ModalAddServiceHousing;
