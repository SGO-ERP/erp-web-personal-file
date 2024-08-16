import React, { useEffect, useState } from 'react';
import { Modal, Form, Spin, AutoComplete, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getEssayType, postEssayName } from '../../../../../store/slices/candidates/essayTypeSlice';
import { useParams, useNavigate } from 'react-router';
import { selectedCandidateInfo } from '../../../../../store/slices/candidates/selectedCandidateSlice';
import IntlMessage from '../../../../../components/util-components/IntlMessage';
import LocalizationText from '../../../../../components/util-components/LocalizationText/LocalizationText';

const ModalChooseEssay = ({ modalCase, openModal }) => {
    const [open, setOpen] = useState(false);
    const { id } = useParams();
    const dispatch = useDispatch();
    const [value, setValue] = useState(null);
    const [essay_id, setEssayId] = useState(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const get_essay_type = useSelector((state) => state.essayType.data);
    const [selectedValue, setSelectedValue] = useState(null);
    const navigate = useNavigate();

    function handleCancel() {
        setOpen(false);
        modalCase.showModal(open);
    }

    const findByName = (name, arr) => {
        return arr.find((item) => item.name === name);
    };

    useEffect(() => {
        dispatch(getEssayType());
    }, [dispatch]);

    const onSelect = (data, option) => {
        setEssayId(findByName(option.value, get_essay_type).id);
    };

    const onOk = async () => {
        try {
            setLoading(true);

            await form.validateFields(); // Валидация формы
            const data = [id, value, essay_id];
            await dispatch(postEssayName(data))
                .then(() => {
                    form.resetFields();
                    dispatch(selectedCandidateInfo(id));
                    handleCancel();
                    modalCase.showModal(open);
                })
                .finally(() => {
                    setLoading(false);
                });
        } catch (error) {
            setLoading(false);
            message.error('Пожалуйста, заполните обязательные поля');
        }
    };

    return (
        <div>
            <Modal
                title={<IntlMessage id={'candidates.title.essay_title'} />}
                open={openModal}
                onCancel={handleCancel}
                onOk={onOk}
                okText={<IntlMessage id={'candidates.title.send'} />}
                cancelText={<IntlMessage id={'candidates.warning.cancel'} />}
                style={{ height: '100%', width: '100%' }}
            >
                <Spin spinning={loading} size="large">
                    <Form form={form} layout={'vertical'}>
                        <Form.Item
                            label={<IntlMessage id={'candidates.title.chooseEssay'} />}
                            name="essayTopic"
                            rules={[
                                {
                                    required: true,
                                    message: <IntlMessage id={'candidates.title.must'} />,
                                },
                            ]}
                        >
                            <AutoComplete
                                style={{ width: '100%' }}
                                options={get_essay_type.map((item) => ({
                                    value: item.name,
                                    label: <LocalizationText text={item} />,
                                }))}
                                value={value}
                                onSelect={onSelect}
                                onSearch={(text) => setValue(text)}
                                filterOption={(inputValue, option) =>
                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                                    -1
                                }
                            />
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        </div>
    );
};

export default ModalChooseEssay;
