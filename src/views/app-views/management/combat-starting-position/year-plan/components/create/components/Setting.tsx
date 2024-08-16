import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
    Button,
    Card,
    Checkbox,
    Col,
    Form,
    Row,
    Select,
    Space,
    Table,
    Tag,
    Typography,
} from 'antd';
import { SelectValue } from 'antd/lib/select'; // Импортируем тип CustomTagProps
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { DataNode } from 'antd/lib/tree';

import IntlMessage from '../../../../../../../../components/util-components/IntlMessage';
import { PrivateServices } from '../../../../../../../../API';
import { components } from '../../../../../../../../API/types';
import LocalizationText, {
    LocalText,
} from '../../../../../../../../components/util-components/LocalizationText/LocalizationText';
import { useAppDispatch, useAppSelector } from '../../../../../../../../hooks/useStore';
import {
    addLocalScheduleYear,
    removeLocalScheduleYear,
    removeRemoteScheduleYear,
} from '../../../../../../../../store/slices/bsp/create/scheduleYear';
import { getPlanStaffDiv } from '../../../../../../../../store/slices/bsp/create/tableByStaffDivisionSlice';
import '../../../../month-plan/components/forms/index.css';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;
const { Option } = Select;

interface Props {
    info: DataNode[];
    value: string;
    node: any;
}

interface Month {
    value: number;
    name: string;
    nameKZ: string;
}

const Setting = ({ info, value, node }: Props) => {
    const [form] = Form.useForm();

    const [check, setCheck] = useState(false);

    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const bsp_plan_id = searchParams.get('bsp-plan-id');
    const year = searchParams.get('year');
    const removeScheduelYear = useAppSelector((state) => state.scheduleYear.remove);

    const arrayStaffDiv = useAppSelector((state) => state.staffDivScheduleYear.data);
    const loading = useAppSelector((state) => state.staffDivScheduleYear.loading);
    const [dataSource, setDataSource] = useState<components['schemas']['ScheduleYearRead'][]>([]);
    const [filteredMainArray, setFilteredArray] = useState<DataNode[]>([]);
    const [selectedMonths, setSelectedMonths] = useState<SelectValue[]>([]);
    const currentMonth = new Date().getMonth();
    const { i18n } = useTranslation();
    const currentLocale = i18n.language;
    const [displayedMonths, setDisplayedMonths] = useState<Month[]>([]);
    const [activity, setActivity] = useState<components['schemas']['ActivityRead']>();
    const [disabled,setDisabled]=useState<boolean>(false);

    const months = [
        { value: 1, name: 'Январь', nameKZ: 'Қаңтар' },
        { value: 2, name: 'Февраль', nameKZ: 'Ақпан' },
        { value: 3, name: 'Март', nameKZ: 'Наурыз' },
        { value: 4, name: 'Апрель', nameKZ: 'Сәуір' },
        { value: 5, name: 'Май', nameKZ: 'Мамыр' },
        { value: 6, name: 'Июнь', nameKZ: 'Маусым' },
        { value: 7, name: 'Июль', nameKZ: 'Шілде' },
        { value: 8, name: 'Август', nameKZ: 'Тамыз' },
        { value: 9, name: 'Сентябрь', nameKZ: 'Құркүйек' },
        { value: 10, name: 'Октябрь', nameKZ: 'Қазан' },
        { value: 11, name: 'Ноябрь', nameKZ: 'Қараша' },
        { value: 12, name: 'Декабрь', nameKZ: 'Желтоқсан' },
    ];

    const currentYear = new Date().getFullYear().toString();

    useEffect(() => {
        const childIds = info.flatMap((item) =>
            item.children ? item.children.map((child) => child.key) : [],
        );

        if (childIds.find((child) => child === node.key)) {
            const filteredArray = info.filter((item) => {
                if (item.children) {
                    return !item.children.some((child) => child.key === node.key);
                }
                return true;
            });
            setFilteredArray(filteredArray);
        } else {
            setFilteredArray(info.filter((item) => !childIds.includes(item.key)));
        }
    }, [info]);

    useEffect(() => {
        if (arrayStaffDiv) {
            const transformedData: components['schemas']['ScheduleYearRead'][] = [];

            arrayStaffDiv?.forEach((item) => {
                item.staff_divisions?.forEach((staffDivision) => {
                    filteredMainArray?.map((key) => {
                        if (key.key === staffDivision.id) {
                            transformedData.push({
                                ...item,
                                staff_divisions: [staffDivision],
                            });
                        }
                    });
                });
            });
            const compareByName = (
                a: components['schemas']['ScheduleYearRead'],
                b: components['schemas']['ScheduleYearRead'],
            ): number => {
                if (a?.staff_divisions?.[0].name && b?.staff_divisions?.[0].name) {
                    if (a.staff_divisions[0].name < b.staff_divisions[0].name) {
                        return -1;
                    }
                    if (a.staff_divisions[0].name > b.staff_divisions[0].name) {
                        return 1;
                    }
                    // Если имена равны, учитываем порядок следования элементов
                    return 0;
                }
                return 0;
            };

            const sortedArray: components['schemas']['ScheduleYearRead'][] =
                transformedData.sort(compareByName);
            // Create a Set to keep track of unique id and name combinations
            const uniqueSet = new Set<string>();

            // Filter the data array to include only unique id and name combinations
            const filteredData = sortedArray.filter((item) => {
                const key = `${item.id}-${item?.staff_divisions?.[0]?.name}`;
                if (!uniqueSet.has(key)) {
                    uniqueSet.add(key);
                    return true;
                }
                return false;
            });
            setDataSource(filteredData);
        } else {
            setDataSource([]);
        }
    }, [arrayStaffDiv]);

    // Функция для вычисления rowSpan для каждой ячейки имени
    const calculateRowSpan = (): number[] => {
        const rowSpans: number[] = [];
        let prevName = '';

        if (dataSource !== undefined) {
            dataSource.forEach((item, index) => {
                if (item?.staff_divisions !== undefined) {
                    const name = item.staff_divisions[0]?.name;

                    if (name !== undefined) {
                        if (index === 0 || name !== prevName) {
                            rowSpans.push(1);
                        } else {
                            rowSpans[rowSpans.length - 1]++;
                        }

                        prevName = name;
                    }
                }
            });
        }
        return rowSpans;
    };

    // Получаем массив rowSpan для каждой ячейки имени
    const rowSpans = calculateRowSpan();

    useEffect(() => {
        if (bsp_plan_id) {
            dispatch(getPlanStaffDiv({ filteredMainArray, bsp_plan_id }));
        }
    }, [filteredMainArray]);

    const deleteYearPlan = (record: components['schemas']['ScheduleYearRead']) => {
        if (
            record?.id !== undefined &&
            dataSource !== undefined &&
            record?.staff_divisions?.[0].id
        ) {
            dispatch(
                removeRemoteScheduleYear({
                    id: record?.id,
                    division_id: record?.staff_divisions?.[0].id,
                }),
            );
        }
    };

    const columns = [
        {
            title: <IntlMessage id={'csp.create.year.plan.setting.table.column.first'} />,
            dataIndex: 'staff_divisions',
            // render: (
            //     staff_divisions?: {
            //         name: string;
            //     }[],
            //     row: components['schemas']['ScheduleYearRead'],
            //     index: number,
            // ) => {
            //     if (
            //         index ===
            //         dataSource?.findIndex(
            //             (d) =>
            //                 d?.staff_divisions &&
            //                 d?.staff_divisions[0]?.name === staff_divisions?.[0]?.name,
            //         )
            //     ) {
            //         return {
            //             children: staff_divisions?.[0].name,
            //             props: {
            //                 rowSpan: rowSpans[index],
            //             },
            //         };
            //     } else {
            //         return {
            //             children: null,
            //             props: {
            //                 rowSpan: 0,
            //             },
            //         };
            //     }
            // },
            render: (_: string, record: components['schemas']['ScheduleYearRead']) => (
                <div>
                    {record?.staff_divisions && LocalText.getName(record?.staff_divisions[0])}
                </div>
            ),
        },
        {
            title: <IntlMessage id={'csp.create.year.plan.setting.table.column.second'} />,
            dataIndex: 'activity',
            key: 'activity',
            render: (_: string, record: components['schemas']['ScheduleYearRead']) => (
                <div>{record?.activity && LocalText.getName(record?.activity)}</div>
            ),
            width: '30%',
        },
        {
            title: <IntlMessage id={'csp.create.year.plan.setting.table.column.third'} />,
            dataIndex: 'activity_months',
            key: 'activity_months',
            render: (_: string, record: components['schemas']['ScheduleYearRead']) => (
                <>
                    {record?.activity_months?.map((item) => {
                        return (
                            <>
                                <Tag
                                    style={{
                                        marginRight: '5px',
                                        marginTop: '10px',
                                        color:
                                            item.name === 'Январь' ||
                                            item.name === 'Февраль' ||
                                            item.name === 'Декабрь'
                                                ? '#366EF6'
                                                : item.name === 'Март' ||
                                                  item.name === 'Май' ||
                                                  item.name === 'Апрель'
                                                ? '#A0D911'
                                                : item.name === 'Июнь' ||
                                                  item.name === 'Июль' ||
                                                  item.name === 'Август'
                                                ? '#52C41A'
                                                : item.name === 'Сентябрь' ||
                                                  item.name === 'Октябрь' ||
                                                  item.name === 'Ноябрь'
                                                ? '#FAAD14'
                                                : 'white',
                                        borderColor:
                                            item.name === 'Январь' ||
                                            item.name === 'Февраль' ||
                                            item.name === 'Декабрь'
                                                ? '#91D5FF'
                                                : item.name === 'Март' ||
                                                  item.name === 'Май' ||
                                                  item.name === 'Апрель'
                                                ? '#EAFF8F'
                                                : item.name === 'Июнь' ||
                                                  item.name === 'Июль' ||
                                                  item.name === 'Август'
                                                ? '#B7EB8F'
                                                : item.name === 'Сентябрь' ||
                                                  item.name === 'Октябрь' ||
                                                  item.name === 'Ноябрь'
                                                ? '#FFD591'
                                                : 'white',
                                        backgroundColor:
                                            item.name === 'Январь' ||
                                            item.name === 'Февраль' ||
                                            item.name === 'Декабрь'
                                                ? '#3E79F71A'
                                                : item.name === 'Март' ||
                                                  item.name === 'Май' ||
                                                  item.name === 'Апрель'
                                                ? '#FCFFE6'
                                                : item.name === 'Июнь' ||
                                                  item.name === 'Июль' ||
                                                  item.name === 'Август'
                                                ? '#F6FFED'
                                                : item.name === 'Сентябрь' ||
                                                  item.name === 'Октябрь' ||
                                                  item.name === 'Ноябрь'
                                                ? '#FFF7E6'
                                                : 'white',
                                        borderRadius: '10px',
                                    }}
                                >
                                    {LocalText.getName(item).substring(0, 3)}
                                </Tag>
                            </>
                        );
                    })}
                </>
            ),
            width: '30%',
        },
        {
            title: <IntlMessage id={'csp.create.year.plan.setting.table.column.fourth'} />,
            dataIndex: 'exam',
            key: 'exam',
            render: (_: string, record: components['schemas']['ScheduleYearRead']) => (
                <>
                    {record?.is_exam_required === true
                        ? record?.exam_months?.map((item) => {
                              return (
                                  <>
                                      <Tag
                                          style={{
                                              marginRight: '5px',
                                              marginTop: '10px',
                                              color:
                                                  item.name === 'Январь' ||
                                                  item.name === 'Февраль' ||
                                                  item.name === 'Декабрь'
                                                      ? '#366EF6'
                                                      : item.name === 'Март' ||
                                                        item.name === 'Май' ||
                                                        item.name === 'Апрель'
                                                      ? '#A0D911'
                                                      : item.name === 'Июнь' ||
                                                        item.name === 'Июль' ||
                                                        item.name === 'Август'
                                                      ? '#52C41A'
                                                      : item.name === 'Сентябрь' ||
                                                        item.name === 'Октябрь' ||
                                                        item.name === 'Ноябрь'
                                                      ? '#FAAD14'
                                                      : 'white',
                                              borderColor:
                                                  item.name === 'Январь' ||
                                                  item.name === 'Февраль' ||
                                                  item.name === 'Декабрь'
                                                      ? '#91D5FF'
                                                      : item.name === 'Март' ||
                                                        item.name === 'Май' ||
                                                        item.name === 'Апрель'
                                                      ? '#EAFF8F'
                                                      : item.name === 'Июнь' ||
                                                        item.name === 'Июль' ||
                                                        item.name === 'Август'
                                                      ? '#B7EB8F'
                                                      : item.name === 'Сентябрь' ||
                                                        item.name === 'Октябрь' ||
                                                        item.name === 'Ноябрь'
                                                      ? '#FFD591'
                                                      : 'white',
                                              backgroundColor:
                                                  item.name === 'Январь' ||
                                                  item.name === 'Февраль' ||
                                                  item.name === 'Декабрь'
                                                      ? '#3E79F71A'
                                                      : item.name === 'Март' ||
                                                        item.name === 'Май' ||
                                                        item.name === 'Апрель'
                                                      ? '#FCFFE6'
                                                      : item.name === 'Июнь' ||
                                                        item.name === 'Июль' ||
                                                        item.name === 'Август'
                                                      ? '#F6FFED'
                                                      : item.name === 'Сентябрь' ||
                                                        item.name === 'Октябрь' ||
                                                        item.name === 'Ноябрь'
                                                      ? '#FFF7E6'
                                                      : 'white',
                                              borderRadius: '10px',
                                          }}
                                      >
                                          {LocalText.getName(item).substring(0, 3)}
                                      </Tag>
                                  </>
                              );
                          })
                        : '-'}
                </>
            ),
            width: '30%',
        },
        {
            title: <IntlMessage id={'letters.historytable.actions'} />,
            dataIndex: 'actions',
            key: 'actions',
            render: (_: string, record: components['schemas']['ScheduleYearRead']) => (
                <Button
                    type={'text'}
                    onClick={() => deleteYearPlan(record)}
                    style={{ color: '#366EF6' }}
                >
                    <IntlMessage id={'initiate.deleteAll'} />
                </Button>
            ),
        },
    ];
    type Errors = Partial<{
        monthClasses: string;
        monthClassesOffsets: string;
        offsetsAttempts: string;
    }>;

    const saveScheduelYear = async () => {
        setCheck(false);
        const values = form.getFieldsValue();
        // Проверяем поля на заполненность, если есть ошибки, ничего не делаем
        const errors: Errors = {};

        if (!values.monthClasses || values.monthClasses.length === 0) {
            errors.monthClasses = 'Выберите месяцы';
        }

        if (check) {
            if (!values.monthClassesOffsets || values.monthClassesOffsets.length === 0) {
                errors.monthClassesOffsets = 'Выберите месяцы для оффсетов';
            }

            if (!values.offsetsAttempts) {
                errors.offsetsAttempts = 'Выберите количество попыток для оффсетов';
            }
        }

        // Обновляем состояние ошибок валидации
        if (Object.keys(errors).length > 0) {
            return;
        }
        if (bsp_plan_id !== null) {
            setDisabled(true);
            const isCheckTrue = {
                ...(check && {
                    exam_months: values.monthClassesOffsets,
                    retry_count: values.offsetsAttempts,
                }),
            };

            const keys: string[] = filteredMainArray.map((item) => {
                return String(item.key);
            });

            const data = {
                is_exam_required: check,
                plan_id: bsp_plan_id,
                activity_id: value,
                activity_months: values.monthClasses,
                staff_division_ids: keys,
                ...isCheckTrue,
            };

            await PrivateServices.post('/api/v1/schedule_year/', {
                body: data,
            }).then(async (responce) => {
                if (responce?.data) {
                    dispatch(addLocalScheduleYear(responce.data));
                    await dispatch(getPlanStaffDiv({ filteredMainArray, bsp_plan_id }));
                    setDisabled(false);
                }
            });

            form.resetFields();
        }
    };

    const handleReset = () => {
        setCheck(false);
        if (dataSource) {
            dataSource.map((item) => {
                if (item.id && item?.staff_divisions?.[0].id) {
                    dispatch(
                        removeRemoteScheduleYear({
                            id: item?.id,
                            division_id: item?.staff_divisions?.[0].id,
                        }),
                    );
                }
            });
        }
    };

    const handleMonthChange = (month: SelectValue[]) => {
        setSelectedMonths(month);
    };

    const compareByValue = (a: Month | undefined, b: Month | undefined) => {
        if (a && b) {
            return a.value - b.value;
        }
        return 0;
    };

    useEffect(() => {
        const result = selectedMonths?.map((month) => months.find((m) => m.name === month));
        const filteredResult = result
            .sort(compareByValue)
            .filter((month) => month !== undefined) as Month[];
        if (filteredResult.length > 0) {
            const firstFilteredValue = filteredResult[0].value;
            const monthsWithGreaterValue = months.filter(
                (month) => month.value >= firstFilteredValue,
            );
            setDisplayedMonths(monthsWithGreaterValue);
        }
    }, [selectedMonths]);

    const monthOptions = months.map((month) => {
        return {
            key: month.value,
            value: month.name,
            label: currentLocale === 'kk' ? month.nameKZ : currentLocale === 'ru' && month.name,
        };
    });

    const filteredMonthOptions = monthOptions.filter(
        (month) => !(year === currentYear && month.key <= currentMonth),
    );

    useEffect(() => {
        PrivateServices.get('/api/v1/activity/{id}/', {
            params: { path: { id: value } },
        }).then((r) => {
            if (r.data !== undefined) {
                setActivity(r.data);
            }
        });
    }, [value]);

    return (
        <Card>
            <Row gutter={[8, 8]}>
                <Col xs={24}>
                    <Typography.Title level={4}>
                        <Text strong>
                            <IntlMessage id={'csp.create.year.plan.setting.title'} />
                        </Text>
                        &nbsp;
                        {filteredMainArray.map((value, index) => (
                            <React.Fragment key={value.key}>
                                {index !== 0 && ', '}
                                {value.title as string}
                            </React.Fragment>
                        ))}
                        &nbsp; ({activity && <LocalizationText text={activity} />})
                    </Typography.Title>
                </Col>
                <Col xs={24}>
                    <Text>
                        <IntlMessage id={'csp.create.year.plan.setting.desc'} />
                    </Text>
                </Col>
            </Row>

            <Row gutter={[8, 8]} style={{ marginTop: '48px', marginBottom: '48px' }}>
                <Col xs={24}>
                    <Typography.Title level={4}>
                        <Text strong>
                            <IntlMessage id={'csp.create.year.plan.setting.table.title'} />
                        </Text>
                    </Typography.Title>
                </Col>
                <Col xs={24}>
                    <Table
                        dataSource={
                            removeScheduelYear
                                ? dataSource.filter(
                                      (item) =>
                                          item?.staff_divisions &&
                                          !item.staff_divisions.some((el) =>
                                              removeScheduelYear.some(
                                                  (removeEl) =>
                                                      removeEl.division_id === el.id &&
                                                      removeEl.id === item.id,
                                              ),
                                          ),
                                  )
                                : dataSource
                        }
                        columns={columns}
                        loading={loading}
                        bordered
                    />
                </Col>
            </Row>

            <Form
                form={form}
                layout={'vertical'}
                onFinish={() => saveScheduelYear()}
                className={'csp-tags'}
            >
                <Form.Item
                    name="monthClasses"
                    label={<IntlMessage id={'csp.create.year.plan.setting.form.first.question'} />}
                    rules={[
                        {
                            required: true,
                            message: <IntlMessage id={'candidates.title.must'} />,
                            type: 'array',
                        },
                    ]}
                >
                    <Select
                        mode="multiple"
                        onChange={handleMonthChange}
                        options={filteredMonthOptions}
                    />
                </Form.Item>

                <Form.Item name="checkbox-test">
                    <Checkbox onChange={(e) => setCheck(e.target.checked)}>
                        <IntlMessage id={'csp.create.year.plan.setting.form.second.checkbox'} />
                    </Checkbox>
                </Form.Item>

                {check && (
                    <>
                        <Form.Item
                            name="monthClassesOffsets"
                            label={
                                <IntlMessage
                                    id={'csp.create.year.plan.setting.form.third.question'}
                                />
                            }
                            rules={[
                                {
                                    required: true,
                                    message: <IntlMessage id={'candidates.title.must'} />,
                                    type: 'array',
                                },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                options={displayedMonths.map((month) => {
                                    return {
                                        key: month.value,
                                        value: month.name,
                                        label:
                                            currentLocale === 'kk'
                                                ? month.nameKZ
                                                : currentLocale === 'ru' && month.name,
                                    };
                                })}
                            />
                        </Form.Item>

                        <Form.Item
                            name="offsetsAttempts"
                            label={
                                <IntlMessage
                                    id={'csp.create.year.plan.setting.form.fourth.question'}
                                />
                            }
                            rules={[
                                {
                                    required: true,
                                    message: <IntlMessage id={'candidates.title.must'} />,
                                },
                            ]}
                        >
                            <Select>
                                <Option value="0">0 {<IntlMessage id={'zero.attend'} />}</Option>
                                <Option value="1">1 {<IntlMessage id={'first.attend'} />}</Option>
                                <Option value="2">
                                    2 {<IntlMessage id={'csp.list.create.attempt'} />}
                                </Option>
                                <Option value="3">
                                    3 {<IntlMessage id={'csp.list.create.attempt'} />}
                                </Option>
                            </Select>
                        </Form.Item>
                    </>
                )}
                <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Space>
                        <Button htmlType="reset" danger onClick={handleReset} disabled={disabled}>
                            <IntlMessage id={'csp.table.navlink.reset'} />
                        </Button>
                        <Button type="primary" htmlType="submit" disabled={disabled}>
                            <IntlMessage id={'service.data.modalAddPsycho.save'} />
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default Setting;
