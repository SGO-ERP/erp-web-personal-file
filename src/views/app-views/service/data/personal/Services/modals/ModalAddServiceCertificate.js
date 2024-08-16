import { Select, Col, DatePicker, Form, Input, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import { disabledDateAfter } from "utils/helpers/futureDateHelper";
import LanguageSwitcher from "../../../../../../../components/shared-components/LanguageSwitcher";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { useAppSelector } from "../../../../../../../hooks/useStore";
import { PrivateServices } from "../../../../../../../API";
import { useDispatch } from "react-redux";
import { setFieldValue } from "../../../../../../../store/slices/myInfo/myInfoSlice";
import uuidv4 from "../../../../../../../utils/helpers/uuid";
import moment from "moment";
import { PERMISSION } from "constants/permission";

const ModalAddServiceCertificate = ({ isOpen, onClose }) => {
    const [form] = Form.useForm();
    const [status, setStatuses] = useState([]);

    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    const dispatch = useDispatch();

    const onCancel = () => {
        form.resetFields();
        onClose();
    };

    useEffect(() => {
        PrivateServices.get("/api/v1/service_idstatuses/").then((responce) => {
            if (responce.data) {
                setStatuses(responce.data);
            }
        });
    }, []);

    const handleOk = () => {
        const values = form.getFieldsValue();

        const data = {
            id: uuidv4(),
            number: values.number,
            token_number: values.token_number,
            date_to: moment(values.date).format("YYYY-MM-DD"),
            token_status: values.token,
            id_status: values.id,
        };

        dispatch(
            setFieldValue({
                fieldPath: "allTabs.services.service_id_info",
                value: data,
            }),
        );
        form.resetFields();
        onClose();
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                // title={'Данные служебного удостоверения'}
                title={<IntlMessage id="service.udo.info" />}
                open={isOpen && isHR}
                onCancel={onCancel}
                onOk={handleOk}
                okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
                cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
            >
                <Form form={form} layout="vertical">
                    <Row justify="space-between">
                        <Col xs={13}>
                            <Form.Item
                                label={<IntlMessage id="badge.certificate" />}
                                name={"number"}
                                required
                            >
                                <Input
                                    placeholder={IntlMessageText.getText({
                                        id: `badge.certificate`,
                                    })}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={10}>
                            <Form.Item
                                label={
                                    <span>
                                        <IntlMessage id="service.date.end" />
                                    </span>
                                }
                                name="date"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="candidates.title.must" />,
                                    },
                                ]}
                                required
                            >
                                <DatePicker
                                    placeholder={IntlMessageText.getText({
                                        id: "personal.passport.validity",
                                    })}
                                    format="DD-MM-YYYY"
                                    name="date"
                                    disabledDate={disabledDateAfter}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label={<IntlMessage id="badge.token_number" />}
                        name={"token_number"}
                    >
                        <Input
                            placeholder={
                                IntlMessageText.getText({
                                    id: `badge.token_number`,
                                }) + "..."
                            }
                        />
                    </Form.Item>
                    <Row gutter={10}>
                        <Col xs={14}>
                            <Form.Item
                                label={<IntlMessage id="service.has.udo" />}
                                name="id"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="candidates.title.must" />,
                                    },
                                ]}
                                required
                            >
                                <Select
                                    options={status.map((item) => {
                                        return {
                                            value: item.name,
                                            label: item.value,
                                        };
                                    })}
                                    placeholder={<IntlMessage id={"service.has.udo"} />}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={10}>
                            <Form.Item
                                label={
                                    <span>
                                        <IntlMessage id="service.has.mark" />
                                    </span>
                                }
                                name="token"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="candidates.title.must" />,
                                    },
                                ]}
                                required
                            >
                                <Select
                                    options={status.map((item) => {
                                        return {
                                            value: item.name,
                                            label: item.value,
                                        };
                                    })}
                                    placeholder={<IntlMessage id={"service.has.mark"} />}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};
export default ModalAddServiceCertificate;
