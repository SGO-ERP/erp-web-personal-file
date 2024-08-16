import { Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select, Spin } from 'antd';
import IntlMessage, { IntlMessageText } from 'components/util-components/IntlMessage';
import { LocalText } from 'components/util-components/LocalizationText/LocalizationText';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import SelectPickerMenuService from 'services/myInfo/SelectPickerMenuService';
import { addFieldValue } from 'store/slices/myInfo/myInfoSlice';
import { disabledDate } from 'utils/helpers/futureDateHelper';
import uuidv4 from 'utils/helpers/uuid';
import '../../Education/styleModals.css';

export default function ModalAddRank({ isOpen, onClose }) {
    const [formattedRanks, setFormattedRanks] = useState([]);
    const [loadingRanks, setLoadingRanks] = useState(false);

    const [checkbox, setCheckbox] = useState(false);

    const [form] = Form.useForm();
    const dispatch = useDispatch();

    useEffect(() => {
        fetchOptions();
    }, [isOpen]);

    const fetchOptions = async () => {
        setLoadingRanks(true);

        SelectPickerMenuService.getEducation({
            skip: 0,
            limit: 10_000,
            baseUrl: '/ranks',
        })
            .then((response) => {
                const rankOptions = response.objects.map((item) => ({
                    value: item.id,
                    label: LocalText.getName(item),
                    object: item,
                }));

                setFormattedRanks(rankOptions);
            })
            .finally(() => {
                setLoadingRanks(false);
            });
    };

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const rankNames = formattedRanks.find((rank) => rank.value === values.rank_id);

            const newObject = {
                id: uuidv4(),
                rank_id: values.rank_id,
                document_number: values.document_number,
                date_from: values.date_from.toDate(),
                document_link: null,
                rank_assigned_by: values.rank_assigned_by,
                // view only
                names: { name: rankNames.object.name, nameKZ: rankNames.object.nameKZ },
                early_promotion: checkbox,
                source: 'added',
            };

            dispatch(
                addFieldValue({
                    fieldPath: 'allTabs.services.ranks',
                    value: newObject,
                }),
            );

            onCancel();
        } catch (error) {
            console.log('Form validation error', error);
        }
    };

    const onCancel = () => {
        form.resetFields();
        setCheckbox(false);
        onClose();
    };

    const handleClick = (e) => {
        if (e.target.checked === true) {
            setCheckbox(true);
        } else if (e.target.checked === false) {
            setCheckbox(false);
        }
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                title={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginRight: '20px',
                            alignItems: 'center',
                        }}
                    >
                        <span>
                            <IntlMessage id="rank.add" />
                        </span>
                    </div>
                }
                open={isOpen}
                onOk={onOk}
                okText={<IntlMessage id={'service.data.modalAddPsycho.save'} />}
                cancelText={<IntlMessage id={'service.data.modalAddPsycho.cancel'} />}
                onCancel={onCancel}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col xs={24}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: '14px' }}>
                                        <IntlMessage id="rank.give" />
                                    </span>
                                }
                                name="rank_id"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="rank.give.enter" />,
                                    },
                                ]}
                                required
                            >
                                <Select
                                    options={formattedRanks}
                                    showSearch
                                    placeholder={<IntlMessage id={'rank.give'} />}
                                    filterOption={(inputValue, option) =>
                                        option.label
                                            .toLowerCase()
                                            .indexOf(inputValue.toLowerCase()) >= 0
                                    }
                                    dropdownRender={(menu) => {
                                        if (loadingRanks) {
                                            return (
                                                <Spin
                                                    spinning={loadingRanks}
                                                    style={{ width: '100%' }}
                                                />
                                            );
                                        }
                                        return menu;
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="checkbox">
                        <Checkbox onChange={handleClick}>
                            <IntlMessage id={'early'} />
                        </Checkbox>
                    </Form.Item>
                    <Form.Item
                        label={<IntlMessage id="service.data.modalAddPsycho.docInfo" />}
                        required
                        style={{ marginBottom: 0 }}
                    >
                        <Row gutter={16}>
                            <Col xs={24}>
                                <Form.Item
                                    name="rank_assigned_by"
                                    rules={[
                                        {
                                            required: true,
                                            message: <IntlMessage id="rank.order.from.enter" />,
                                        },
                                    ]}
                                    required
                                >
                                    <Input
                                        placeholder={IntlMessageText.getText({
                                            id: 'rank.order.from.placeholder',
                                        })}
                                    />
                                </Form.Item>
                            </Col>

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
                                            id: 'service.data.modalAddPsycho.chooseDoc',
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
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
