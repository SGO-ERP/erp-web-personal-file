import React, { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { useAppSelector } from "hooks/useStore";
import { useDispatch, useSelector } from "react-redux";
import { PrivateServices } from "API";
import FileUploaderService from "services/myInfo/FileUploaderService";
import {
    Button,
    DatePicker,
    Form,
    Input,
    message,
    Modal,
    notification,
    Row,
    Select,
    Upload,
} from "antd";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { addFieldValue, replaceByPath, setFieldValue } from "store/slices/myInfo/myInfoSlice";
import { fileExtensions } from "constants/FileExtensionConstants";
import LanguageSwitcher from "components/shared-components/LanguageSwitcher";
import LocalizationText, {
    LocalText,
} from "components/util-components/LocalizationText/LocalizationText";
import { disabledDate } from "utils/helpers/futureDateHelper";
import { InboxOutlined } from "@ant-design/icons";
import { deleteByPath } from "store/slices/myInfo/additionalSlice";
import moment from "moment/moment";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";
import AdditionalService from "../../../../../../../services/myInfo/AdditionalService";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";
import { PERMISSION } from "constants/permission";

const ModalEditServiceHousing = ({ isOpen, onClose, source = "get", realty }) => {
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10 });
    const [searchText, setSearchText] = useState({});
    const [maxCount, setMaxCount] = useState(0);
    const [propertyTypes, setPropertyTypes] = useState([]);

    const [form] = useForm();
    const [types, setTypes] = useState([]);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    const [fileList, setFileList] = useState();
    const dispatch = useDispatch();
    const [filesChanged, setFilesChanged] = useState(false);

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

    const onCancel = () => {
        form.resetFields();
        setFilesChanged(false);
        onClose();
    };

    const findSelectOption = async (id) => {
        let response = (await AdditionalService.get_property_type_id(id));


        setPropertyTypes((prevData) => [
            ...new Set(prevData),
            { value: response.id, label: LocalText.getName(response), object:response},
        ]);
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
            formData.append('file', file.originFileObj);
        });

        try {
            const response = await FileUploaderService.upload(formData);
            setFileList(response.link);
            // Return the response link so it can be used in the onOk function
            return response.link;
        } catch (error) {
            void message.error(<IntlMessage id="medical.file.upload.error" />);
        }
    };
    const onOk = async () => {
        if (!form.isFieldsTouched()) {
            notification.error({
                message: <IntlMessage id={"schedule.form.qual.req"} />,
            });
            return;
        }
        const values = form.getFieldsValue();
        const response =  filesChanged
            ? await handleFileUpload(values.dragger)
            : realty?.document_link;

        const type = (await AdditionalService.get_property_type_id(values.type_id));

        const newObject = {
            id: realty.id,
            type_id: values.type_id,
            address: values.address,
            document_link: response,
            issue_date: values.purchase_date.toDate(),
            type:type,
        };

        if (source === "get") {
            // Delete from GET slice

            dispatch(
                deleteByPath({
                    path: "additional.data.service_housing", //+
                    id: realty.id, // +
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: "edited.additional.service_housing",
                    value: newObject,
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: "edited.additional.service_housing", //+
                    id: realty.id, //+
                    newObj: newObject,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.additional.service_housing",
                    id: realty.id,
                    newObj: newObject,
                }),
            );
        }
        form.resetFields();
        onClose();
    };

    useEffect(() => {
        form.resetFields();
        findSelectOption(realty.type_id);
        const values = {
            address: realty.address,
            type_id: realty.type_id,
            purchase_date: moment(realty?.issue_date),
        };
        form.setFieldsValue(values);
        if (realty.document_link) {
            const getFile = async () => {
                const file = await FileUploaderService.getFileByLink(realty.document_link);
                form.setFieldsValue({
                    dragger: [file],
                });
            };
            getFile();
        }
    }, [isOpen]);

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const validateFileList = (rule, value) => {
        return new Promise((resolve, reject) => {
            if (!value || value.length === 0) {
                reject(<IntlMessage id={"service.data.modalAddPsycho.pleaseLoadFile"} />);
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
        onRemove: handleFileRemove,
        name: 'file',
        multiple: true,
        accept: fileExtensions, // разрешенные расширения
        onChange(info) {
            setFilesChanged(true);
            const { status } = info.file;
            if (status === 'done') {
                void message.success(
                    `${info.file.name} ${(<IntlMessage id="medical.file.upload.success" />)}`,
                );
            } else if (status === 'error') {
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

    const closeAndClear = () => {
        form.resetFields();
        onClose();
    };

    const changeDispatchValues = (obj) => {
        if (source === "get") {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: "additional.data.service_housing",
                    id: realty.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: "edited.additional.service_housing",
                    value: obj,
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: "edited.additional.service_housing",
                    id: realty.id,
                    newObj: obj,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.additional.service_housing",
                    id: realty.id,
                    newObj: obj,
                }),
            );
        }
    };

    const onDelete = () => {
        changeDispatchValues({ id: realty.id, delete: true });
        closeAndClear();
    };

    return (
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
            <Form form={form} layout={"vertical"}>
                <Form.Item
                    label={<IntlMessage id={"personal.additional.serviceReality.objectType"} />}
                    name={"type_id"}
                    rules={[
                        {
                            required: true,
                            message: <IntlMessage id={"service.data.modalProperty.addressError"} />,
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
    );
};

export default ModalEditServiceHousing;
