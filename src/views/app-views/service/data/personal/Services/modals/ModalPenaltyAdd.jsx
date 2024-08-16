import { PrivateServices } from "API";
import { Col, DatePicker, Form, Input, Modal, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addFieldValue } from "store/slices/myInfo/myInfoSlice";
import uuidv4 from "utils/helpers/uuid";
import SelectPickerMenu from "../../Education/modals/SelectPickerMenu";
import TextArea from "antd/es/input/TextArea";
import LanguageSwitcher from "components/shared-components/LanguageSwitcher";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";

const ModalPenaltyAdd = ({ isOpen, onClose }) => {
    const [maxCount, setMaxCount] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10 });

    const [penaltyOptions, setPenaltyOptions] = useState([]);
    const [optionValue, setOptionValue] = useState({});
    const [form] = useForm();
    const [reason, setReason] = useState({ name: "", nameKZ: "" });
    const [currentLanguage, setCurrentLanguage] = useState("rus");

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
        const penaltyOptions = await fetchOptionsData("/penalty_types", "penalty");

        setPenaltyOptions(penaltyOptions);
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

    const disabledDate = (current) => {
        return current && current > moment().startOf("day");
    };

    const validateLocalizationReason = () => {
        const isRusEmpty = reason.name.trim() === "";
        const isKZEmpty = reason.nameKZ.trim() === "";

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

    const handleInputReason = (event) => {
        setReason({
            ...reason,
            [currentLanguage === "rus" ? "name" : "nameKZ"]: event.target.value,
        });
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const newPenalty = {
                id: uuidv4(),
                document_number: values.document_number,
                status: optionValue.penalty,
                date_from: values.date_from.toDate(),
                reason: reason.name,
                reasonKZ: reason.nameKZ,
                date_to: null,
            };

            dispatch(
                addFieldValue({
                    fieldPath: "allTabs.services.penalties",
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
        setReason({ name: "", nameKZ: "" });
        setOptionValue({});
        onClose();
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                // title={'Добавить Взыскания'}
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
                            <IntlMessage id="personal.services.penalties.add" />
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
                onCancel={handleClose}
                onOk={handleOk}
                open={isOpen}
                okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
                cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label={<IntlMessage id={"service.data.services.contract.type"} />}
                        name="penalty"
                        rules={[
                            {
                                validator: validateValues,
                            },
                        ]}
                        required
                    >
                        <SelectPickerMenu
                            options={penaltyOptions}
                            type="penalty"
                            values={optionValue}
                            setValue={setOptionValue}
                            setScrollingLength={setScrollingLength}
                            scrollingLength={scrollingLength}
                            maxCount={maxCount}
                            setSearchText={setSearchText}
                            currentOptions={setPenaltyOptions}
                            searchText={searchText}
                            placeholder={"service.data.services.contract.type"}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<IntlMessage id={"candidates.currentTable.reason"} />}
                        name="reason"
                        rules={[
                            {
                                validator: validateLocalizationReason,
                            },
                        ]}
                        required
                    >
                        <TextArea
                            autoSize={{ minRows: 2, maxRows: 6 }}
                            value={currentLanguage === "rus" ? reason.name : reason.nameKZ}
                            onChange={handleInputReason}
                            onPressEnter={(e) => e.stopPropagation()}
                            onKeyPress={(e) => e.stopPropagation()}
                            placeholder={IntlMessageText.getText({
                                id: "candidates.currentTable.reason",
                            })}
                        />
                        <p className="fam_invisible_text">
                            {currentLanguage === "rus" ? reason.name : reason.nameKZ}
                        </p>
                    </Form.Item>

                    <Form.Item
                        label={
                            <span style={{ fontSize: "14px" }}>
                                <IntlMessage id="service.data.modalAddPsycho.docInfo" />
                            </span>
                        }
                        required
                        style={{ marginBottom: 0 }}
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
                                    style={{ marginBottom: 0 }}
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
                                    name="date_from"
                                    rules={[
                                        {
                                            required: true,
                                            message: (
                                                <IntlMessage id="Concract.date.registration.enter" />
                                            ),
                                        },
                                    ]}
                                    required
                                    style={{ marginBottom: 0 }}
                                >
                                    <DatePicker
                                        // defaultValue={'Дата регистрации'}
                                        disabledDate={disabledDate}
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

export default ModalPenaltyAdd;
