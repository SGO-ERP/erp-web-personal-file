import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ruLocale from '@fullcalendar/core/locales/ru';
import { Col, DatePicker, Form, Modal, Row, Select } from 'antd';
import './calendar.css';
import moment from 'moment';
import rrulePlugin from '@fullcalendar/rrule';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import { Frequency, RRule } from 'rrule';
import { useDispatch, useSelector } from 'react-redux';
import { addCalendarData, time } from 'store/slices/surveys/surveysSlice';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

type Event = {
    title: string;
    start?: string;
    end?: string;
    rrule?: {
        freq?: Frequency;
        dtstart: Date;
        until: Date;
    };
    duration?: {
        days: number;
    };
    color: string;
    allDay?: boolean;
};

type Props = {
    activeTab: string;
};

const CalendarComponents = ({ activeTab }: Props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [form] = Form.useForm();
    const calendarRef = useRef<FullCalendar | null>(null);
    const dispatch = useDispatch();
    const surveyName = useSelector((state: any) => state.surveys.surveyInfo.nameBlock.name);

    useEffect(() => {
        // update event name when survey name changes
        setEvents((prevEvents) => {
            return prevEvents.map((event) => {
                return {
                    ...event,
                    title: surveyName,
                };
            });
        });
    }, [surveyName]);

    useEffect(() => {
        const interval = setInterval(() => {
            calendarRef.current?.getApi().updateSize();
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const handleOk = async () => {
        // Inside values, there are all the values from the modal
        const values = await form.validateFields();
        dispatch(addCalendarData(values));

        let rruleFreq;
        let isRepeating = true; // A flag to determine if the event is repeating or not

        switch (values.repeat) {
            case 'week':
                rruleFreq = RRule.WEEKLY;
                break;
            case 'month':
                rruleFreq = RRule.MONTHLY;
                break;
            case 'year':
                rruleFreq = RRule.YEARLY;
                break;
            default:
                isRepeating = false; // No repeat selected, the event should not repeat
                break;
        }

        const eventStartDate = values.range[0].clone().utc().startOf('day').toDate();
        const eventEndDate = values.range[1].clone().utc().startOf('day').toDate();

        let event;

        if (isRepeating) {
            event = {
                title: surveyName,
                rrule: {
                    freq: rruleFreq,
                    dtstart: eventStartDate,
                    until: moment().utc().add(1, 'years').toDate(),
                },
                duration: {
                    days: moment(eventEndDate).diff(moment(eventStartDate), 'days'),
                },
                color: '#EEB041',
            };
        } else {
            event = {
                title: surveyName,
                start: moment(eventStartDate).format(),
                end: moment(eventEndDate).format(),
                color: '#EEB041',
                allDay: true,
            };
        }

        setEvents([event]); // Add new event to the events list
        // console.log('event', event);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const [toTime, setToTime] = useState(time);

    const onChange = (value: number) => {
        setToTime(time.filter((t) => t.id > value));
    };

    return (
        <div className="survey-calendar">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, rrulePlugin]}
                initialView="dayGridMonth"
                selectable
                selectMirror
                events={events}
                select={(e: any) => {
                    const start = moment(e.start);
                    const end = moment(e.end);
                    // needs to check if the event is repeating or not
                    form.resetFields();
                    form.setFieldsValue({
                        range: [start, end],
                    });
                    setIsModalVisible(true);
                }}
                timeZone="Asia/Almaty"
                locale={ruLocale}
                ref={calendarRef}
            />
            <Modal
                title={<IntlMessage id={'title.modal.calendar.survey'} />}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="range"
                        label={<IntlMessage id="surveys.toolbar.button.create.addDate" />}
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id="candidates.title.must" />,
                            },
                        ]}
                    >
                        <RangePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col xs={12}>
                            <Form.Item
                                name={['time1']}
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id={'candidates.title.must'} />,
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
                                            <IntlMessage id={'csp.timepicker.placeholder'} />
                                        </>
                                    }
                                    allowClear
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={12}>
                            <Form.Item
                                name={['time2']}
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id={'candidates.title.must'} />,
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
                                            <IntlMessage id={'csp.timepicker.placeholder'} />
                                        </>
                                    }
                                    allowClear
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="repeat"
                        label={<IntlMessage id="surveys.toolbar.button.create.repeat" />}
                    >
                        <Select>
                            <Option value="week">
                                <IntlMessage id="surveys.toolbar.button.create.everyWeek" />
                            </Option>
                            <Option value="month">
                                <IntlMessage id="surveys.toolbar.button.create.everyMonth" />
                            </Option>
                            <Option value="year">
                                <IntlMessage id="surveys.toolbar.button.create.everyYear" />
                            </Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CalendarComponents;
