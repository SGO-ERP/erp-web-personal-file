import { PrivateServices } from "API";
import { Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addFieldValue } from "store/slices/myInfo/myInfoSlice";
import uuidv4 from "utils/helpers/uuid";
import SelectPickerMenu from "../../Education/modals/SelectPickerMenu";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";

const ModalHolidaysAdd = ({ isOpen, onClose }) => {
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10 });
    const [searchText, setSearchText] = useState({});
    const [maxCount, setMaxCount] = useState(0);

    const [optionValue, setOptionValue] = useState({});
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
        const statusOptions = await fetchOptionsData("/status_types", "status_holiday");

        setOptions(statusOptions);
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

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const newPenalty = {
                id: uuidv4(),
                document_number: values.document_number,
                date_from: values.dates[0].toDate(),
                date_to: values.dates[1].toDate(),
                created_at: values.created_at.toDate(),
                status: optionValue.status_holiday,
            };

            dispatch(
                addFieldValue({
                    fieldPath: "allTabs.services.holidays",
                    value: newPenalty,
                }),
            );

            handleClose();
        } catch (error) {
            console.log("Form validation error", error);
        }
    };

    const handleClose = () => {
        form.resetFields();
        setOptionValue({});
        onClose();
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal // title={'Добавить Взыскания'}
                title={<IntlMessage id={"personal.services.holidays.title"} />}
                onCancel={handleClose}
                onOk={handleOk}
                open={isOpen}
                okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
                cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label={<IntlMessage id={"personal.services.holidays"} />}
                        name="status_holiday"
                        rules={[
                            {
                                validator: validateValues,
                            },
                        ]}
                        required
                    >
                        <SelectPickerMenu
                            options={options}
                            type="status_holiday"
                            values={optionValue}
                            setValue={setOptionValue}
                            setScrollingLength={setScrollingLength}
                            scrollingLength={scrollingLength}
                            maxCount={maxCount}
                            setSearchText={setSearchText}
                            currentOptions={setOptions}
                            searchText={searchText}
                            placeholder={"personal.services.holidays"}
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

export default ModalHolidaysAdd;
