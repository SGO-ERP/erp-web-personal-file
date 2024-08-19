import React, { useEffect, useState } from 'react';

import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    notification,
    Row,
    Select,
    Space,
    Typography,
} from 'antd';

import IntlMessage, {
    IntlMessageText,
} from '../../../../../../../components/util-components/IntlMessage';
import ModalCompletedSchedule from '../modals/ModalCompletedSchedule';
import { PrivateServices } from '../../../../../../../API';
import { components } from '../../../../../../../API/types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { APP_PREFIX_PATH } from '../../../../../../../configs/AppConfig';
import LocalizationText, {
    LocalText,
} from '../../../../../../../components/util-components/LocalizationText/LocalizationText';
import { getLessonsBsp } from '../../../../../../../store/slices/bsp/month-plan/tableMonthPlanSlice';
import { useAppDispatch } from '../../../../../../../hooks/useStore';
import moment, { Moment } from 'moment';
import { ClockCircleOutlined } from '@ant-design/icons';
import { setWeeks } from '../../../../../../../store/slices/bsp/month-plan/ListUsersData';
import '../forms/index.css';
import { addCustomzationData } from '../../../../../../../store/slices/bsp/month-plan/listPresentUsers';
const { Option } = Select;

interface Props {
    chooseItem: components['schemas']['ScheduleYearRead'] | undefined;
}

const SettingClasses = ({ chooseItem }: Props) => {
    const [form] = Form.useForm();

    const [isOpen, setIsOpen] = useState(false);
    const [isInstructor, setIDInstractor] = useState<components['schemas']['PositionRead'][]>([]);
    const [instructors, setInstructors] = useState<
        components['schemas']['schemas__user__UserRead'][]
    >([]);
    const [searchParams] = useSearchParams();
    const yearId = searchParams.get('schedule_year_id');
    const navigate = useNavigate();
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [staffDivInfo, setStaffDivInfo] = useState<components['schemas']['ScheduleYearRead']>();
    const [eachStaffDivInfo, setEachStaffDivInfo] =
        useState<components['schemas']['StaffDivisionRead']>();
    const [places, setPlaces] = useState<components['schemas']['PlaceRead'][]>([]);
    const dispatch = useAppDispatch();
    const month = searchParams.get('month');
    const schedule_year_id = searchParams.get('schedule_year_id');
    const edit = 'edit';

    const handleSelectChange = (selected: string[]) => {
        setSelectedDays(selected);
    };

    const time = [
        { id: 1, time: '06:00' },
        { id: 2, time: '06:30' },
        { id: 3, time: '07:00' },
        { id: 4, time: '07:30' },
        { id: 5, time: '08:00' },
        { id: 6, time: '08:30' },
        { id: 7, time: '09:00' },
        { id: 8, time: '09:30' },
        { id: 9, time: '10:00' },
        { id: 10, time: '10:30' },
        { id: 11, time: '11:00' },
        { id: 12, time: '11:30' },
        { id: 13, time: '12:00' },
        { id: 14, time: '12:30' },
        { id: 15, time: '13:00' },
        { id: 16, time: '13:30' },
        { id: 17, time: '14:00' },
        { id: 18, time: '14:30' },
        { id: 19, time: '15:00' },
        { id: 20, time: '15:30' },
        { id: 21, time: '16:00' },
        { id: 22, time: '16:30' },
        { id: 23, time: '17:00' },
        { id: 24, time: '17:30' },
        { id: 25, time: '18:00' },
        { id: 26, time: '18:30' },
        { id: 27, time: '19:00' },
        { id: 28, time: '19:30' },
        { id: 29, time: '20:00' },
        { id: 30, time: '20:30' },
        { id: 31, time: '21:00' },
        { id: 32, time: '21:30' },
        { id: 33, time: '22:00' },
    ];
    const [toTime, setToTime] = useState(time);

    useEffect(() => {
        if (yearId) {
            PrivateServices.get('/api/v1/schedule_year/{id}/', {
                params: {
                    path: {
                        id: yearId,
                    },
                },
            }).then((response) => {
                if (response.data) {
                    setStaffDivInfo(response.data);
                }
            });
        }
    }, [yearId]);

    useEffect(() => {
        PrivateServices.get('/api/v1/place', {
            params: {
                query: {
                    skip: 0,
                    limit: 100,
                },
            },
        }).then((response) => {
            if (response.data) {
                setPlaces(response.data);
            }
        });
    }, []);

    useEffect(() => {
        PrivateServices.get('/api/v1/positions', {
            params: {
                query: {
                    skip: 0,
                    limit: 100,
                },
            },
        }).then((response) => {
             if (response.data?.objects) {
                const filtered: components['schemas']['PositionRead'][] = response.data.objects.filter(
                    (item) => item.name === 'Инструктор'
                );
                setIDInstractor(filtered);
            }
        });
    }, []);

    useEffect(() => {
        if (isInstructor.length > 0) {
            const instructorId = isInstructor[0]?.id ?? ''; // Provide a default value of an empty string if it's undefined
            PrivateServices.get('/api/v1/users/position/{id}', {
                params: {
                    path: {
                        id: instructorId,
                    },
                },
            }).then((response) => {
                if (response.data) {
                    setInstructors(response.data);
                }
            });
        }
    }, [isInstructor]);

    const onFinish = (values: any) => {
        if (yearId !== null) {
            const daysArray = selectedDays.map((day) => {
                return {
                    day: day,
                    start_time: time.find((t) => t.id === values[day]?.time1)?.time,
                    end_time: time.find((t) => t.id === values[day]?.time2)?.time,
                };
            });

            const data = {
                start_date: values.dayClasses[0].format('YYYY-MM-DD'),
                end_date: values.dayClasses[1].format('YYYY-MM-DD'),
                place_id: values.placeClasses,
                schedule_id: yearId,
                days: daysArray,
                instructor_ids: values.instructorClasses,
            };
            dispatch(addCustomzationData(data));
            dispatch(setWeeks(selectedDays.map((item) => item.toLowerCase())));
            navigate(
                `${APP_PREFIX_PATH}/management/combat-starting-position/list-present-users/?schedule_year_id=${schedule_year_id}&mode=${edit}&start_date=${values.dayClasses[0].format(
                    'YYYY-MM-DD',
                )}&end_date=${values.dayClasses[1].format('YYYY-MM-DD')}`,
            );
        }
    };

    // Функция для проверки, является ли дата вне месяца июня
    const disabledDate = (current: Moment | null) => {
        if (!current) {
            return false;
        }
        return current.format('MMMM') !== month?.toLowerCase() || current < moment().startOf('day');
    };

    useEffect(() => {
        form.resetFields();
        setSelectedDays([]);
    }, [month, form]);

    const onChange = (value: number) => {
        setToTime(time.filter((t) => t.id > value));
    };

    return (
        <>
            <ModalCompletedSchedule
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                staffDivInfo={staffDivInfo}
                eachStaffDivInfo={eachStaffDivInfo}
                month={month}
            />
            <Card>
                <Typography.Title level={4}>
                    <Typography.Text strong>
                        <IntlMessage id={'csp.create.month.plan.form.classes.title'} />
                        &nbsp;
                        {staffDivInfo?.staff_divisions &&
                            staffDivInfo?.staff_divisions.map((item, index) => (
                                <React.Fragment key={item.id}>
                                    <a
                                        onClick={() => {
                                            setEachStaffDivInfo(item);
                                            setIsOpen(true);
                                        }}
                                    >
                                        <LocalizationText text={item} key={item?.id} />
                                    </a>
                                    {staffDivInfo?.staff_divisions &&
                                        index !== staffDivInfo.staff_divisions.length - 1 &&
                                        ', '}
                                </React.Fragment>
                            ))}
                    </Typography.Text>
                    {chooseItem && (
                        <div className={'text-muted'}>
                            (
                            <LocalizationText text={chooseItem?.activity} />)
                        </div>
                    )}
                </Typography.Title>

                <Form
                    form={form}
                    layout={'vertical'}
                    style={{ marginTop: '36px' }}
                    onFinish={onFinish}
                    className={'csp-tags'}
                >
                    <Form.Item
                        name="dayClasses"
                        label={<IntlMessage id={'csp.create.month.plan.form.classes.day'} />}
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={'candidates.title.must'} />,
                            },
                        ]}
                    >
                        <DatePicker.RangePicker
                            style={{ width: '100%' }}
                            disabledDate={disabledDate}
                            placeholder={[
                                IntlMessageText.getText({
                                    id: 'start',
                                }),
                                IntlMessageText.getText({
                                    id: 'end',
                                }),
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        name="dayEveryClasses"
                        label={<IntlMessage id={'csp.create.month.plan.form.classes.day.every'} />}
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={'candidates.title.must'} />,
                                type: 'array',
                            },
                        ]}
                    >
                        <Select mode="multiple" onChange={handleSelectChange}>
                            <Option value="Понедельник">
                                <IntlMessage id={'monday'} />
                            </Option>
                            <Option value="Вторник">
                                <IntlMessage id={'tuesday'} />
                            </Option>
                            <Option value="Среда">
                                <IntlMessage id={'wednesday'} />
                            </Option>
                            <Option value="Четверг">
                                <IntlMessage id={'thursday'} />
                            </Option>
                            <Option value="Пятница">
                                <IntlMessage id={'friday'} />
                            </Option>
                            <Option value="Суббота">
                                <IntlMessage id={'saturday'} />
                            </Option>
                            <Option value="Воскресенье">
                                <IntlMessage id={'sunday'} />
                            </Option>
                        </Select>
                    </Form.Item>

                    {selectedDays.map((day) => (
                        <Form.Item
                            key={day}
                            label={
                                <>
                                    <IntlMessage id={'csp.create.month.plan.form.classes.time'} />{' '}
                                    {day}
                                </>
                            }
                        >
                            <Row gutter={16}>
                                <Col xs={12}>
                                    <Form.Item
                                        name={[day, 'time1']}
                                        rules={[
                                            {
                                                required: true,
                                                message: (
                                                    <IntlMessage id={'candidates.title.must'} />
                                                ),
                                            },
                                        ]}
                                    >
                                        <Select
                                            options={time.map((item) => ({
                                                value: item.id,
                                                label: item.time,
                                            }))}
                                            onChange={onChange}
                                            placeholder={
                                                <>
                                                    <ClockCircleOutlined /> &nbsp;{' '}
                                                    <IntlMessage
                                                        id={'csp.timepicker.placeholder'}
                                                    />
                                                </>
                                            }
                                            allowClear
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={12}>
                                    <Form.Item
                                        name={[day, 'time2']}
                                        rules={[
                                            {
                                                required: true,
                                                message: (
                                                    <IntlMessage id={'candidates.title.must'} />
                                                ),
                                            },
                                        ]}
                                    >
                                        <Select
                                            options={toTime.map((item) => ({
                                                value: item.id,
                                                label: item.time,
                                            }))}
                                            placeholder={
                                                <>
                                                    <ClockCircleOutlined /> &nbsp;{' '}
                                                    <IntlMessage
                                                        id={'csp.timepicker.placeholder'}
                                                    />
                                                </>
                                            }
                                            allowClear
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form.Item>
                    ))}

                    <Form.Item
                        name="placeClasses"
                        label={<IntlMessage id={'csp.create.month.plan.form.classes.place'} />}
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={'candidates.title.must'} />,
                            },
                        ]}
                    >
                        <Select
                            options={places.map((item) => ({
                                value: item.id,
                                label: LocalText.getName(item),
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        name="instructorClasses"
                        label={<IntlMessage id={'csp.create.month.plan.form.classes.instructor'} />}
                    >
                        <Select
                            mode={'multiple'}
                            options={instructors.map((item) => ({
                                value: item.id,
                                label: item?.father_name
                                    ? item?.first_name +
                                      ' ' +
                                      item?.last_name?.charAt(0) +
                                      '.' +
                                      item?.father_name?.charAt(0) +
                                      '.'
                                    : item?.first_name + ' ' + item?.last_name?.charAt(0) + '.',
                            }))}
                        />
                    </Form.Item>
                    <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Space>
                            <Button
                                htmlType="reset"
                                onClick={() => {
                                    navigate(
                                        `${APP_PREFIX_PATH}/management/combat-starting-position/month-plan/`,
                                    );
                                }}
                                danger
                            >
                                <IntlMessage id={'csp.create.month.plan.form.classes.exit'} />
                            </Button>
                            <Button type="primary" htmlType="submit">
                                <IntlMessage
                                    id={'csp.create.month.plan.table.second.column.last'}
                                />
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </>
    );
};

export default SettingClasses;
