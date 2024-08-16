import React from 'react';

import {
    Card,
    Checkbox,
    Col,
    Collapse,
    Divider,
    Form,
    Input,
    Radio,
    Row,
    Select,
    Space,
    Switch,
} from 'antd';
import { CloseOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';

import { FormListFieldData } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import {
    addQuestionBox,
    addQuestionDescription,
    addQuestionName,
    addQuestionPriority,
    addQuestionRadio,
    addQuestionType,
    addTextQuestionBox,
    addTextQuestionRadio,
    clearQuestionType,
} from 'store/slices/surveys/surveysSlice';
import { useDispatch } from 'react-redux';
import '../../style.css';
import IntlMessage from 'components/util-components/IntlMessage';
import ModalQuesParamSet from '../modals/ModalQuesParamSet';

const currentLocale = localStorage.getItem('lan');

const { useState } = React;
const { Option } = Select;

enum QuestionTypes {
    MultipleChoice = 'Несколько из списка',
    OneOfTheList = 'Один из списка',
    Text = 'Текст',
}

enum QuestionLanguageTypes {
    Kz = 'kz',
    Ru = 'ru',
}

interface MapForm {
    id: number;
    placeholder: string;
}

interface fieldType {
    name: {
        RU: string;
        KZ: string;
    };
    type: string;
    text: string;
    radios: {
        id: string;
        name: string;
        text: string;
        settings: { reference: string; diagram: string };
    }[];
    checkbox: {
        id: string;
        name: string;
        text: string;
        settings: { reference: string; diagram: string };
    }[];
    id: number;
    key: number;
}

const Question = ({
    field,
    remove,
}: {
    field: fieldType;
    remove: (index: number | number[]) => void;
}) => {
    const [questionLanguage, setQuestionLanguage] = useState<string>(QuestionLanguageTypes.Ru);
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

    const dispatch = useDispatch();

    const cardInfo = field;
    const questionType = cardInfo?.type;

    const handleAddButton = (type: string, isHard: boolean) => {
        const nextRadioId = cardInfo.radios.length + 1;
        const nextBoxId = cardInfo.checkbox.length + 1;

        if (type === 'radio') {
            if (isHard) {
                dispatch(
                    addQuestionRadio({
                        id: field.key,
                        radio: `Вариант ${nextRadioId}`,
                        text: 'Затрудняюсь ответить',
                        textKZ: 'Жауап беруге қиналамын',
                        settings: {
                            ru: {
                                reference: 'Затрудняюсь ответить',
                                diagram: 'Затрудняюсь ответить',
                            },
                            kz: {
                                reference: 'Жауап беруге қиналамын',
                                diagram: 'Жауап беруге қиналамын',
                            },
                        },
                    }),
                );
            } else {
                dispatch(
                    addQuestionRadio({
                        id: field.key,
                        radio: `Вариант ${nextRadioId}`,
                        text: '',
                        textKZ: '',
                        settings: {
                            ru: { reference: '', diagram: '' },
                            kz: { reference: '', diagram: '' },
                        },
                    }),
                );
            }
        } else {
            if (isHard) {
                dispatch(
                    addQuestionBox({
                        id: field.key,
                        box: `Вариант ${nextBoxId}`,
                        text: 'Затрудняюсь ответить',
                        textKZ: 'Жауап беруге қиналамын',
                        settings: {
                            ru: {
                                reference: 'Затрудняюсь ответить',
                                diagram: 'Затрудняюсь ответить',
                            },
                            kz: {
                                reference: 'Жауап беруге қиналамын',
                                diagram: 'Жауап беруге қиналамын',
                            },
                        },
                    }),
                );
            } else {
                dispatch(
                    addQuestionBox({
                        id: field.key,
                        box: `Вариант ${nextBoxId}`,
                        text: '',
                        textKZ: '',
                        settings: {
                            ru: { reference: '', diagram: '' },
                            kz: { reference: '', diagram: '' },
                        },
                    }),
                );
            }
        }
    };

    const handleInputChange = (e: string, id: number, type: string, lang: string) => {
        if (type === 'radio') {
            dispatch(addTextQuestionRadio({ id: field.key, radioID: id, text: e, lang }));
        } else {
            dispatch(addTextQuestionBox({ id: field.key, boxID: id, text: e, lang }));
        }
    };

    const getChanges = (value: any, type: string) => {
        if (type === 'name') {
            dispatch(
                addQuestionName({
                    lang: questionLanguage === QuestionLanguageTypes.Ru ? 'RU' : 'KZ',
                    name: value,
                    id: field.key,
                }),
            );
        } else if (type === 'type') {
            dispatch(
                addQuestionType({
                    type: value,
                    id: field.key,
                }),
            );
        }
    };

    const getPriority = (val: boolean, id: number) => {
        dispatch(addQuestionPriority({ priority: val, id: id }));
    };

    const duplicateQuestion = (val: any) => {
        console.log(val.target);
    };

    const { Panel } = Collapse;

    return (
        <Card key={field.key}>
            <Col xs={24}>
                <Row justify={'space-between'} gutter={16} style={{ marginBottom: '2%' }}>
                    <Col xs={13}>
                        {questionLanguage === QuestionLanguageTypes.Ru ? (
                            <Input
                                onChange={(evt) => {
                                    getChanges(evt.target.value, 'name');
                                }}
                                value={cardInfo?.name?.RU}
                                placeholder="Вопрос"
                                style={{
                                    width: '100%',
                                }}
                            />
                        ) : (
                            <Input
                                onChange={(evt) => {
                                    getChanges(evt.target.value, 'name');
                                }}
                                placeholder="Cұрақ"
                                value={cardInfo?.name?.KZ}
                                style={{
                                    width: '100%',
                                }}
                            />
                        )}
                    </Col>
                    <Col xs={6}>
                        <Select
                            value={cardInfo?.type}
                            onChange={(value) => {
                                getChanges(value, 'type');
                                dispatch(clearQuestionType(field.key));
                            }}
                        >
                            <Option value={QuestionTypes.Text}>
                                <IntlMessage id="surveys.toolbar.button.create.text" />
                            </Option>
                            <Option value={QuestionTypes.OneOfTheList}>
                                {currentLocale !== 'kk' ? '' : ''}
                                <IntlMessage id="surveys.toolbar.button.create.onList" />
                            </Option>
                            <Option value={QuestionTypes.MultipleChoice}>
                                <IntlMessage id="surveys.toolbar.button.create.inList" />
                            </Option>
                        </Select>
                    </Col>
                    <Col xs={5} style={{ display: 'flex', justifyContent: 'end' }}>
                        <Radio.Group
                            defaultValue={QuestionLanguageTypes.Ru}
                            onChange={(evt) => {
                                setQuestionLanguage(evt.target.value);
                            }}
                        >
                            <Radio.Button value={QuestionLanguageTypes.Ru}>Рус</Radio.Button>
                            <Radio.Button value={QuestionLanguageTypes.Kz}>Каз</Radio.Button>
                        </Radio.Group>
                    </Col>
                </Row>
                {questionType === QuestionTypes.Text ? (
                    <TextArea style={{ width: '100%' }} disabled={true} />
                ) : questionType === QuestionTypes.OneOfTheList ? (
                    <Row gutter={[16, 16]}>
                        <Col xs={24}>
                            <Radio.Group>
                                <Space direction="vertical">
                                    {cardInfo.radios.map((radio: any) =>
                                        questionLanguage == 'ru' ? (
                                            <Input
                                                placeholder={radio.name}
                                                value={radio.text}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e.target.value,
                                                        radio?.id,
                                                        'radio',
                                                        questionLanguage,
                                                    )
                                                }
                                            />
                                        ) : (
                                            <Input
                                                placeholder={radio.name}
                                                value={radio.textKZ}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e.target.value,
                                                        radio?.id,
                                                        'radio',
                                                        questionLanguage,
                                                    )
                                                }
                                            />
                                        ),
                                    )}
                                </Space>
                            </Radio.Group>
                        </Col>
                        <Col xs={24}>
                            <a onClick={() => handleAddButton('radio', false)}>
                                <IntlMessage id="surveys.toolbar.button.create.addVariantBig" />
                            </a>{' '}
                            <IntlMessage id="surveys.toolbar.button.create.or" />{' '}
                            <a onClick={() => handleAddButton('radio', true)}>
                                <IntlMessage id="surveys.toolbar.button.create.addVariant" /> &apos;
                                <IntlMessage id="surveys.toolbar.button.create.difficult" />
                                &apos;
                            </a>
                        </Col>
                    </Row>
                ) : questionType === QuestionTypes.MultipleChoice ? (
                    <Row gutter={[16, 16]}>
                        <Col xs={24}>
                            <Checkbox.Group>
                                <Space direction="vertical">
                                    {cardInfo.checkbox.map((box: any) =>
                                        questionLanguage == 'ru' ? (
                                            <Input
                                                placeholder={box.name}
                                                value={box.text}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e.target.value,
                                                        box?.id,
                                                        'box',
                                                        questionLanguage,
                                                    )
                                                }
                                            />
                                        ) : (
                                            <Input
                                                placeholder={box.name}
                                                value={box.textKZ}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e.target.value,
                                                        box?.id,
                                                        'box',
                                                        questionLanguage,
                                                    )
                                                }
                                            />
                                        ),
                                    )}
                                </Space>
                            </Checkbox.Group>
                        </Col>
                        <Col xs={24}>
                            <a onClick={() => handleAddButton('box', false)}>
                                <IntlMessage id="surveys.toolbar.button.create.addVariantBig" />
                            </a>{' '}
                            <IntlMessage id="surveys.toolbar.button.create.or" />{' '}
                            <a onClick={() => handleAddButton('box', true)}>
                                <IntlMessage id="surveys.toolbar.button.create.addVariant" /> &apos;
                                <IntlMessage id="surveys.toolbar.button.create.difficult" />
                                &apos;
                            </a>
                        </Col>
                    </Row>
                ) : null}

                <Row justify="end" style={{ marginTop: 20 }}>
                    {questionType !== QuestionTypes.Text ? (
                        <SettingOutlined
                            onClick={() => setSettingsOpen(!settingsOpen)}
                            style={{ fontSize: '24px', marginRight: 24 }}
                        />
                    ) : null}
                    <DeleteOutlined
                        onClick={() => {
                            remove(field.key);
                        }}
                        style={{ fontSize: '24px', marginRight: 24 }}
                    />
                    <Divider
                        type="vertical"
                        style={{ background: 'grey', height: 24, marginRight: 24 }}
                    />{' '}
                    <p style={{ margin: 0, marginRight: 24, color: 'black' }}>
                        <IntlMessage id="surveys.toolbar.button.create.must" />
                    </p>
                    <Switch onChange={(val: any) => getPriority(val, field.key)} />
                </Row>
            </Col>
            <ModalQuesParamSet
                onClose={() => setSettingsOpen(false)}
                isOpen={settingsOpen}
                field={field}
            />
        </Card>
    );
};

export default Question;
