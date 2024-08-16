import { Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ServicesService from "services/myInfo/ServicesService";
import { addFieldValue } from "store/slices/myInfo/myInfoSlice";
import { disabledDate } from "utils/helpers/futureDateHelper";
import uuidv4 from "utils/helpers/uuid";

const ModalAddContract = ({ isOpen, onClose }) => {
    const [contractOptions, setContractOptions] = useState([]);
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
            setContractOptions(options);
        } catch (e) {
            setContractOptions([]);
            console.log(e);
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
            id: uuidv4(),
            name: currentContract.names.name,
            nameKZ: currentContract.names.nameKZ,
            contract_type_id: values.contract_type,
            source: "added",
        };

        dispatch(
            addFieldValue({
                fieldPath: "allTabs.services.contracts",
                value: newObject,
            }),
        );

        closeAndClear();
    };

    const closeAndClear = () => {
        form.resetFields();
        setType(null);
        onClose();
    };


    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                // title={'Добавить образование'}
                title={
                    <Row align="middle" justify="space-between">
                        <Col>
                            <IntlMessage id={"personal.services.contracts.add"} />
                        </Col>
                    </Row>
                }
                onCancel={closeAndClear}
                onOk={onOk}
                open={isOpen}
                okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
                cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
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
                                        option.label
                                            .toLowerCase()
                                            .indexOf(inputValue.toLowerCase()) >= 0
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
                                        message: (
                                            <IntlMessage id="Concract.date.registration.enter" />
                                        ),
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
                                >
                                    <DatePicker
                                        disabledDate={disabledDate}
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form.Item>
                    {type!== null && (
                        <Form.Item
                            name="number_experience"
                            rules={[
                                {
                                    required: true,
                                    message: <IntlMessage id="Concract.date.registration.enter" />,
                                },
                            ]}
                            label={<IntlMessage id="personal.services.lengthOfService" />}
                            required
                        >
                            <Input
                                type={"number"}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default ModalAddContract;
