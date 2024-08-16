import { InboxOutlined } from "@ant-design/icons";
import { DatePicker, Form, Input, message, Modal, Select, Upload } from "antd";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { fileExtensions } from "constants/FileExtensionConstants";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LanguageSwitcher from "../../../../../../../../components/shared-components/LanguageSwitcher";
import FileUploaderService, { headers } from "../../../../../../../../services/myInfo/FileUploaderService";
import uuidv4 from "../../../../../../../../utils/helpers/uuid";
import { setFieldValue } from "../../../../../../../../store/slices/myInfo/myInfoSlice";
import { useAppSelector } from "../../../../../../../../hooks/useStore";
import { PrivateServices } from "../../../../../../../../API";
import { disabledDate } from "utils/helpers/futureDateHelper";
import SelectPickerMenu from "../../../Education/modals/SelectPickerMenu";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";
import { S3_BASE_URL } from "configs/AppConfig";
import { PERMISSION } from "constants/permission";

export const RealEstateAddModal = ({ isOpen, onClose }: any) => {
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10 });
    const [maxCount, setMaxCount] = useState(0);
    const [searchText, setSearchText] = useState({});

    const [optionValue, setOptionValue] = useState({});
    const [fileList, setFileList] = useState();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const properties = useAppSelector((state) => state.myInfo.allTabs.additional.properties);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [purchaseType, setPurchaseType] = useState({ name: "", nameKZ: "" });
    const [currentLanguage, setCurrentLanguage] = useState("rus");

    useEffect(() => {
        fetchOptions();
    }, [scrollingLength, searchText, isOpen]);

    const fetchOptionsData = async (baseUrl: string, type: string) => {
        const response = await SelectPickerMenuService.getEducation({
            ...scrollingLength,
            search: searchText[type],
            baseUrl,
        });

        setMaxCount((prevData: any) => ({ ...prevData, [type]: response.total }));

        return response.objects.map((item: any) => ({
            value: item.id,
            label: LocalText.getName(item),
            object: item,
        }));
    };

    const fetchOptions = async () => {
        const propertyOptions = await fetchOptionsData("/additional/property_types", "type_id");

        setPropertyTypes(propertyOptions);
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
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
        return new Promise<void>((resolve, reject) => {
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

    const handleInputPurchaseType = (event) => {
        setPurchaseType({
            ...purchaseType,
            [currentLanguage === "rus" ? "name" : "nameKZ"]: event.target.value,
        });
    };
    const validateLocalizationPurchaseType = () => {
        const isRusEmpty = purchaseType.name.trim() === "";
        const isKZEmpty = purchaseType.nameKZ.trim() === "";

        return new Promise((resolve, reject) => {
            if (isRusEmpty && isKZEmpty) {
                reject(<IntlMessage id="field.required" />);
            } else if (isKZEmpty) {
                reject(<IntlMessage id="field.required.kazakh" />);
            } else if (isRusEmpty) {
                reject(<IntlMessage id="field.required.russian" />);
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

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await handleFileUpload(values.dragger);

            const newObject = {
                type_id: optionValue.type_id,
                address: values.address,
                purchase_type: purchaseType.name,
                purchase_typeKZ: purchaseType.nameKZ,
                purchase_date: values.purchase_date.toDate(),
                document_link: response ?? null,
                type: {
                    name: propertyTypes?.find((item) => item.value === optionValue.type_id)?.label,
                },
                id: uuidv4(),
            };

            dispatch(
                setFieldValue({
                    fieldPath: "allTabs.additional.properties",
                    value: [...properties, newObject],
                }),
            );
            form.resetFields();
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const onCancel = () => {
        form.resetFields();
        setPurchaseType({ name: "", nameKZ: "" });
        setCurrentLanguage("rus");
        onClose();
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                // title={'Добавить сведения о курсе'}
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
                            <IntlMessage id={"service.data.modalProperty.title"} />
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
                open={isOpen && isHR}
                onCancel={onCancel}
                onOk={onOk}
                okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
                cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
                style={{ height: "500px", width: "400px" }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label={<IntlMessage id={"service.data.modalProperty.typeObject"} />}
                        name="type_id"
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
                            placeholder={"service.data.modalProperty.typeObjectError"}
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
                        label={<IntlMessage id={"service.data.modalProperty.purchaseType"} />}
                        name="purchase_type"
                        rules={[
                            {
                                validator: validateLocalizationPurchaseType,
                            },
                        ]}
                        required
                    >
                        <Input
                            value={
                                currentLanguage === "rus" ? purchaseType.name : purchaseType.nameKZ
                            }
                            onChange={handleInputPurchaseType}
                        />
                        <p className="fam_invisible_text">
                            {currentLanguage === "rus" ? purchaseType.name : purchaseType.nameKZ}
                        </p>
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
                        // required
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
