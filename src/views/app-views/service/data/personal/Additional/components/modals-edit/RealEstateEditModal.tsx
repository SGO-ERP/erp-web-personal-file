import React, { useEffect, useState } from "react";

import { Button, DatePicker, Form, Input, Modal, Row, Select, Upload, message } from "antd";

import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";

import { components } from "API/types";
import LanguageSwitcher from "components/shared-components/LanguageSwitcher";
import FileUploaderService, { headers } from "services/myInfo/FileUploaderService";
import moment from "moment";
import { fileExtensions } from "constants/FileExtensionConstants";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { PrivateServices } from "API";
import { InboxOutlined } from "@ant-design/icons";
import { deleteByPath } from "store/slices/myInfo/additionalSlice";
import { addFieldValue, replaceByPath, setFieldValue } from "store/slices/myInfo/myInfoSlice";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import UserService from "../../../../../../../../services/UserService";
import AdditionalService from "../../../../../../../../services/myInfo/AdditionalService";
import { S3_BASE_URL } from "configs/AppConfig";
import { PERMISSION } from "constants/permission";

type RealEstate = components["schemas"]["PropertiesRead"];

type RealEstateEditModalProps = {
    isOpen: boolean;
    realEstate: RealEstate;
    onClose: () => void;
    source?: "get" | "edited" | "added";
};

export const RealEstateEditModal = (prop: RealEstateEditModalProps) => {
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10 });
    const [searchText, setSearchText] = useState({});
    const [maxCount, setMaxCount] = useState(0);

    const [fileList, setFileList] = useState();
    const { isOpen, realEstate, onClose, source = "get" } = prop;
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    const [propertyTypes, setPropertyTypes] = useState<{ label: string; value: string, object: components['schemas']['PropertyTypeRead'] }[]>([]);

    const [purchaseType, setPurchaseType] = useState({ name: "", nameKZ: "" });
    const [currentLanguage, setCurrentLanguage] = useState("rus");
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();

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

    const loadMoreOptions = (type) => {
        const newLimit = scrollingLength.limit + 10;
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

    const handleInputPurchaseType = (event) => {
        setPurchaseType({
            ...purchaseType,
            [currentLanguage === "rus" ? "name" : "nameKZ"]: event.target.value,
        });
    };

    const validateLocalizationPurchaseType = () => {
        const isRusEmpty = purchaseType.name === null || purchaseType.name.trim() === "";
        const isKZEmpty = purchaseType.nameKZ === null || purchaseType.nameKZ.trim() === "";

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

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await handleFileUpload(values.dragger);
            const type = propertyTypes.find((item) => item.value === values.type_id);

            const newObject = {
                type_id: values.type_id,
                address: values.address,
                purchase_type: purchaseType.name,
                purchase_typeKZ: purchaseType.nameKZ,
                purchase_date: moment(values.purchase_date),
                document_link: response ?? null,
                type: type?.object,
                id: realEstate.id,
            };

            if (source === "get") {
                // Delete from GET slice
                dispatch(
                    deleteByPath({
                        path: "additional.data.properties", //+
                        id: realEstate.id, // +
                    }),
                );
                // Add to Edited slice
                dispatch(
                    addFieldValue({
                        fieldPath: "edited.additional.properties", //+
                        value: newObject,
                    }),
                );
            }
            if (source === "edited") {
                // Edit current item in Edited slice (item already exists)
                dispatch(
                    replaceByPath({
                        path: "edited.additional.properties",
                        id: realEstate.id,

                        newObj: newObject,
                    }),
                );
            }
            if (source === "added") {
                // Edit item in myInfo.allTabs
                dispatch(
                    replaceByPath({
                        path: "allTabs.additional.properties",
                        id: realEstate.id, // +

                        newObj: newObject,
                    }),
                );
            }
            form.resetFields();
            onClose();
        } catch (error) {
            console.log(error);
        }
    };
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    const disabledDate = (current: any) => {
        // Disable dates before today
        return current && current > moment().startOf("day");
    };
    const handleFileUpload = async (fileList: any) => {
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
    const validateFileList = (rule: any, value: string | any[]) => {
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
    const onCancel = () => {
        form.resetFields();
        setPurchaseType({ name: "", nameKZ: "" });
        onClose();
    };

    const findSelectOption = async (id:string) => {
        let response = (await AdditionalService.get_property_type_id(id));


            setPropertyTypes((prevData) => [
                ...new Set(prevData),
                { value: response.id, label: LocalText.getName(response), object:response},
            ]);
    };



    useEffect(() => {
        form.resetFields();
        findSelectOption(realEstate.type_id);
        const values = {
            type_id: realEstate.type_id,
            address: realEstate.address,
            purchase_date: moment(realEstate.purchase_date),
            type: realEstate.type,
            id: realEstate.id,
        };
        form.setFieldsValue(values);
        setPurchaseType({ name: realEstate.purchase_type, nameKZ: realEstate.purchase_typeKZ });

        if (realEstate?.document_link) {
            const getFile = async () => {
                const file = await FileUploaderService.getFileByLink(realEstate?.document_link);
                form.setFieldsValue({
                    dragger: [file],
                });
            };
            getFile();
        }
    }, [realEstate, form, isOpen]);

    const closeAndClear = () => {
        form.resetFields();
        setPurchaseType({ name: "", nameKZ: "" });
        onClose();
    };

    const changeDispatchValues = (obj: any) => {
        if (source === "get") {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: "additional.data.properties",
                    id: realEstate.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: "edited.additional.properties",
                    value: obj,
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: "edited.additional.properties",
                    id: realEstate.id,
                    newObj: obj,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.additional.properties",
                    id: realEstate.id,
                    newObj: obj,
                }),
            );
        }
    };

    const onDelete = () => {
        changeDispatchValues({ id: realEstate.id, delete: true });
        closeAndClear();
    };
    return (
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
            footer={
                <Row justify="end">
                    <Button danger onClick={onDelete}>
                        <IntlMessage id={"initiate.deleteAll"} />
                    </Button>
                    <Button onClick={closeAndClear}>
                        <IntlMessage id={"candidates.warning.cancel"} />
                    </Button>
                    <Button type="primary" onClick={onOk}>
                        <IntlMessage id={"initiate.save"} />
                    </Button>
                </Row>
            }
            style={{ height: "500px", width: "400px" }}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label={<IntlMessage id={"service.data.modalProperty.typeObject"} />}
                    name="type_id"
                    rules={[
                        {
                            required: true,
                            message: (
                                <IntlMessage id={"service.data.modalProperty.typeObjectError"} />
                            ),
                        },
                    ]}
                    required
                >
                    <Select
                        options={propertyTypes}
                        showSearch
                        onSearch={(e) => handleSearch(e, "type_id")}
                        onPopupScroll={(e) => handlePopupScroll(e, "type_id")}
                    />
                </Form.Item>
                <Form.Item
                    label={<IntlMessage id={"service.data.modalRealty.address"} />}
                    name="address"
                    rules={[
                        {
                            required: true,
                            message: <IntlMessage id={"service.data.modalProperty.addressError"} />,
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
                        value={currentLanguage === "rus" ? purchaseType.name : purchaseType.nameKZ}
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
                        placeholder={IntlMessageText.getText({
                            id: "oath.date.placeholder",
                        })}
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
    );
};
