import { InboxOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, message, Modal, Row, Select, Upload } from "antd";
import { fileExtensions } from "constants/FileExtensionConstants";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FileUploaderService from "services/myInfo/FileUploaderService";
import { addFieldValue, replaceByPath } from "store/slices/myInfo/myInfoSlice";
import { deleteByPath, getUsers } from "store/slices/myInfo/servicesSlice";
import { disabledDate } from "utils/helpers/futureDateHelper";
import LanguageSwitcher from "components/shared-components/LanguageSwitcher";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";
import SportTypeService from "../../../../../../../services/myInfo/SportTypeService";
import { LocalText } from "../../../../../../../components/util-components/LocalizationText/LocalizationText";
import UserService from "../../../../../../../services/UserService";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const ModalCharacteristicEdit = ({ isOpen, onClose, characteristics, source = "get" }) => {
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10 });
    const [searchText, setSearchText] = useState({});
    const [maxCount, setMaxCount] = useState(0);
    const [characteristicOptions, setCharacteristicOptions] = useState([]);

    const [fileList, setFileList] = useState();
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const characteristics_all = useSelector((state) => state.services.characteristic);
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

        return response.users.map((user) => ({
            value: user.id,
            label: `${user.first_name} ${user.last_name}${
                user.father_name ? " " + user.father_name : ""
            }`,
            name: `${user.last_name} ${user.first_name[0]}.${
                user.father_name ? user.father_name[0] + "." : ""
            }`,
            object: user,
        }));
    };

    const fetchOptions = async () => {
        const usersOptions = await fetchOptionsData(
            "/users/get_all_heads_except_pgs",
            "characteristic_initiator",
        );

        setCharacteristicOptions(usersOptions);
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

    const handleFileRemove = () => {
        form.setFieldsValue({ dragger: [] });
        setFileList([]);
        setFilesChanged(true);
    };

    const findSelectOption = async (id) => {
        let response = await UserService.user_get_by_id(id);

        let fullName;

        if (response?.father_name) {
            fullName = response.last_name + " " + response.first_name + " " + response.father_name;
        } else {
            fullName = response.last_name + " " + response.first_name;
        }
        setCharacteristicOptions((prevData) => [
            ...new Set(prevData),
            { value: response.id, label: fullName, object: response },
        ]);
    };

    useEffect(() => {
        if (characteristics_all?.length === 0) {
            dispatch(getUsers());
        }
    }, [dispatch, characteristics_all]);

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
            // Return the response link so it can be used in the onOk function
            return response.link;
        } catch (error) {
            void message.error(<IntlMessage id={"service.data.modalAddPsycho.cannotLoadFile"} />);
        }
    };

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    }

    const validateFileList = (rule, value) => {
        setFilesChanged(true);
        return new Promise((resolve, reject) => {
            resolve();
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

    const { id: userId } = useParams();

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const response = filesChanged
                ? await handleFileUpload(values.dragger)
                : characteristics.document_link;
            let name = await UserService.user_get_by_id(values.characteristic_initiator);

            const formattedName = `${name.last_name} ${name.first_name[0]}.${
                name.father_name ? name.father_name[0] + "." : ""
            }`;
            const newObject = {
                type: "service_characteristic_history",
                user_id: userId,
                date_from: values.date_from.toDate(),
                document_link: response,
                characteristic_initiator_id: values.characteristic_initiator,
                characteristic_initiator: formattedName,
                id: characteristics.id,
            };
            changeDispatchValues(newObject);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        form.resetFields();
        findSelectOption(characteristics.characteristic_initiator_id);
        const values = {
            characteristic_initiator: characteristics.characteristic_initiator_id,
            date_from: moment(characteristics.date_from),
        };
        form.setFieldsValue(values);
        const getFile = async () => {
            const file = await FileUploaderService.getFileByLink(characteristics.document_link);
            form.setFieldsValue({
                dragger: [file],
            });
        };
        getFile();
    }, [characteristics, form, isOpen]);

    const handleDelete = () => {
        changeDispatchValues({ id: characteristics.id, delete: true });
    };

    const changeDispatchValues = (obj) => {
        if (source === "get") {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: "serviceData.characteristics",
                    id: obj.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: "edited.services.characteristics",
                    value: obj,
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: "edited.services.characteristics",
                    id: obj.id,
                    newObj: obj,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.services.characteristics",
                    id: obj.id,
                    newObj: obj,
                }),
            );
        }

        handleClose();
    };

    const handleClose = () => {
        form.resetFields();
        setFilesChanged(false);
        onClose();
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                // title={'Добавить служебную характеристику'}
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
                            <IntlMessage id="characterictic.add" />
                        </span>
                        <LanguageSwitcher size="small" fontSize="12px" height="1.4rem" />
                    </div>
                }
                open={isOpen}
                onCancel={handleClose}
                onOk={onOk}
                footer={
                    <Row justify="end">
                        <Button danger onClick={handleDelete}>
                            <IntlMessage id={"initiate.deleteAll"} />
                        </Button>
                        <Button onClick={handleClose}>
                            <IntlMessage id={"service.data.modalAddPsycho.cancel"} />
                        </Button>
                        <Button type="primary" onClick={onOk}>
                            <IntlMessage id={"service.data.modalAddPsycho.save"} />
                        </Button>
                    </Row>
                }
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col xs={24}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: "14px" }}>
                                        <IntlMessage id="characterictic.author" />
                                    </span>
                                }
                                name="characteristic_initiator"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="characterictic.author.enter" />,
                                    },
                                ]}
                                required
                            >
                                <Select
                                    options={characteristicOptions}
                                    onSearch={(e) => handleSearch(e, "characteristic_initiator")}
                                    onPopupScroll={(e) =>
                                        handlePopupScroll(e, "characteristic_initiator")
                                    }
                                    showSearch
                                    filterOption={(inputValue, option) =>
                                        option.label
                                            .toLowerCase()
                                            .indexOf(inputValue.toLowerCase()) >= 0
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: "14px" }}>
                                        <IntlMessage id="characterictic.date.write" />
                                    </span>
                                }
                                name="date_from"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="characterictic.date.buy.enter" />,
                                    },
                                ]}
                                required
                            >
                                <DatePicker
                                    placeholder={IntlMessageText.getText({
                                        id: "characterictic.date.buy",
                                    })}
                                    format="DD-MM-YYYY"
                                    name="date"
                                    style={{ width: "100%" }}
                                    disabledDate={disabledDate}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label={
                            <span style={{ fontSize: "14px" }}>
                                <IntlMessage id="characterictic.loading" />
                            </span>
                        }
                        required
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
                                    <IntlMessage id="service.data.modalAddPsycho.clickFileToLoad" />
                                </p>
                            </Upload.Dragger>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default ModalCharacteristicEdit;
