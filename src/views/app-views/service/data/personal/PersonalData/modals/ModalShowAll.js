import { Button, Form, Modal } from 'antd';
import 'moment/locale/ru';
import IntlMessage from 'components/util-components/IntlMessage';

const ModalShowAll = ({ isOpen, onClose, intlId, width, children }) => {
    const [form] = Form.useForm();

    const onOk = async () => {
        form.resetFields();
        onClose();
    };

    const onCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                title={<IntlMessage id={intlId} />}
                open={isOpen}
                onCancel={onCancel}
                onOk={onOk}
                style={{ height: '500px', width: '400px' }}
                footer={[
                    <Button key="onCancel" type="primary" onClick={onCancel}>
                        <IntlMessage id="initiate.ok" />
                    </Button>,
                ]}
                width={width}
            >
                {children}
            </Modal>
        </div>
    );
};

export default ModalShowAll;
