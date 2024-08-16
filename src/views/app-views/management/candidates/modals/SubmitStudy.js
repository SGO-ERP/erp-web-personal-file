import { Spin, Form, Input, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ListUsers from '../ListUsers/ListUsers';
import { APP_PREFIX_PATH } from '../../../../../configs/AppConfig';
import {
    candidatesAll,
    updateCandidateById,
} from '../../../../../store/slices/candidates/candidatesSlice';
import { changeCurrentPage } from '../../../../../store/slices/candidates/candidatesTableControllerSlice';
import IntlMessage from '../../../../../components/util-components/IntlMessage';

export default function SubmitStudy({ modalCase, openModal }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { id } = useParams();
    const dispatch = useDispatch();

    const path = `${APP_PREFIX_PATH}/management/candidates/list`;
    const currentPage = useSelector((state) => state.candidatesTableController.currentPage);
    const pageSize = useSelector((state) => state.candidatesTableController.pageSize);

    const [choosedU, setChoosedU] = useState([]);

    const navigate = useNavigate();

    const [form] = Form.useForm();
    const handleCancel = () => {
        setIsModalOpen(false);
        modalCase.showmodalSubmitStudy(isModalOpen);
    };

    const departmentUsers = useSelector((state) => state.candidateHrDoc.data);
    function isDepartment(department) {
        if (department.id === choosedU) {
            message.error('Нельзя выбрать департамент/управление/отделение');
            throw new Error('Нельзя выбрать департамент/управление/отделение');
        }
        department?.children?.forEach((departmentChildren) => {
            isDepartment(departmentChildren);
        });
    }

    function validateDepartmentUsers() {
        if (departmentUsers.length > 0) {
            departmentUsers.forEach((department) => {
                isDepartment(department);
            });
        }
    }

    const onOk = async () => {
        try {
            setLoading(true);
            await form.validateFields(); // Валидация формы
            validateDepartmentUsers();
            const values = await form.getFieldsValue(); // Получение значений полей формы
            const { EDS, user } = values;
            if (EDS !== '123456') {
                message.error(<IntlMessage id={'eds'} />);
                throw new Error(<IntlMessage id={'eds'} />);
            }
            // console.log(user.split(','));
            const data = {
                'staff_unit_curator_id': choosedU,
            };
            // console.log(user[user.length - 1]);
            await dispatch(updateCandidateById({ candidateId: id, data: data })).finally(() => {
                setLoading(false);
            });
            await dispatch(changeCurrentPage({ page: 1, pageSize: 5 }));
            await dispatch(candidatesAll({ page: currentPage, limit: pageSize }));
            navigate(path);
            // Дополнительная логика для сохранения данных
            // handleCancel();
            // modalCase.showModalDigitalSignature2(isModalOpen);
        } catch (error) {
            setLoading(false);
            console.log('Form validation error', error);
        }
    };
    return (
        <div>
            <Modal
                title={<IntlMessage id={'candidates.title.giveCandidate'} />}
                open={openModal}
                onOk={onOk}
                okText={<IntlMessage id={'candidates.title.send'} />}
                cancelText={<IntlMessage id={'candidates.warning.cancel'} />}
                onCancel={handleCancel}
            >
                <Spin spinning={loading} size="large">
                    <Form
                        fields={[
                            {
                                name: ['user'],
                                value: choosedU,
                            },
                        ]}
                        layout={'vertical'}
                        form={form}
                    >
                        <Form.Item
                            label={<IntlMessage id={'candidates.title.chooseNewCurator'} />}
                            name={'user'}
                            rules={[
                                {
                                    required: true,
                                    message: <IntlMessage id={'candidates.title.must'} />,
                                },
                            ]}
                        >
                            <ListUsers ids={choosedU} setIds={setChoosedU} />
                        </Form.Item>

                        <Form.Item
                            label={<IntlMessage id={'candidates.title.password'} />}
                            name={'EDS'}
                            rules={[
                                {
                                    required: true,
                                    message: <IntlMessage id={'candidates.title.must'} />,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        </div>
    );
}
