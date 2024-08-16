import React, { useEffect } from 'react';

import { Button, Form, Modal, notification, PageHeader, Tabs } from 'antd';

import Questions from '../components/tabs/Questions';
import Settings from '../components/tabs/Settings';

import IntlMessage from '../../../../../components/util-components/IntlMessage';
import CalendarComponents from '../components/tabs/CalendarComponents';
import { useDispatch, useSelector } from 'react-redux';
import SueveysService from 'services/SueveysService';
import { useNavigate, useParams } from 'react-router-dom';
import { resetSlice, time } from 'store/slices/surveys/surveysSlice';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { APP_PREFIX_PATH } from '../../../../../configs/AppConfig';

const { Fragment, useState } = React;

enum TabTypes {
    QuestionsTab = 'questionsTab',
    SettingsTab = 'settingsTab',
    CalendarTab = 'calendarTab',
}

interface Question {
    text: string;
    textKZ: string;
    is_required: boolean;
    question_type: string;
    survey_id: number;
    score: number | null;
    options: {
        text: string;
        textKZ: string;
        score: number | null;
        diagram_description: string;
        diagram_descriptionKZ: string;
        report_description: string;
        report_descriptionKZ: string;
    }[];
}

const SurveysCreate = () => {
    const [activeTab, setActiveTab] = useState<string>(TabTypes.QuestionsTab);
    const { params, id: isSurvey } = useParams();
    const dispatch = useDispatch();

    const { surveyInfo } = useSelector((state: any) => state.surveys);
    const navigate = useNavigate();

    const checkNameQuestionEmpty = (card: any) => {
        if (card.some((item: any) => item.name.RU.trim() === '' || item.name.KZ.trim() === ''))
            return true;

        return false;
    };

    useEffect(() => {
        const handleBeforeUnload = (e: any) => {
            e.preventDefault();
            e.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    function checkArrayFieldsNotEmpty(array: any) {
        for (const element of array) {
            if (
                !Object.prototype.hasOwnProperty.call(element, 'text') ||
                !Object.prototype.hasOwnProperty.call(element, 'settings') ||
                !Object.prototype.hasOwnProperty.call(element.settings, 'kz')
            ) {
                return false;
            }

            const { text, settings, textKZ } = element;
            const { kz, ru } = settings;

            if (
                !text.trim() ||
                !textKZ.trim() || // Added check for textKZ
                !kz ||
                !Object.prototype.hasOwnProperty.call(kz, 'reference') ||
                !Object.prototype.hasOwnProperty.call(kz, 'diagram') ||
                !ru ||
                !Object.prototype.hasOwnProperty.call(ru, 'reference') ||
                !Object.prototype.hasOwnProperty.call(ru, 'diagram')
            ) {
                return false;
            }
        }

        return true;
    }

    const checkEmpty = () => {
        const nameCheck = checkNameQuestionEmpty(surveyInfo.questions);
        const settingsCheck = surveyInfo.settingsInfo.selected.length !== 0;
        const calendarRange = Object.keys(surveyInfo.calendarInfo.range).length;

        if (calendarRange === 0 && surveyInfo.calendarInfo.time1 && surveyInfo.calendarInfo.time2) {
            return true;
        }

        const checkQuestions = surveyInfo.questions.map((q: any) => {
            const name = q.name.RU.trim() !== '' && q.name.KZ.trim() !== '';

            if (name) {
                if (q.type === 'Текст') {
                    return true;
                } else if (q.type === 'Один из списка') {
                    return checkArrayFieldsNotEmpty(q.radios);
                } else {
                    return checkArrayFieldsNotEmpty(q.checkbox);
                }
            }
        });

        if (!nameCheck && surveyInfo.nameBlock.name.trim() !== '' && settingsCheck) {
            if (!checkQuestions.some((q: boolean) => false === q)) {
                return false;
            }
        }

        return true;
    };

    const isDisable = checkEmpty();

    const create = async () => {
        try {
            const jurisdictions = surveyInfo.settingsInfo.selected.map((setting: any) => {
                if (setting.type === 'Штатное подразделение') {
                    return {
                        jurisdiction_type: setting.type, // Штатное подразделение
                        certain_member_id: null, //user_ID
                        staff_position: setting.official, // all || null
                        staff_division_id: setting.divisionID[setting.divisionID.length - 1], // last id division
                    };
                } else {
                    return {
                        jurisdiction_type: setting.type || 'Определенный участник', // Штатное подразделение
                        certain_member_id: setting.userID, //user_ID
                        staff_position: null, // all || null
                        staff_division_id: null, // last id division
                    };
                }
            });

            const [startDate, endDate] = surveyInfo.calendarInfo.range;

            const startTime = time.find((item) => item.id === surveyInfo.calendarInfo.time1)?.time;
            const endTime = time.find((item) => item.id === surveyInfo.calendarInfo.time2)?.time;

            if (!startTime || !endTime) {
                return;
            }

            const [startHour, startMinute] = startTime.split(':');
            const [endHour, endMinute] = endTime.split(':');

            startDate.hour(startHour).minute(startMinute);
            endDate.hour(endHour).minute(endMinute).subtract(1, 'days');

            const repeatMap: any = {
                month: 'Каждый месяц',
                year: 'Каждый год',
                week: 'Каждую неделю',
            };

            const repeat = repeatMap[surveyInfo.calendarInfo.repeat] || 'Никогда';

            try {
                const data = {
                    name: surveyInfo.nameBlock.name,
                    nameKZ: null,
                    description: surveyInfo.nameBlock.description,
                    start_date: startDate.format(),
                    end_date: endDate.format(),
                    is_kz_translate_required: surveyInfo.settingsInfo.isDouble,
                    is_anonymous: surveyInfo.settingsInfo.isAnonym,
                    repeat_type: repeat,
                    type: isSurvey == 'true' ? 'Опрос' : 'Бланк компетенций',
                    jurisdictions: jurisdictions,
                    comp_form_for_id: isSurvey
                        ? surveyInfo.settingsInfo.comp_form_for_id
                        : undefined,
                };

                const post = await SueveysService.post_surveys(data);

                const questions: Question[] = surveyInfo.questions.map((question: any) => {
                    let options: {
                        text: string;
                        textKZ: string;
                        score: number | null;
                        diagram_description: string;
                        diagram_descriptionKZ: string;
                        report_description: string;
                        report_descriptionKZ: string;
                    }[] = [];

                    if (question.radios[0].text !== '') {
                        options = question.radios.map((el: any) => ({
                            text: el.text,
                            textKZ: el.textKZ,
                            score: null,
                            diagram_description: el.settings.ru.diagram,
                            diagram_descriptionKZ: el.settings.kz.reference,
                            report_description: el.settings.ru.diagram,
                            report_descriptionKZ: el.settings.kz.reference,
                        }));
                    } else if (question.checkbox[0].text !== '') {
                        options = question.checkbox.map((el: any) => ({
                            text: el.text,
                            textKZ: el.textKZ,
                            score: null,
                            diagram_description: el.settings.ru.diagram,
                            diagram_descriptionKZ: el.settings.kz.reference,
                            report_description: el.settings.ru.diagram,
                            report_descriptionKZ: el.settings.kz.reference,
                        }));
                    }

                    return {
                        text: question.name.RU,
                        textKZ: question.name.KZ,
                        is_required: question.priority,
                        question_type: question.type,
                        survey_id: post.id,
                        score: null,
                        options: options,
                    };
                });


                await SueveysService.post_surveys_questions(questions);

                notification.success({
                    message: 'Опрос успешно создан',
                });

                dispatch(resetSlice());
                navigate(`${APP_PREFIX_PATH}/management/surveys`);
            } catch (e) {
                console.error(e);
                notification.error({
                    message: 'Произошла ошибка при создании опроса',
                });
            }
        } catch (e) {
            console.log(e);
        }

    };

    const cancel = () => {
        const currentLocale = localStorage.getItem('lan');

        Modal.confirm({
            title:
                currentLocale === 'kk'
                    ? 'Сіз шынымен бәрін жойғыңыз келе ме?'
                    : 'Вы действительно хотите  отменить все?',
            icon: <ExclamationCircleOutlined style={{ fontSize: '1.4rem', color: '#FC5555' }} />,
            content:
                currentLocale === 'kk'
                    ? 'Растау арқылы сіз енгізген барлық деректерді өшіріңіз'
                    : 'Подтверждая, вы стерёте все введенные вами данные',
            okText: currentLocale === 'kk' ? 'Ия' : 'Да',
            cancelText: currentLocale === 'kk' ? 'Жоқ' : 'Нет',
            onOk: () => {
                dispatch(resetSlice());
                navigate(`${APP_PREFIX_PATH}/management/surveys`);
            },
        });
    };

    return (
        <Fragment>
            <Form
                colon={false}
                layout={'vertical'}
                onFinish={(values) => {
                    console.log('Success:', values);
                }}
            >
                <PageHeader
                    extra={
                        <Fragment>
                            <Button
                                style={{
                                    marginRight: '16px',
                                }}
                                onClick={cancel}
                            >
                                <IntlMessage id="surveys.toolbar.button.create.cancel" />
                            </Button>
                            <Button
                                style={{
                                    marginRight: '16px',
                                }}
                            >
                                <IntlMessage id="surveys.toolbar.button.create.draft" />
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={isDisable}
                                onClick={create}
                            >
                                <IntlMessage id="surveys.toolbar.button.create.save" />
                            </Button>
                        </Fragment>
                    }
                    footer={
                        <Tabs
                            defaultActiveKey={TabTypes.QuestionsTab}
                            items={[
                                {
                                    label: (
                                        <IntlMessage
                                            id={'surveys.toolbar.button.create.questions'}
                                        />
                                    ),
                                    key: TabTypes.QuestionsTab,
                                    children: <Questions />,
                                },
                                {
                                    label: (
                                        <IntlMessage
                                            id={'surveys.toolbar.button.create.settings'}
                                        />
                                    ),
                                    key: TabTypes.SettingsTab,
                                    children: <Settings />,
                                },
                                {
                                    label: (
                                        <IntlMessage id={'surveys.table.header.column.calendar'} />
                                    ),
                                    key: TabTypes.CalendarTab,
                                    children: <CalendarComponents activeTab={activeTab} />,
                                    // forceRender: true,
                                },
                            ]}
                            key={activeTab}
                            onChange={(key) => {
                                if (key in TabTypes) {
                                    setActiveTab(key);
                                }
                            }}
                        />
                    }
                    style={{
                        backgroundColor: 'white',
                        width: 'calc(100% + 50px)',
                        margin: '-25px 0 25px -25px',
                    }}
                    title={<IntlMessage id={'surveys.toolbar.button.create.createSurvey'} />}
                />
            </Form>
        </Fragment>
    );
};

export default SurveysCreate;
