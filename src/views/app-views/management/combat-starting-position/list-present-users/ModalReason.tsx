import React, { useEffect, useState } from 'react';

import { Button, Col, DatePicker, Form, Modal, Row } from 'antd';
import TextArea from 'antd/es/input/TextArea';

import IntlMessage from '../../../../../components/util-components/IntlMessage';
import AvatarStatus from '../../../../../components/shared-components/AvatarStatus';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/useStore';
import { addData } from '../../../../../store/slices/bsp/month-plan/listPresentUsers';
import { components } from '../../../../../API/types';
import { useSearchParams } from 'react-router-dom';
import { PrivateServices } from '../../../../../API';
import moment, { Moment } from 'moment';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';

interface Props {
    onClose: () => void;
    isOpen: boolean;
    data: components['schemas']['schemas__user__UserRead'] | undefined;
    setCheckboxValue: (value: boolean) => void;
    selectedTable:string;
}

const ModalReason = ({
    isOpen,
    onClose,
    data,
    setCheckboxValue,
    selectedTable
}: Props) => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();

    const [reason, setReason] = useState<string>();
    const [searchParams] = useSearchParams();
    const schedule_year_id = searchParams.get('schedule_year_id');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');
    const mode = searchParams.get('mode');

    const weeks = useSelector((state: RootState) => state.listUserData.weeks);
    const [staffDivInfo, setStaffDivInfo] = useState<components['schemas']['ScheduleYearRead']>();
    const [user, setUser] = useState<components['schemas']['AttendanceReadShort'][]>([]);
    const [date,setDate]=useState<string[]>([]);

    useEffect(() => {
        if (schedule_year_id && data?.id) {

            PrivateServices.get('/api/v1/schedule_year/{id}/',{
                params:{
                    path:{
                        id:schedule_year_id
                    }
                }
            }).then((response)=>{
                if(response.data && response.data.months){
                    const combinedArray = (response?.data?.months[0].days || []).reduce(
                        (accumulator: string[], currentValue) => {
                            if (currentValue && currentValue.activity_dates) {
                                const activityDatesAsString = currentValue.activity_dates.map(
                                    (item) => item.activity_date,
                                );
                                return accumulator.concat(activityDatesAsString);
                            }
                            return accumulator;
                        },
                        [],
                    );
                    setDate(combinedArray);
                }
            });

            PrivateServices.get('/api/v1/attendance/user/absent/{id}/', {
                params: {
                    path: {
                        id: schedule_year_id,
                    },
                    query: {
                        user_id: data?.id,
                    },
                },
            }).then((response) => {
                if (response && response.data) {
                    setUser(response.data);
                }
            });
        }
    }, [isOpen]);

    const disabledDate = (current: Moment | null) => {
        if (mode === 'edit') {
            if (!current) {
                return false;
            }
            const selectedDayOfWeek = current.format('dddd').toLowerCase();
            const isTargetWeekday = weeks.includes(selectedDayOfWeek);
            return (
                current < moment(start_date) ||
                current > moment(end_date).add(1, 'day') ||
                !isTargetWeekday
            );
        } else if (mode === 'read') {
            if(selectedTable==='present'){
                if (!current) {
                    return false;
                }
                return (
                    !date.some((dateObj) => dateObj === current.format('YYYY-MM-DD')) ||
                    user.some((user) => user.attendance_date === current.format('YYYY-MM-DD'))
                );
            } else if (selectedTable==='absent'){
                if (!current) {
                    return false;
                }
                return (
                    !user.some((user) => user.attendance_date === current.format('YYYY-MM-DD'))
                );
            }
        }
        return false;
    };

    useEffect(() => {
        if (schedule_year_id) {
            PrivateServices.get('/api/v1/schedule_year/{id}/', {
                params: {
                    path: {
                        id: schedule_year_id,
                    },
                },
            }).then((response) => {
                if (response.data) {
                    setStaffDivInfo(response.data);
                }
            });
        }
    }, []);

    const onOk = () => {
        const values = form.getFieldsValue();
        const { dayClasses } = values;
        if(selectedTable==='present'){
            if (data?.id && reason && schedule_year_id !== null) {
                const item: components['schemas']['AttendanceChangeStatusWithSchedule'] = {
                    schedule_id: schedule_year_id,
                    attendance_status: 'ABSENT_REASON',
                    user_id: data?.id,
                    reason: reason,
                    activity: staffDivInfo?.activity?.name,
                    date: dayClasses.format('YYYY-MM-DD'),
                };

                dispatch(addData(item));
                form.resetFields();
                onClose();
            }
        } else if(selectedTable==='absent') {
            if (data?.id && reason && schedule_year_id !== null) {
                const item: components['schemas']['AttendanceChangeStatusWithSchedule'] = {
                    schedule_id: schedule_year_id,
                    attendance_status: 'ABSENT',
                    user_id: data?.id,
                    reason: reason,
                    activity: staffDivInfo?.activity?.name,
                    date: dayClasses.format('YYYY-MM-DD'),
                };

                dispatch(addData(item));
                form.resetFields();
                onClose();
            }
        }
    };

    const onCancel = () => {
        onClose();
    };

    return (
        <Modal
            title={<IntlMessage id={'csp.list.users.participant.modal.title'} />}
            open={isOpen}
            onOk={onOk}
            onCancel={onCancel}
            width={'480px'}
            footer={
                <div>
                    <Button type="primary" onClick={() => onOk()}>
                        <IntlMessage id={'continue'} />
                    </Button>
                </div>
            }
        >
            <Form form={form} layout={'vertical'}>
                <Form.Item
                    name="dayClasses"
                    label={<IntlMessage id={'csp.form.modal.reason.title.first'} />}
                    rules={[
                        {
                            required: true,
                            message: <IntlMessage id={'candidates.title.must'} />,
                        },
                    ]}
                >
                    <DatePicker style={{ width: '100%' }} disabledDate={disabledDate} />
                </Form.Item>
                <Form.Item
                    name="reson"
                    label={<IntlMessage id={'csp.form.modal.reason.title.second'} />}
                    rules={[
                        {
                            required: true,
                            message: <IntlMessage id={'candidates.title.must'} />,
                        },
                    ]}
                >
                    <Row gutter={10}>
                        <Col xs={4}>
                            <AvatarStatus src={data?.icon} />
                        </Col>
                        <Col xs={20}>
                            <TextArea
                                onChange={(e) => {
                                    setReason(e.target.value);
                                }}
                            />
                        </Col>
                    </Row>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalReason;
