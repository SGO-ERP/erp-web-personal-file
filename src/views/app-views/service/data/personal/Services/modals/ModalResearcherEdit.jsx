import { Form, Modal, Select, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import IntlMessage from "components/util-components/IntlMessage";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setFieldValue } from "store/slices/myInfo/myInfoSlice";
import uuidv4 from "utils/helpers/uuid";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";
import UserService from "services/UserService";

const ModalResearcherEdit = ({ isOpen, onClose, info }) => {
    const [searchText, setSearchText] = useState({});
    const [usersOptions, setOptionsUsers] = useState([]);
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10 });
    const [maxCount, setMaxCount] = useState(0);
    const [spinSelect, setSpinSelect] = useState(false);
    const dispatch = useDispatch();
    const [form] = useForm();

    useEffect(() => {
        if (info && info?.researcher !== null) {
            findSelectOption(info?.researcher_id);
            const values = {
                user: info?.researcher_id,
            };

            form.setFieldsValue(values);
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

        if (!usersOptions.find((item) => item.id === id)) {
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
    }, [isOpen, searchText, scrollingLength, info]);

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
            const currentUser = usersOptions.find((item) => item.value === values.user);

            const data = {
                user_by_id: info?.user_by_id,
                researcher: currentUser.fullName,
                recommendant: info?.recommendant,
                document_link: info?.document_link,
                researcher_id: values.user,
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
        onClose();
    };

    return (
        <div>
            <Modal
                title={<IntlMessage id={"add.edit.study"} />}
                open={isOpen}
                onCancel={handleClose}
                onOk={handleOk}
            >
                <Spin spinning={spinSelect}>
                    <Form form={form} layout="vertical">
                        <Form.Item
                            label={<IntlMessage id="personal.services.studied" />}
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
                    </Form>
                </Spin>
            </Modal>
        </div>
    );
};

export default ModalResearcherEdit;
