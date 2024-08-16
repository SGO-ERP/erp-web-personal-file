import { QuestionCircleFilled } from '@ant-design/icons/lib/icons';
import { Form, Input, Modal } from 'antd';
import React, { useState } from 'react';
import { change } from 'store/slices/schedule/archiveStaffDivision';
import uuidv4 from 'utils/helpers/uuid';
import { embedStaffUnitNode, findSubDivisionNode } from 'utils/schedule/utils';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import { useAppDispatch, useAppSelector } from '../../../../../../hooks/useStore';
import { addLocalStaffFunction } from 'store/slices/schedule/Edit/staffFunctions';

const ModalAddPositionFunction = ({ modalCase, openModal, staffUnit, type }) => {
    const archiveStaffDivision = useAppSelector((state) => state.archiveStaffDivision.data);

    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const [hours, setHours] = useState();

    const handleOk = async () => {
        const { name, nameKZ, hours } = await form.validateFields();
        const isParentLocal = Object.prototype.hasOwnProperty.call(staffUnit, 'isLocal');
        const newStaffFunction = {
            isLocal: true,
            isParentLocal: isParentLocal,
            id: uuidv4(),
            name,
            nameKZ: nameKZ,
            hours_per_week: hours,
            staff_unit_id: staffUnit.id,
            discriminator: 'service_staff_function',
        };

        dispatch(addLocalStaffFunction(newStaffFunction));

        const found = findSubDivisionNode(archiveStaffDivision, staffUnit.staff_division_id);
        dispatch(
            change(
                embedStaffUnitNode(
                    {
                        ...staffUnit,
                        staff_functions:
                            type === 'add'
                                ? [...(staffUnit?.staff_functions ?? []), newStaffFunction]
                                : staffUnit?.staff_functions?.map((_function) => {
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
        modalCase.showModalAddPositionFunc(false);
    };

    function handleCancel() {
        modalCase.showModalAddPositionFunc(false);
        form.resetFields();
    }

    return (
        <div>
            <Modal
                title={<IntlMessage id={'staffSchedule.modal.addEditPositionFunction'} />}
                open={openModal}
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
export default ModalAddPositionFunction;
