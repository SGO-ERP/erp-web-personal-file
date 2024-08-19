import React, { useEffect, useState } from 'react';

import { Cascader, Form, Modal, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';

import { PrivateServices } from '../../../../../../../API';
import { components } from '../../../../../../../API/types';

import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import LocalizationText from '../../../../../../../components/util-components/LocalizationText/LocalizationText';

interface Props {
    onClose: () => void;
    isOpen: boolean;
}
const ModalSetUpStandards = ({ isOpen, onClose }: Props) => {
    const [form] = useForm();

    const [type, setType] = useState<components['schemas']['ActivityRead'][]>([]);
    const [typeOne, setTypeOne] = useState<string>('');
    const [value, setValue] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        PrivateServices.get('/api/v1/activity', {
            params: { query: { skip: 0, limit: 100 } },
        }).then((r) => {
            if (r.data !== undefined) {
                setType(r.data);
            }
        });
    }, []);

    const generateOptions = (data: components['schemas']['ActivityRead'][]) => {
        return data.map((item) => {
            const { id, children } = item;
            const options: any = {
                value: id,
                label: <LocalizationText text={item} />,
            };

            if (children && children.length > 0) {
                options.children = generateOptions(children as components['schemas']['ActivityRead'][]);
            }

            return options;
        });
    };

    const options = generateOptions(type);

    const onOk = () => {
        form.resetFields();
        setLoading(true);
        PrivateServices.put('/api/v1/activity/{id}/', {
            params: {
                path: {
                    id: value,
                },
            },
            body: {
                name: name,
                instructions: typeOne,
            },
        }).then(() => {
            setTypeOne('');
            setLoading(false);
            onClose();
        });
    };

    const onChange: (value: any) => void = (value: string[]) => {
        setValue(value[value.length - 1]);
        PrivateServices.get('/api/v1/activity/{id}/', {
            params: { path: { id: value[value.length - 1] } },
        }).then((r) => {
            if (r?.data && r?.data?.name) {
                setName(r?.data?.name);
                setTypeOne(r?.data?.instructions || '');
            }
        });
    };

    const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTypeOne(event.target.value);
    };

    const handleCancel = () => {
        form.resetFields();
        setTypeOne('');
        onClose();
    };

    useEffect(() => {
        setLoading(true);
        form.setFieldsValue({
            desc: typeOne,
        });
        setLoading(false);
    }, [typeOne, isOpen]);

    return (
        <Modal
            title={<IntlMessage id={'csp.modal.edit.setting.up'} />}
            open={isOpen}
            onOk={onOk}
            onCancel={handleCancel}
            width={'700px'}
            okText={<IntlMessage id="csp.modal.button.save" />}
            cancelText={<IntlMessage id="staffSchedule.cancel" />}
        >
            <Spin spinning={loading}>
                <Form form={form} layout="vertical">
                    <Form.Item
                        label={<IntlMessage id={'csp.modal.edit.view.csp'} />}
                        name={'activity'}
                    >
                        <Cascader options={options} style={{ width: '100%' }} onChange={onChange} />
                    </Form.Item>
                    <Form.Item label={<IntlMessage id={'csp.modal.textarea'} />} name={'desc'}>
                        <TextArea onChange={handleTextAreaChange} />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default ModalSetUpStandards;
