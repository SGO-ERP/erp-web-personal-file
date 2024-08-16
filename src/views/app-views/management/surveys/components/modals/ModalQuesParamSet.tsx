import React, { useState } from 'react';
import { Col, Collapse, Divider, Input, Modal, Row } from 'antd';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import { addQuestionDescription } from '../../../../../../store/slices/surveys/surveysSlice';
import { useAppDispatch } from '../../../../../../hooks/useStore';

interface Props {
    onClose: () => void;
    isOpen: boolean;
    field: fieldType;
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
enum QuestionLanguageTypes {
    Kz = 'kz',
    Ru = 'ru',
}

const { Panel } = Collapse;

const ModalQuesParamSet = ({ isOpen, onClose, field }: Props) => {
    const [questionLanguage, setQuestionLanguage] = useState<string>(QuestionLanguageTypes.Ru);

    const dispatch = useAppDispatch();
    const cardInfo = field;

    const addDescription = (val: string, type: string, which: string, id: string, lang: string) => {
        dispatch(addQuestionDescription({ text: val, type, which, id, lang }));
    };

    const questionCardType = cardInfo.type === 'Один из списка' ? 'radios' : 'checkbox';

    const itemsBlockInfo = [
        { name: 'Благоприятная', size: 120 },
        { name: 'В целом удовлетворен', size: 75 },
        { name: 'Спокойная', size: 70 },
        { name: 'Не удовлетворен', size: 76 },
        { name: 'Не удовлетворен', size: 76 },
    ];

    const questionBlock = cardInfo[questionCardType].map((item: any) => {
        return (
            <Row key={item.id} align="middle" style={{ marginBottom: 20 }}>
                <Col xs={4}>
                    <h5>{item.name}</h5>
                </Col>
                <Col xs={10}>
                    <Input
                        style={{ width: '90%' }}
                        onChange={(e) =>
                            addDescription(
                                e.target.value,
                                'diagram',
                                questionCardType,
                                item.id,
                                questionLanguage,
                            )
                        }
                        value={item.settings[questionLanguage].diagram}
                        placeholder="Описание в диаграммах"
                        disabled={item.text === 'Затрудняюсь ответить' ? true : false}
                    />
                </Col>
                <Col xs={10}>
                    <Input
                        onChange={(e) =>
                            addDescription(
                                e.target.value,
                                'reference',
                                questionCardType,
                                item.id,
                                questionLanguage,
                            )
                        }
                        value={item.settings[questionLanguage].reference}
                        placeholder="Описание в справке"
                        disabled={item.text === 'Затрудняюсь ответить' ? true : false}
                    />
                </Col>
            </Row>
        );
    });

    const items = {
        key: 1,
        header: 'Примеры отображения',
        content: (
            <Col xs={24} className="survey-modal">
                <Row style={{ marginBottom: 20 }}>
                    <h4>Отчетность</h4>
                </Row>
                <Row
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: 150,
                        width: '100%',
                    }}
                >
                    {itemsBlockInfo.map((block: any, index: number) => {
                        return (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    height: '100%',
                                    width: '15%',
                                }}
                                key={index}
                            >
                                <div className="blueBlock" style={{ height: block.size }} />
                                <p style={{ color: 'black' }}>{block.name}</p>
                            </div>
                        );
                    })}
                </Row>
                <Row style={{ marginBottom: 20 }}>
                    <h4>Справка</h4>
                </Row>
                <Row>
                    <p style={{ margin: 0, color: 'black' }}>
                        55% считывают, что испытывают благоприятную. доброжелательную
                        взаимоотношения
                    </p>
                    <p style={{ color: 'black' }}>
                        32% считывают, что испытывают благоприятную. доброжелательную
                        взаимоотношения
                    </p>
                </Row>
            </Col>
        ),
    };

    return (
        <Modal
            title={<IntlMessage id={'title.modal.setting.question'} />}
            open={isOpen}
            onOk={onClose}
            onCancel={onClose}
            width={'1000px'}
        >
            <Row>
                <Col xs={24}>
                    <Divider style={{ background: 'grey', height: 1, marginRight: 24 }} />
                    <Row style={{ marginBottom: 20 }}>
                        <Col xs={4}></Col>
                        <Col xs={10}>
                            <h4>Описание в диаграммах</h4>
                        </Col>
                        <Col xs={10}>
                            <h4>Описание в справке</h4>
                        </Col>
                    </Row>
                    {questionBlock}
                </Col>
                <Collapse defaultActiveKey={['1']} style={{ marginTop: 20, width: '100%' }}>
                    <Panel header={items.header} key={items.key}>
                        <p>{items.content}</p>
                    </Panel>
                </Collapse>
            </Row>
        </Modal>
    );
};

export default ModalQuesParamSet;
