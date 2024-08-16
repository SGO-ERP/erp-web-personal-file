import { DatePicker, Form, Modal, Row, Select, Col, Input, Button } from "antd";
import { useForm } from "antd/es/form/Form";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setFieldValue } from "store/slices/myInfo/myInfoSlice";
import { PrivateServices } from "API";
import { disabledDate } from "utils/helpers/futureDateHelper";

const ModalReserveEdit = ({ isOpen, onClose, reserve }) => {
    const [formsOptions, setFormsOptions] = useState([]);
    const [change, setChange] = useState(false);

    const [form] = useForm();

    const dispatch = useDispatch();

    useEffect(() => {
        if (!isOpen) return;

        fetchForms();
    }, [isOpen]);

    const fetchForms = async () => {
        const forms = await PrivateServices.get("/api/v1/personnal_reserve/forms/");

        const keys = Object.keys(forms.data);

        setFormsOptions(keys.map((item) => ({ value: item, label: forms.data[item] })));
    };

    useEffect(() => {
        if (!reserve) return;
        form.resetFields();

        const values = {
            document_number: reserve.document_number,
            reserve: reserve.reserve,
            reserve_date: moment(reserve.reserve_date),
        };

        if (reserve.document_link) {
            values.document_link = reserve.document_link;
        }

        form.setFieldsValue(values);
    }, [isOpen, form, reserve, isOpen]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const newReserve = {
                document_number: values.document_number,
                reserve:
                    change === true
                        ? values.reserve
                        : formsOptions.find((item) => item.label === values.reserve) !== undefined
                        ? formsOptions.find((item) => item.label === values.reserve).value
                        : values.reserve,
                reserve_date: values.reserve_date,
                document_link: null,
                id: reserve?.id ? reserve.id : null,
            };

            setNewValue(newReserve);
        } catch (error) {
            console.log("Form validation error", error);
        }
    };

    const setNewValue = (value) => {
        dispatch(
            setFieldValue({
                fieldPath: "edited.services.personnel_reserve",
                value,
            }),
        );

        handleClose();
    };

    const handleClose = () => {
        form.resetFields();
        setChange(false);
        onClose();
    };

    const handleDelete = () => {
        setNewValue({ id: reserve?.id ? reserve.id : null, delete: true });
    };

    return (
        <Modal
            title={<IntlMessage id="personal.services.cadreReserve" />}
            open={isOpen}
            footer={
                <Row justify="end">
                    <Button danger onClick={handleDelete}>
                        <IntlMessage id={"initiate.deleteAll"} />
                    </Button>
                    <Button onClick={handleClose}>
                        <IntlMessage id={"candidates.warning.cancel"} />
                    </Button>
                    <Button type="primary" onClick={handleOk}>
                        <IntlMessage id={"initiate.save"} />
                    </Button>
                </Row>
            }
        >
            <Form form={form} layout="vertical">
                <Row>
                    <p className="fam_form_title_symbol">*</p>
                    <p className="fam_form_title_text">
                        <IntlMessage id={"service.data.modalAddPsycho.docInfo"} />
                    </p>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col xs={12}>
                        <Form.Item
                            name="document_number"
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <IntlMessage
                                            id={"service.data.modalAcademicDegree.document.number"}
                                        />
                                    ),
                                },
                            ]}
                        >
                            <Input
                                placeholder={IntlMessageText.getText({
                                    id: "service.data.modalAddPsycho.docNum",
                                })}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={12}>
                        <Form.Item
                            name="reserve_date"
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <IntlMessage
                                            id={"service.data.modalAcademicDegree.dateGive"}
                                        />
                                    ),
                                },
                            ]}
                        >
                            <DatePicker
                                placeholder={IntlMessageText.getText({
                                    id: "service.data.modalAcademicDegree.dateGiveTxt",
                                })}
                                name="date_of_issue"
                                format="DD-MM-YYYY"
                                disabledDate={disabledDate}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    label={<IntlMessage id="reserve.or.add.name" />}
                    name="reserve"
                    rules={[
                        {
                            required: true,
                            message: <IntlMessage id="secret.form.enter" />,
                        },
                    ]}
                    required
                >
                    <Select
                        placeholder={IntlMessageText.getText({
                            id: "secret.form",
                        })}
                        options={formsOptions}
                        style={{ width: "100%" }}
                        onChange={() => setChange(true)}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalReserveEdit;
