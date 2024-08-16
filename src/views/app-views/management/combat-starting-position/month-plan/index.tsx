import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';

import {Card, Col, PageHeader, Radio, Row, Select} from 'antd';
import Search from 'antd/es/input/Search';

import IntlMessage, {
    IntlMessageText,
} from '../../../../../components/util-components/IntlMessage';

import LessonTable from './components/tables/LessonTable';
import CreditsTable from './components/tables/CreditsTable';
import SettingClasses from './components/forms/SettingClasses';
import SettingCredit from './components/forms/SettingCredit';
import ClassesBase from './components/baseState/ClassesBase';
import CreditsBase from './components/baseState/CreditsBase';
import {APP_PREFIX_PATH} from '../../../../../configs/AppConfig';
import {useAppDispatch, useAppSelector} from '../../../../../hooks/useStore';
import {RootState} from '../../../../../store';
import {
    getCreditsBsp,
    getLessonsBsp,
} from '../../../../../store/slices/bsp/month-plan/tableMonthPlanSlice';
import {components} from '../../../../../API/types';
import {SelectValue} from 'antd/lib/select';
import {useTranslation} from 'react-i18next';

const {Option} = Select;

const Index = () => {
    const [selectedTable, setSelectedTable] = React.useState<string>('lesson');
    const [searchParams] = useSearchParams();
    const [chooseItem, setChooseItem] = React.useState<components['schemas']['ScheduleYearRead']>();
    const yearId = searchParams.get('schedule_year_id');
    const navigate = useNavigate();
    const lessons_data = useAppSelector(
        (state: RootState) => state.tableMonthPlan.lessons.dataLessons,
    );
    const credits_data = useAppSelector(
        (state: RootState) => state.tableMonthPlan.credits.dataCredits,
    );
    const dispatch = useAppDispatch();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const { i18n } = useTranslation();
    const currentLocale = i18n.language;

    const [year,setYear]=useState<number>(currentYear);
    const [selectedMonths, setSelectedMonths] = useState<SelectValue>(currentMonth + 1);
    const [current, setCurrent] = React.useState<number>(1);
    const [pageSize, setPageSize] = React.useState<number>(10);

    const [currentExam, setCurrentExam] = React.useState<number>(1);
    const [pageSizeExam, setPageSizeExam] = React.useState<number>(10);



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


    const onSearch = (value: string) => {
        if (selectedTable === 'lesson') {
            dispatch(
                getLessonsBsp({
                    query: {
                        skip: (current - 1) * pageSize,
                        limit: pageSize,
                        filter: value,
                        filter_year:year.toString(),
                        filter_month:selectedMonths?.toString(),
                    },
                }),
            );
        } else if (selectedTable === 'credits') {
            dispatch(
                getCreditsBsp({
                    query: {
                        skip: (currentExam - 1) * pageSizeExam,
                        limit: pageSizeExam,
                        filter: value,
                        filter_year:year.toString(),
                        filter_month:selectedMonths?.toString(),
                    },
                }),
            );
        }
    };

    useEffect(() => {
     if (selectedTable === 'credits') {
            dispatch(
                getCreditsBsp({
                    query: {
                        skip: (currentExam - 1) * pageSizeExam,
                        limit: pageSizeExam,
                        filter_year: year.toString(),
                        filter_month: selectedMonths?.toString(),
                    },
                }),
            );
        }
        else if (selectedTable === 'lesson') {
            dispatch(
                getLessonsBsp({
                    query: {
                        skip: (current - 1) * pageSize,
                        limit: pageSize,
                        filter_year: year.toString(),
                        filter_month: selectedMonths?.toString(),
                    },
                }),
            );
        }
    }, [selectedMonths,year,selectedTable]);

    const monthOptions = months.map((month) => {
        return {
            key: month.value,
            value: month.value,
            label: currentLocale === 'kk' ? month.nameKZ : currentLocale === 'ru' && month.name,
        };
    });


    const filteredMonthOptions = monthOptions.filter(
        (month) => !(year === currentYear && month.key <= currentMonth),
    );

    const handleMonthChange = (month: SelectValue) => {
        setSelectedMonths(month);
    };


    return (
        <React.Fragment>
            <PageHeader
                title={<IntlMessage id={'sidenav.management.combat-starting-position'}/>}
                subTitle={<IntlMessage id={'csp.create.month.plan.title'}/>}
                backIcon={false}
                style={{
                    backgroundColor: 'white',
                    width: 'calc(100% + 50px)',
                    marginLeft: '-25px',
                    marginTop: '-25px',
                }}
            />
            <Row style={{marginTop: '24px'}} gutter={16}>
                <Col xs={14}>
                    <Card>
                        <Row gutter={16}>
                            <Col xs={8}>
                                <Radio.Group
                                    defaultValue="lesson"
                                    value={selectedTable}
                                    onChange={(evt) => {
                                        setSelectedTable(evt.target.value);
                                    }}
                                >
                                    <Radio.Button
                                        value="lesson"
                                        onClick={() => {
                                            navigate(
                                                `${APP_PREFIX_PATH}/management/combat-starting-position/month-plan/`,
                                            );
                                        }}
                                    >
                                        <IntlMessage
                                            id={'csp.create.year.plan.setting.table.column.second'}
                                        />
                                    </Radio.Button>

                                    <Radio.Button
                                        value="credits"
                                        onClick={() =>
                                            navigate(
                                                `${APP_PREFIX_PATH}/management/combat-starting-position/month-plan/`,
                                            )
                                        }
                                    >
                                        <IntlMessage id={'csp.create.year.plan.modal.credits'}/>
                                    </Radio.Button>
                                </Radio.Group>
                            </Col>
                            <Col xs={8}>
                                <Select style={{width:'40%'}} defaultValue={currentYear} onChange={(e)=>setYear(e)}>
                                    <Option value={currentYear}>{currentYear}</Option>
                                    <Option value={currentYear + 1}>{currentYear + 1}</Option>
                                    <Option value={currentYear + 2}>{currentYear + 2}</Option>
                                </Select>
                                <Select
                                    onChange={handleMonthChange}
                                    options={filteredMonthOptions}
                                    style={{width:'50%',marginLeft:'5px'}}
                                    defaultValue={months.find((month)=>month.value===selectedMonths)?.name}
                                />
                            </Col>
                            <Col xs={8}>
                                <Search
                                    style={{width: '200px'}}
                                    placeholder={
                                        IntlMessageText.getText({id: 'letters.search'}) + '...'
                                    }
                                    onSearch={onSearch}
                                />
                            </Col>
                        </Row>
                        <br/>
                        {selectedTable === 'lesson' ? (
                            <LessonTable
                                lessons_data={lessons_data}
                                setChooseItem={setChooseItem}
                                year={year}
                                selectedMonths={selectedMonths}
                                current={current}
                                setCurrent={setCurrent}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                            />
                        ) : (
                            <CreditsTable
                                credits_data={credits_data}
                                setChooseItem={setChooseItem}
                                year={year}
                                selectedMonths={selectedMonths}
                                current={currentExam}
                                setCurrent={setCurrentExam}
                                pageSize={pageSizeExam}
                                setPageSize={setPageSizeExam}
                            />
                        )}
                    </Card>
                </Col>

                <Col xs={10}>
                    {selectedTable === 'lesson' && yearId ? (
                        <SettingClasses chooseItem={chooseItem}/>
                    ) : selectedTable === 'credits' && yearId ? (
                        <SettingCredit chooseItem={chooseItem}/>
                    ) : selectedTable === 'lesson' ? (
                        <ClassesBase/>
                    ) : (
                        <CreditsBase/>
                    )}
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Index;
