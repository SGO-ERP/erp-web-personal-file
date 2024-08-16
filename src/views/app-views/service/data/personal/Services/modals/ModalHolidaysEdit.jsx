import { PrivateServices } from "API";
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";
import ServicesService from "services/myInfo/ServicesService";
import { addFieldValue, replaceByPath } from "store/slices/myInfo/myInfoSlice";
import { deleteByPath } from "store/slices/myInfo/servicesSlice";

const ModalHolidaysEdit = ({ isOpen, onClose, source = "get", holiday }) => {
    const [maxCount, setMaxCount] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10 });

    const [options, setOptions] = useState([]);
    const [form] = useForm();

    const dispatch = useDispatch();

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
        const statusOptions = await fetchOptionsData("/status_types", "status");

        setOptions(statusOptions);
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

    const changeDispatchValues = (obj) => {
        if (source === "get") {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: "serviceData.holidays",
                    id: obj.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: "edited.services.holidays",
                    value: obj,
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: "edited.services.holidays",
                    id: obj.id,
                    newObj: obj,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.services.holidays",
                    id: obj.id,
                    newObj: obj,
                }),
            );
        }

        handleClose();
    };

    useEffect(() => {
        const values = {
            id: holiday.id,
            document_number: holiday.document_number,
            dates: holiday.date_to
                ? [moment(holiday.date_from), moment(holiday.date_to)]
                : [moment(holiday.date_from), ""],
            created_at: holiday.created_at ? moment(holiday.created_at) : moment(holiday.date_from),
            status: holiday.status,
            status_id: holiday.status_id,
        };

        findSelectOption(holiday.status, setOptions);
        form.setFieldsValue(values);
    }, [form, holiday, isOpen]);

    const findSelectOption = async (id, setOptions) => {
        const response = await ServicesService.get_status_leave_type_id(id);

        setOptions((prevData) => [
            ...prevData,
            { value: response.id, label: LocalText.getName(response) },
        ]);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const newPenalty = {
                id: holiday.id,
                document_number: values.document_number,
                date_from: values.dates[0].toDate(),
                date_to: values.dates[1].toDate(),
                created_at: values.created_at.toDate(),
                status: values.status,
            };

            changeDispatchValues(newPenalty);
        } catch (error) {
            console.log("Form validation error", error);
        }
    };

    const handleDelete = () => {
        changeDispatchValues({ id: holiday.id, delete: true });
    };

    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal // title={'Добавить Взыскания'}
                title={
                    <Row align="middle" justify="space-between">
                        <Col>
                            <IntlMessage id={"personal.services.penalties.add"} />
                        </Col>
                    </Row>
                }
                onCancel={handleClose}
                open={isOpen}
                footer={
                    <Row justify="end">
                        <Button danger onClick={handleDelete}>
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
                        label={<IntlMessage id={"personal.services.holidays"} />}
                        name="status"
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={"personal.services.holidays.empty"} />,
                            },
                        ]}
                        required
                    >
                        <Select
                            options={options}
                            placeholder={<IntlMessage id={"personal.services.holidays"} />}
                            onSearch={(e) => handleSearch(e, "status")}
                            onPopupScroll={(e) => handlePopupScroll(e, "status")}
                            showSearch
                        />
                    </Form.Item>
                    <Row>
                        <Col xs={24}>
                            <Form.Item
                                name="dates"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <IntlMessage id="personal.services.holidays.dates.empty" />
                                        ),
                                    },
                                ]}
                                label={
                                    <span style={{ fontSize: "14px" }}>
                                        <IntlMessage id="personal.services.holidays.dates" />
                                    </span>
                                }
                                required
                            >
                                <DatePicker.RangePicker style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label={
                            <span style={{ fontSize: "14px" }}>
                                <IntlMessage id="service.data.modalAddPsycho.docInfo" />
                            </span>
                        }
                        required
                    >
                        <Row gutter={16}>
                            <Col xs={12}>
                                <Form.Item
                                    name="document_number"
                                    rules={[
                                        {
                                            required: true,
                                            message: (
                                                <IntlMessage id="service.data.modalAddPsycho.chooseDoc" />
                                            ),
                                        },
                                    ]}
                                    required
                                >
                                    <Input
                                        placeholder={IntlMessageText.getText({
                                            id: "service.data.modalAddPsycho.chooseDoc",
                                        })}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={12}>
                                <Form.Item
                                    name="created_at"
                                    rules={[
                                        {
                                            required: true,
                                            message: (
                                                <IntlMessage id="Concract.date.registration.enter" />
                                            ),
                                        },
                                    ]}
                                    required
                                >
                                    <DatePicker
                                        // defaultValue={'Дата регистрации'}
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ModalHolidaysEdit;
