import { InboxOutlined } from "@ant-design/icons";
import { Col, DatePicker, Form, message, Modal, Row, Select, Upload } from "antd";
import { fileExtensions } from "constants/FileExtensionConstants";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileUploaderService from "services/myInfo/FileUploaderService";
import { addFieldValue } from "store/slices/myInfo/myInfoSlice";
import { getUsers } from "store/slices/myInfo/servicesSlice";
import { disabledDate } from "utils/helpers/futureDateHelper";
import uuidv4 from "utils/helpers/uuid";
import IntlMessage from "components/util-components/IntlMessage";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";
import UserService from "../../../../../../../services/UserService";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const ModalAddCharacteristic = ({ isOpen, onClose }) => {
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10 });
    const [searchText, setSearchText] = useState({});
    const [maxCount, setMaxCount] = useState(0);

    const [fileList, setFileList] = useState();
    const [characteristicOptions, setCharacteristicOptions] = useState([]);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const characteristics_all = useSelector((state) => state.services.characteristic);

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

    useEffect(() => {
        if (characteristics_all?.length === 0) {
            dispatch(getUsers());
        }
    }, [dispatch, characteristics_all]);

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

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    }

    const validateFileList = (rule, value) => {
        return new Promise((resolve, reject) => {
            resolve();
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
            const name = await UserService.user_get_by_id(values.characteristic_initiator);

            let formattedName = name.last_name + " " + name.first_name[0] + ".";

            if (name.father_name) {
                formattedName += name.father_name[0] + ".";
            }
            const newObject = {
                characteristic_initiator_id: values.characteristic_initiator,
                characteristic_initiator: formattedName,
                date_from: values.date_from.toDate(),
                document_link: response,
                id: uuidv4(),
            };
            dispatch(
                addFieldValue({
                    fieldPath: "allTabs.services.characteristics",
                    value: newObject,
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
        onClose();
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                title={<IntlMessage id="characterictic.add" />}
                open={isOpen}
                onCancel={onCancel}
                onOk={onOk}
                okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
                cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
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
                                    format="DD-MM-YYYY"
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
export default ModalAddCharacteristic;
