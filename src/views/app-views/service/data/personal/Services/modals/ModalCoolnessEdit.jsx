import { DeleteOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import IntlMessage from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFieldValue, replaceByPath } from "store/slices/myInfo/myInfoSlice";
import { deleteByPath } from "store/slices/myInfo/servicesSlice";
import uuidv4 from "utils/helpers/uuid";

const ModalCoolnessEdit = ({ isOpen, onClose, coolness }) => {
    const [coolnessOptions, setCoolnessOptions] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [coolnessData, setCoolnessData] = useState([]);

    const { coolnessStatuses, coolnessForms } = useSelector((state) => state.coolnessModalEdit);

    const [form] = useForm();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!coolnessStatuses) return;
        const statusesKeys = Object.keys(coolnessStatuses);

        const optionStatuses = statusesKeys.map((key) => ({
            value: key,
            label: LocalText.getName(coolnessStatuses[key]),
            names: { name: coolnessStatuses[key].name, nameKZ: coolnessStatuses[key].nameKZ },
        }));

        setStatuses(optionStatuses);
    }, [coolnessStatuses]);

    useEffect(() => {
        if (!coolnessForms) return;
        const forms = coolnessForms.map((e) => {
            return { value: e.id, label: LocalText.getName(e), object: e };
        });

        setCoolnessOptions(forms);
    }, [coolnessForms]);

    useEffect(() => {
        if (!coolness || statuses.length === 0) return;
        setCoolnessData([]);
        const newValues = {};

        coolness
            .filter((item) => !item.delete)
            .forEach((item) => {
                const currentStatus = statuses.find(
                    (el) => el.label === LocalText.getName(item.coolness_status),
                );

                newValues[`coolness_form_${item.id}`] = item.type_id;
                newValues[`coolness_status_${item.id}`] = currentStatus?.value;

                setCoolnessData((prevData) => [
                    ...prevData,
                    { ...item, source: item.source ? item.source : "remote" },
                ]);
            });

        form.setFieldsValue(newValues);
    }, [coolness, isOpen, form, statuses]);

    if (!isOpen) return;

    const changeDispatchValues = (obj, source) => {
        if (source === "create") {
            dispatch(
                addFieldValue({
                    fieldPath: "allTabs.services.coolness",
                    value: obj,
                }),
            );
        }
        if (source === "get") {
            dispatch(
                deleteByPath({
                    path: "serviceData.general_information.coolness",
                    id: obj.id,
                }),
            );
            dispatch(
                addFieldValue({
                    fieldPath: "edited.services.coolness",
                    value: obj,
                }),
            );
        }
        if (source === "edited") {
            dispatch(
                replaceByPath({
                    path: "edited.services.coolness",
                    id: obj.id,
                    newObj: obj,
                }),
            );
        }
        if (source === "added") {
            dispatch(
                replaceByPath({
                    path: "allTabs.services.coolness",
                    id: obj.id,
                    newObj: obj,
                }),
            );
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            coolnessData.map((item) => {
                if (item.delete) {
                    changeDispatchValues(
                        { delete: true, id: item.id },
                        item.source === "remote" ? "get" : item.source,
                    );

                    return;
                }

                const currentStatus = statuses.find(
                    (e) => e.value === values[`coolness_status_${item.id}`],
                );
                const currentType = coolnessOptions.find(
                    (e) => e.value === values[`coolness_form_${item.id}`],
                );

                if (item.source === "remote" || item.source === "edited") {
                    changeDispatchValues(
                        {
                            coolness_status: currentStatus.names,
                            coolness_status_id: currentStatus.value,
                            type_id: values[`coolness_form_${item.id}`],
                            type: currentType?.object,
                            id: item.id,
                            source: "edited",
                        },
                        item.source === "remote" ? "get" : item.source,
                    );
                } else if (item.source === "create" || item.source === "added") {
                    changeDispatchValues(
                        {
                            coolness_status: currentStatus.names,
                            coolness_status_id: currentStatus.value,
                            type_id: values[`coolness_form_${item.id}`],
                            type: currentType?.object,
                            id: item.id,
                            source: "added",
                        },
                        item.source === "create" ? "create" : item.source,
                    );
                }
            });
            handleClose();
        } catch (error) {
            console.log(error);
        }
    };

    const handleClose = () => {
        form.resetFields();
        setCoolnessData([]);
        onClose();
    };

    const addNewCoolness = () => {
        setCoolnessData((prevData) => [...prevData, { id: uuidv4(), source: "create" }]);
    };

    const deleteCoolnessRow = (id) => {
        setCoolnessData((data) =>
            data.map((item) => (item.id === id ? { ...item, delete: true } : item)),
        );
    };

    const generateCoolnessBlock = (coolnessItem) => (
        <Row gutter={[10]} style={{ height: 50, marginBottom: 20 }} key={coolnessItem.id}>
            <Col xs={11}>
                <Form.Item
                    name={`coolness_form_${coolnessItem.id}`}
                    rules={[
                        {
                            message: <IntlMessage id="personal.coolness.type.enter" />,
                            required: true,
                        },
                    ]}
                >
                    <Select
                        style={{ width: '100%' }}
                        options={coolnessOptions}
                        filterOption={(inputValue, option) =>
                            option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                        }
                        showSearch
                        placeholder={<IntlMessage id={'service.data.modalAcademicDegree.degree'} />}
                    />
                </Form.Item>
            </Col>
            <Col xs={10}>
                <Form.Item
                    name={`coolness_status_${coolnessItem.id}`}
                    rules={[
                        {
                            message: <IntlMessage id="personal.coolness.type.enter" />,
                            required: true,
                        },
                    ]}
                >
                    <Select
                        options={statuses}
                        placeholder={<IntlMessage id="personal.coolness.type.enter" />}
                    />
                </Form.Item>
            </Col>
            <Col xs={1}>
                <Button style={{ color: "red" }} onClick={() => deleteCoolnessRow(coolnessItem.id)}>
                    <DeleteOutlined />
                </Button>
            </Col>
        </Row>
    );

    return (
        <div>
            <Modal
                title={<IntlMessage id={"personal.coolness.title"} />}
                open={isOpen}
                onCancel={handleClose}
                onOk={handleOk}
                okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
                cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
            >
                <Form form={form} layout="vertical">
                    <Row style={{ fontWeight: "bold", height: 30 }}>
                        <span style={{ color: "red", marginRight: 5 }}>*</span>
                        <IntlMessage id={"personal.coolness.degree"} />
                    </Row>
                    {coolnessData
                        .filter((item) => !item.delete)
                        .map((item) => generateCoolnessBlock(item))}
                    <Row>
                        <Button onClick={addNewCoolness} style={{ width: "100%" }} z>
                            +
                        </Button>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default ModalCoolnessEdit;
