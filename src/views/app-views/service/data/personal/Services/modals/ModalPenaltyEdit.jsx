import { PrivateServices } from "API";
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addFieldValue, replaceByPath } from "store/slices/myInfo/myInfoSlice";
import { deleteByPath } from "store/slices/myInfo/servicesSlice";
import TextArea from "antd/es/input/TextArea";
import LanguageSwitcher from "components/shared-components/LanguageSwitcher";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";
import { disabledDate } from "utils/helpers/futureDateHelper";

const ModalPenaltyEdit = ({ isOpen, onClose, penalty, source = "get" }) => {
    const [maxCount, setMaxCount] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10 });

    const [penaltyOptions, setPenaltyOptions] = useState([]);
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

    const handleInputReason = (event) => {
        setReason({
            ...reason,
            [currentLanguage === "rus" ? "name" : "nameKZ"]: event.target.value,
        });
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

    const changeDispatchValues = (obj) => {
        if (source === "get") {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: "serviceData.penalties",
                    id: obj.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: "edited.services.penalties",
                    value: obj,
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: "edited.services.penalties",
                    id: obj.id,
                    newObj: obj,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.services.penalties",
                    id: obj.id,
                    newObj: obj,
                }),
            );
        }

        handleClose();
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const newPenalty = {
                id: penalty.id,
                document_number: values.document_number,
                status: values.penalty,
                date_from: values.date_from.toDate(),
                penalty_id: penalty.penalty_id,
                reason: reason.name,
                reasonKZ: reason.nameKZ,
                date_to: penalty.date_to,
            };

            changeDispatchValues(newPenalty);
        } catch (error) {
            console.log("Form validation error", error);
        }
    };

    const handleDelete = () => {
        changeDispatchValues({ id: penalty.id, delete: true });
    };

    const handleClose = () => {
        form.resetFields();
        setReason({ name: "", nameKZ: "" });
        onClose();
    };

    useEffect(() => {
        form.resetFields();

        const values = {
            document_number: penalty.document_number,
            penalty: penalty.status,
            date_from: moment(penalty.date_from),
        };
        setReason({ name: penalty.reason, nameKZ: penalty.reasonKZ });
        form.setFieldsValue(values);
    }, [form, penalty, isOpen]);

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                // title={'Редактировать Взыскания'}
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
                        label={<IntlMessage id={"service.data.services.contract.type"} />}
                        name="penalty"
                        rules={[
                            {
                                required: true,
                                message: (
                                    <IntlMessage id={"service.data.services.contract.type.empty"} />
                                ),
                            },
                        ]}
                        required
                    >
                        <Select
                            options={penaltyOptions}
                            placeholder={<IntlMessage id={"service.data.services.contract.type"} />}
                            onSearch={(e) => handleSearch(e, "penalty")}
                            onPopupScroll={(e) => handlePopupScroll(e, "penalty")}
                            showSearch
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

export default ModalPenaltyEdit;
