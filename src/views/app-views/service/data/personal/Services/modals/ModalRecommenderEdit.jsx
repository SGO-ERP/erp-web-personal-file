import { InboxOutlined } from "@ant-design/icons";
import { Form, Modal, Upload, message, Select, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import IntlMessage from "components/util-components/IntlMessage";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import FileUploaderService from "services/myInfo/FileUploaderService";
import { setFieldValue } from "store/slices/myInfo/myInfoSlice";
import uuidv4 from "utils/helpers/uuid";
import { fileExtensions } from "../../../../../../../constants/FileExtensionConstants";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";
import UserService from "../../../../../../../services/UserService";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const ModalRecommenderEdit = ({ isOpen, onClose, info }) => {
    const [searchText, setSearchText] = useState({});
    const [usersOptions, setOptionsUsers] = useState([]);
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10 });
    const [maxCount, setMaxCount] = useState(0);
    const [fileList, setFileList] = useState();
    const [filesChanged, setFilesChanged] = useState(false);
    const [spinSelect, setSpinSelect] = useState(false);

    const dispatch = useDispatch();
    const [form] = useForm();

    useEffect(() => {
        if (info && info?.recommendant !== null) {
            findSelectOption(info?.user_by_id);

            const values = {
                user: info?.user_by_id,
            };

            form.setFieldsValue(values);
        }
        const getFile = async () => {
            const file = await FileUploaderService.getFileByLink(info?.document_link);
            form.setFieldsValue({
                dragger: [file],
            });
        };
        if (info && info?.document_link !== null) {
            getFile();
        }
    }, [form, isOpen, info]);

    const findSelectOption = async (id) => {
        if (!id) return;

        setSpinSelect(true);
        let response = await UserService.user_get_by_id(id);

        let fullName;

        if (response?.father_name) {
            fullName = response.last_name + " " + response.first_name + " " + response.father_name;
        } else {
            fullName = response.last_name + " " + response.first_name;
        }

        if (usersOptions.find((item) => item.id === id) === undefined) {
            setOptionsUsers((prevData) => [
                ...new Set(prevData),
                {
                    value: response.id,
                    label: fullName,
                    fullName: `${response.last_name} ${response.first_name[0]}.${
                        response.father_name ? " " + response.father_name[0] + "." : ""
                    }`,
                },
            ]);
        }
        setSpinSelect(false);
    };

    useEffect(() => {
        fetchOptions();
    }, [scrollingLength, searchText, isOpen]);

    const fetchOptionsData = async (baseUrl, type) => {
        const response = await SelectPickerMenuService.getEducation({
            ...scrollingLength,
            search: searchText,
            baseUrl,
        });

        setMaxCount((prevData) => ({ ...prevData, [type]: response.total }));

        return response?.users?.map((item) => {
            const withoutFather = item.last_name + " " + item.first_name;
            const fullName = item.father_name
                ? withoutFather + " " + item.father_name
                : withoutFather;
            return {
                value: item.id,
                label: fullName,
                fullName: `${item.last_name} ${item.first_name[0]}.${
                    item.father_name ? " " + item.father_name[0] + "." : ""
                }`,
            };
        });
    };

    const fetchOptions = async () => {
        const options = await fetchOptionsData("/users/get_all_short_read", "user");

        setOptionsUsers(options);
    };

    const loadMoreOptions = () => {
        const newLimit = scrollingLength.limit + 10;
        const limitedLimit = newLimit > maxCount?.user ? maxCount?.user : newLimit;

        setScrollingLength({ skip: scrollingLength.skip, limit: limitedLimit });
    };

    const handlePopupScroll = (e) => {
        const { target } = e;
        if (target.scrollTop + target.clientHeight === target.scrollHeight) {
            loadMoreOptions();
        }
    };

    const validateFileList = (rule, value) => {
        return new Promise((resolve, reject) => {
            resolve();
        });
    };

    const handleFileRemove = () => {
        form.setFieldsValue({ dragger: [] });
        setFilesChanged(true);
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
            void message.error(<IntlMessage id="medical.file.upload.error" />);
        }
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const changeDispatchValues = (obj, source) => {
        if (source === "create") {
            dispatch(
                setFieldValue({
                    fieldPath: "allTabs.services.recommendation_and_researcher",
                    value: obj,
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                setFieldValue({
                    fieldPath: "edited.services.recommendation_and_researcher",
                    value: obj,
                }),
            );
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const link = filesChanged
                ? await handleFileUpload(values.dragger)
                : info?.document_link;
            const currentUser = usersOptions.find((item) => item.value === values.user);

            const response = await UserService.user_get_by_id(values.user);

            const fullName = `${response.last_name} ${response.first_name[0]}.${
                response.father_name ? " " + response.father_name[0] + "." : ""
            }`;
            const data = {
                document_link: link ?? null,
                researcher_id: info?.researcher_id,
                recommendant: currentUser ? currentUser?.fullName : fullName,
                researcher: info?.researcher,
                user_by_id: values.user,
            };

            if (!info) {
                changeDispatchValues(
                    {
                        ...data,
                        id: uuidv4(),
                        source: "added",
                    },
                    "create",
                );
            } else if (info && !info?.source) {
                changeDispatchValues(
                    {
                        ...data,
                        id: info?.id,
                    },
                    "edited",
                );
            } else if (info && info?.source) {
                changeDispatchValues(
                    {
                        ...data,
                        id: info?.id,
                        source: "added",
                    },
                    "create",
                );
            }
        } catch (error) {
            console.log(error);
        }
        handleClose();
    };

    const handleClose = () => {
        form.resetFields();
        setSearchText({});
        setOptionsUsers([]);
        setScrollingLength({ skip: 0, limit: 10 });
        setMaxCount(0);
        setFileList();
        setFilesChanged(false);
        onClose();
    };

    return (
        <div>
            <Modal
                title={<IntlMessage id={"add.edit.recommendation"} />}
                open={isOpen}
                onCancel={handleClose}
                onOk={handleOk}
            >
                <Spin spinning={spinSelect}>
                    <Form form={form} layout="vertical">
                        <Form.Item
                            label={<IntlMessage id="recommended" />}
                            name="user"
                            rules={[
                                {
                                    required: true,
                                    message: <IntlMessage id="recommended.enter" />,
                                },
                            ]}
                        >
                            <Select
                                onSearch={(value) => setSearchText(value)}
                                onPopupScroll={handlePopupScroll}
                                showSearch
                                options={usersOptions}
                                filterOption={(inputValue, option) =>
                                    option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >=
                                    0
                                }
                            />
                        </Form.Item>
                        <Form.Item
                            label={
                                <span style={{ fontSize: "14px" }}>
                                    <IntlMessage id="recommend.doc" />
                                </span>
                            }
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
                </Spin>
            </Modal>
        </div>
    );
};

export default ModalRecommenderEdit;
