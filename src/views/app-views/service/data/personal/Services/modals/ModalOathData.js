import { Cascader, Col, DatePicker, Form, Modal, Row } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LanguageSwitcher from '../../../../../../../components/shared-components/LanguageSwitcher';
import { setFieldValue } from '../../../../../../../store/slices/myInfo/myInfoSlice';
import IntlMessage, { IntlMessageText } from 'components/util-components/IntlMessage';

const ModalOathData = ({ isOpen, onClose, oath }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const military_units = useSelector((state) => state.services.militaryUnits);
    const formattedMilitaryUnits = military_units.map((item) => {
        return {
            value: item.id,
            label: item.name,
        };
    });

    const disabledDate = (current) => {
        // Disable dates before today
        return current && current > moment().startOf('day');
    };

    const onOk = async () => {
        const values = await form.validateFields();
        const newObject = {
            date: values.date.toDate(),
            military_unit_id: values.name[0],
            id: oath.id ?? '75aeea4b-91f1-4718-8954-4ae1c4268d33',
            military_name: military_units.find((item) => item.id === values.name[0]).name,
        };
        dispatch(
            setFieldValue({
                fieldPath: 'edited.services.oath',
                value: newObject,
            }),
        );
        form.resetFields();
        onClose();
    };

    const onCancel = () => {
        form.resetFields();
        onClose();
    };

    useEffect(() => {
        form.resetFields();
        const values = {
            date: moment(oath.date),
            name: [oath.military_id],
        };
        form.setFieldsValue(values);
    }, [form, oath,isOpen]);

    return (
        <div>
            <Modal
                // title={'Данные о присяге'}
                title={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginRight: '20px',
                            alignItems: 'center',
                        }}
                    >
                        <span>Данные о присяге</span>
                        <LanguageSwitcher size="small" fontSize="12px" height="1.4rem" />
                    </div>
                }
                open={isOpen}
                onCancel={onCancel}
                okText={<IntlMessage id={'service.data.modalAddPsycho.save'} />}
                onOk={onOk}
                cancelText={<IntlMessage id={'service.data.modalAddPsycho.cancel'} />}
            >
                <Form form={form} layout="vertical">
                    <Row>
                        <Col xs={12}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: '14px' }}>
                                        <IntlMessage id="oath.date" />
                                    </span>
                                }
                                required
                                name="date"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="oath.date.enter" />,
                                    },
                                ]}
                            >
                                <DatePicker
                                    placeholder={IntlMessageText.getText({
                                        id: 'oath.date.placeholder',
                                    })}
                                    style={{ width: '100%' }}
                                    disabledDate={disabledDate}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24}>
                            {' '}
                            <Form.Item
                                label={
                                    <span style={{ fontSize: '14px' }}>
                                        <IntlMessage id="oath.confirm" />
                                    </span>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="oath.select.military.unit" />,
                                    },
                                ]}
                                required
                                placeholder={IntlMessageText.getText({
                                    id: 'oath.select.military.unit',
                                })}
                                name="name"
                            >
                                <Cascader
                                    options={formattedMilitaryUnits}
                                    placeholder={IntlMessageText.getText({
                                        id: 'oath.select.military.unit',
                                    })}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};
export default ModalOathData;
