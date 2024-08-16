import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteByPath } from "../../../../../../../store/slices/myInfo/servicesSlice";
import { addFieldValue, replaceByPath } from "store/slices/myInfo/myInfoSlice";
import ServicesService from "../../../../../../../services/myInfo/ServicesService";

const ModalEditContract = ({ isOpen, onClose, contract }) => {
    const [contractOptions, setContractOptions] = useState([]);
    const [contractsData, setContractsData] = useState([]);
    const [source, setSource] = useState("");
    const [type, setType] = useState(null);

    const dispatch = useDispatch();
    const [form] = useForm();

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        try {
            const contractsData = await ServicesService.get_contracts_type();
            const options = contractsData.objects.map((contract) => ({
                value: contract.id,
                label: LocalText.getName(contract),
                names: { name: contract.name, nameKZ: contract.nameKZ },
                years: contract.years,
            }));
            setContractsData(contractsData.objects);
            setContractOptions(options);
        } catch (e) {
            setContractOptions([]);
            console.log(e);
        }
    };

    useEffect(() => {
        form.resetFields();

        const contract_id = contractsData.find((value) => value.name === contract.name);
        const values = {
            date_from: moment(contract.date_from),
            document_number: contract.document_number,
            contract_type: contract_id?.id,
            date_credited: contract.date_credited !== null ? moment(contract.date_credited) : null,
            id: contract.id,
            number_experience: contract_id?.years === -1 ? contract?.experience_years : null,
        };
        setType(contract_id?.years === -1 ? contract_id?.id : null);
        form.setFieldsValue(values);

        setSource(contract.source ? contract.source : "get");
    }, [form, contract, isOpen, contractsData, contractOptions]);

    const disabledDate = (current) => {
        return current && current > moment().startOf("day");
    };

    const changeDispatchValues = (obj) => {
        if (source === "get") {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: "serviceData.contracts",
                    id: contract.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: "edited.services.contracts",
                    value: obj,
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: "edited.services.contracts",
                    id: contract.id,
                    newObj: obj,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.services.contracts",
                    id: contract.id,
                    newObj: obj,
                }),
            );
        }
    };

    const onOk = async () => {
        const values = await form.validateFields();
        const currentContract = contractOptions.find(
            (contract) => contract.value === values.contract_type,
        );
        const match = currentContract.names.name.match(/\d/);

        const originalDate = values.date_from.toDate();
        const currentDateFrom = new Date(originalDate);
        const experience_years = contractOptions.find(
            (item) => item.value === values.contract_type,
        ).years;

        currentDateFrom.setFullYear(originalDate.getFullYear() + parseInt(match?.[0]));

        const initialDate = new Date(values.date_from.toDate());
        const newDate = new Date(initialDate);
        if (experience_years === -1) {
            newDate.setFullYear(newDate.getFullYear() + parseInt(values.number_experience));
        } else {
            newDate.setFullYear(newDate.getFullYear() + experience_years);
        }
        const date_to = newDate;

        const manually =
            experience_years === -1
                ? {
                      experience_years: values.number_experience,
                      date_to: date_to,
                  }
                : {
                      experience_years: experience_years,
                      date_to: date_to,
                  };

        const newObject = {
            ...manually,
            date_from: values.date_from.toDate(),
            date_credited: values.date_credited.toDate(),
            document_number: values.document_number,
            id: contract.id,
            name: currentContract.names.name,
            nameKZ: currentContract.names.nameKZ,
            contract_type_id: values.contract_type,
            contract_id: contract.contract_id,
            source: contract.source ? contract.source : "edited",
        };

        changeDispatchValues(newObject);

        closeAndClear();
    };

    const onDelete = () => {
        changeDispatchValues({ id: contract.id, delete: true });

        closeAndClear();
    };

    const closeAndClear = () => {
        form.resetFields();
        setSource("");
        setType(null);
        onClose();
    };

    return (
        <Modal
            // title={'Добавить образование'}
            title={
                <Row align="middle" justify="space-between">
                    <Col>
                        <IntlMessage id={"personal.services.contracts.edit"} />
                    </Col>
                </Row>
            }
            onCancel={closeAndClear}
            open={isOpen}
            footer={
                <Row justify="end">
                    <Button danger onClick={onDelete}>
                        <IntlMessage id={"initiate.deleteAll"} />
                    </Button>
                    <Button onClick={closeAndClear}>
                        <IntlMessage id={"service.data.modalAddPsycho.cancel"} />
                    </Button>
                    <Button type="primary" onClick={onOk}>
                        <IntlMessage id={"service.data.modalAddPsycho.save"} />
                    </Button>
                </Row>
            }
            onClick={(e) => e.stopPropagation()}
        >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col xs={12}>
                        <Form.Item
                            label={<IntlMessage id={"service.data.services.contract.type"} />}
                            name="contract_type"
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <IntlMessage
                                            id={"service.data.services.contract.type.empty"}
                                        />
                                    ),
                                },
                            ]}
                            required
                        >
                            <Select
                                options={contractOptions}
                                placeholder={
                                    <IntlMessage id={"service.data.services.contract.type"} />
                                }
                                filterOption={(inputValue, option) =>
                                    option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >=
                                    0
                                }
                                onChange={(e) => {
                                    if (
                                        contractOptions.find((item) => item.value === e).years !==
                                        -1
                                    ) {
                                        setType(null);
                                    } else {
                                        setType(e);
                                    }
                                }}
                                showSearch
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={12}>
                        <Form.Item
                            label={<IntlMessage id={"staffSchedule.list.date"} />}
                            name="date_from"
                            rules={[
                                {
                                    required: true,
                                    message: <IntlMessage id="Concract.date.registration.enter" />,
                                },
                            ]}
                            required
                        >
                            <DatePicker
                                // defaultValue={'Дата регистрации'}
                                disabledDate={disabledDate}
                                style={{ width: "100%" }}
                            />
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
                                name="date_credited"
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
                {type !== null && (
                    <Form.Item
                        name="number_experience"
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id="Concract.date.registration.enter" />,
                            },
                        ]}
                        label={
                            <span style={{ fontSize: "14px" }}>
                                <IntlMessage id="personal.services.lengthOfService" />
                            </span>
                        }
                        required
                        style={{ marginBottom: 0 }}
                    >
                        <Input type={"number"} style={{ width: "100%" }} />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

export default ModalEditContract;
