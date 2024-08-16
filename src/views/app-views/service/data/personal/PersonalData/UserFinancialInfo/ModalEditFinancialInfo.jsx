import {Form, Input, Modal} from 'antd';
import IntlMessage from 'components/util-components/IntlMessage';
import 'moment/locale/ru';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import LanguageSwitcher from '../../../../../../../components/shared-components/LanguageSwitcher';
import {replaceByPath, setFieldValue} from '../../../../../../../store/slices/myInfo/myInfoSlice';
import {deleteByPath} from "../../../../../../../store/slices/myInfo/personalInfoSlice";

const ModalEditFinancialInfo = ({isOpen, onClose, info, source}) => {
    const dispatch = useDispatch();

    const [form] = Form.useForm();

    const changeDispatchValues = (obj) => {
        if (source === "get") {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: "personalInfoData.user_financial_infos",
                    id: info.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                setFieldValue({
                    fieldPath: "edited.personal_data.financial_info.iban",
                    value: obj.iban,
                }),
            );
            dispatch(
                setFieldValue({
                    fieldPath: 'edited.personal_data.financial_info.housing_payments_iban',
                    value:  obj.housing_payments_iban,
                }),
            );
            dispatch(
                setFieldValue({
                    fieldPath: 'edited.personal_data.financial_info.id',
                    value:  info.id,
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                setFieldValue({
                    fieldPath: "edited.personal_data.financial_info.iban",
                    value: obj.iban,
                }),
            );
            dispatch(
                setFieldValue({
                    fieldPath: 'edited.personal_data.financial_info.housing_payments_iban',
                    value:  obj.housing_payments_iban,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                setFieldValue({
                    fieldPath: 'allTabs.personal_data.financial_info.iban',
                    value:  obj.iban,
                }),
            );
            dispatch(
                setFieldValue({
                    fieldPath: 'allTabs.personal_data.financial_info.housing_payments_iban',
                    value:  obj.housing_payments_iban,
                }),
            );
        }

        form.resetFields();
        onClose();
    };

    const onOk = async () => {
        const values = await form.validateFields();

        const data = {
            iban: values.iban,
            housing_payments_iban: values.housing_payments_iban,
        };

        changeDispatchValues(data);
    };

    useEffect(() => {
        form.resetFields();
        const values = {
            iban: info.iban,
            housing_payments_iban: info.housing_payments_iban,
        };
        form.setFieldsValue(values);
    }, [info, form, isOpen]);

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

export default ModalEditFinancialInfo;
