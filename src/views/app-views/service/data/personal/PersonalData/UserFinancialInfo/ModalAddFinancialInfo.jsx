import {Form, Input, Modal} from 'antd';
import IntlMessage from 'components/util-components/IntlMessage';
import 'moment/locale/ru';
import {useDispatch} from 'react-redux';
import LanguageSwitcher from '../../../../../../../components/shared-components/LanguageSwitcher';
import {setFieldValue} from '../../../../../../../store/slices/myInfo/myInfoSlice';

const ModalAddFinancialInfo = ({isOpen, onClose}) => {
    const dispatch = useDispatch();

    const [form] = Form.useForm();

    const onOk = async () => {
        const values = await form.validateFields();

        const data = {
            iban: values.iban,
            housing_payments_iban: values.housing_payments_iban,
        };

        dispatch(
            setFieldValue({
                fieldPath: 'allTabs.personal_data.financial_info.iban',
                value:  data.iban,
            }),
        );
        dispatch(
            setFieldValue({
                fieldPath: 'allTabs.personal_data.financial_info.housing_payments_iban',
                value:  data.housing_payments_iban,
            }),
        );


        form.resetFields();
        onClose();
    };


    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                // title="Добавить навык владения спортом"
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
                        <IntlMessage id="personal.personal.financial.modal.title"/>
                    </span>
                    </div>
                }
                open={isOpen}
                onCancel={onClose}
                onOk={onOk}
                onClick={(e) => e.stopPropagation()}
                okText={<IntlMessage id="initiate.save"/>}
                cancelText={<IntlMessage id="candidates.warning.cancel"/>}
                style={{height: '500px', width: '400px'}}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="IBAN"
                        name="iban"
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id="candidates.title.must"/>,
                            },
                        ]}
                    >
                        <Input placeholder="IBAN"/>
                    </Form.Item>

                    <Form.Item
                        label={<IntlMessage id="personal.userFinancialInfo.specialAccount"/>}
                        name="housing_payments_iban"
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id="candidates.title.must"/>,
                            },
                        ]}
                    >
                        <Input placeholder="IBAN"/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ModalAddFinancialInfo;
