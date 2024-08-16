import { QuestionCircleFilled } from '@ant-design/icons/lib/icons';
import { Form, Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { change } from 'store/slices/schedule/archiveStaffDivision';
import { embedStaffUnitNode, findSubDivisionNode } from 'utils/schedule/utils';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import { useAppDispatch, useAppSelector } from '../../../../../../hooks/useStore';
import {
    addLocalStaffFunction,
    addRemoteStaffFunction,
    editLocalStaffFunction,
    editRemoteStaffFunction,
} from 'store/slices/schedule/Edit/staffFunctions';

const ModalEditPositionFunction = ({ isOpen, onClose, staffUnit, _function }) => {
    const archiveStaffDivision = useAppSelector((state) => state.archiveStaffDivision.data);

    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const LOCAL_archiveStaffFunction = useAppSelector((state) => state.editStaffFunction.local);
    const REMOTE_archiveStaffFunction = useAppSelector((state) => state.editStaffFunction.remote);
    const [hours, setHours] = useState();

    const handleOk = async () => {
        const { name, nameKZ, hours } = await form.validateFields();
        const isLocal = _function
            ? Object.prototype.hasOwnProperty.call(_function, 'isLocal')
            : true;
        const isParentLocal = Object.prototype.hasOwnProperty.call(staffUnit, 'isLocal');
        const newStaffFunction = {
            ...(isLocal && { isLocal: true }),
            isParentLocal: isParentLocal,
            id: _function.id,
            name,
            nameKZ: nameKZ,
            hours_per_week: hours,
            staff_unit_id: staffUnit.id,
            discriminator: _function.discriminator,
        };

        if (isLocal) {
            const isExists = LOCAL_archiveStaffFunction.find((item) => _function?.id === item?.id);
            if (!isExists) dispatch(addLocalStaffFunction(newStaffFunction));
            else dispatch(editLocalStaffFunction(newStaffFunction));
        } else {
            const isExists = REMOTE_archiveStaffFunction.find((item) => _function.id === item.id);
            if (isExists) dispatch(editRemoteStaffFunction(newStaffFunction));
            else dispatch(addRemoteStaffFunction(newStaffFunction));
        }
        const found = findSubDivisionNode(archiveStaffDivision, staffUnit.staff_division_id);
        dispatch(
            change(
                embedStaffUnitNode(
                    {
                        ...staffUnit,
                        staff_functions: staffUnit?.staff_functions?.map((_function) => {
                            if (_function.id === newStaffFunction.id) {
                                return newStaffFunction;
                            }
                            return _function;
                        }),
                    },
                    found,
                    archiveStaffDivision,
                ),
            ),
        );
        form.resetFields();
        onClose();
    };

    function handleCancel() {
        onClose();
        form.resetFields();
    }

    useEffect(() => {
        form.setFieldsValue({
            name: _function?.name,
            nameKZ: _function?.nameKZ,
            hours: _function?.hours_per_week,
        });
    }, [_function, isOpen]);

    return (
        <div>
            <Modal
                title={<IntlMessage id={'staffSchedule.modal.addEditPositionFunction'} />}
                open={isOpen}
                onCancel={handleCancel}
                onOk={handleOk}
                okText={<IntlMessage id="staffSchedule.save" />}
                cancelText={<IntlMessage id="staffSchedule.cancel" />}
                okButtonProps={{
                    disabled: hours > 168,
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label={
                            <>
                                <IntlMessage id="staffSchedule.modal.nameOfPositionFunctionKz" />
                                <QuestionCircleFilled
                                    style={{
                                        color: ' rgba(114, 132, 154, 0.4)',
                                        marginLeft: '5px',
                                    }}
                                />
                            </>
                        }
                        name="nameKZ"
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={'candidates.title.must'} />,
                            },
                        ]}
                        required
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={
                            <>
                                <IntlMessage id="staffSchedule.modal.nameOfPositionFunction" />
                                <QuestionCircleFilled
                                    style={{
                                        color: ' rgba(114, 132, 154, 0.4)',
                                        marginLeft: '5px',
                                    }}
                                />
                            </>
                        }
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={'candidates.title.must'} />,
                            },
                        ]}
                        required
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={
                            <>
                                <IntlMessage id="hoursePerWeek" />
                                <QuestionCircleFilled
                                    style={{
                                        color: ' rgba(114, 132, 154, 0.4)',
                                        marginLeft: '5px',
                                    }}
                                />
                            </>
                        }
                        name="hours"
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={'candidates.title.must'} />,
                            },
                            {
                                validator: (_, value) =>
                                    value > 168 || value < 1
                                        ? Promise.reject(
                                              new Error(
                                                  localStorage.getItem('lan') === 'ru'
                                                      ? 'Максимальные часы в неделю 168 и минимум 1'
                                                      : 'Аптасына ең көбі 168 сағат және минимум 1',
                                              ),
                                          )
                                        : Promise.resolve(),
                            },
                        ]}
                        onChange={(e) => setHours(e.target.value)}
                        required
                    >
                        <Input
                            onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default ModalEditPositionFunction;
