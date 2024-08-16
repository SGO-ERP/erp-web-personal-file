import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message, Spin } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { saveAndSign } from '../../../../../store/slices/candidates/answersSlice/answersSlice';
import { APP_PREFIX_PATH } from '../../../../../configs/AppConfig';
import IntlMessage from '../../../../../components/util-components/IntlMessage';

const ModalKnowledgeLegislation = ({ modalCase, openModal, stage, setStage }) => {
    const [openKnowlLegis, setOpenKnowlLegis] = useState(false);
    const [form] = Form.useForm();

    const { id } = useParams();

    const path = `${APP_PREFIX_PATH}/management/candidates/list/discover/${id}`;

    const dispatch = useDispatch();

    const [isLoading, setLoading] = useState(true);
    const [loading, setIsLoading] = useState(false);

    const [answer, setAnswer] = useState(0);
    const [answerId, setAnswerId] = useState(null);
    const [questionId, setQuestionId] = useState(null);
    const [question, setQuestion] = useState(null);

    const [stageStatus, setStageStatus] = useState('Не начат');
    const [value, setValue] = useState('');

    function createAnswerJsonData(answerStr, question, type, candidateId, answerId) {
        const data = {
            'candidate_stage_question_id': question.id,
            'type': type,
            'answer_str': null,
            'answer_bool': null,
            'answer': null,
            'document_link': null,
            'document_number': null,
            'candidate_essay_type_id': null,
            'candidate_id': candidateId,
            'category_id': null,
            'answer_id': answerId === undefined ? null : answerId,
            'is_sport_passed': false,
        };
        if (type === 'String') {
            data.answer_str = answerStr === undefined ? '' : answerStr;
        }
        if (type === 'Text') {
            data.answer = answerStr === undefined ? '' : answerStr;
        }
        return data;
    }

    async function handleSignSave() {
        let status = 'Пройден успешно';
        if (answer <= 69) {
            status = 'Завален';
        }
        const data = {
            'status': status,
        };
        const answers = [];
        const answer1 = createAnswerJsonData(answer, question, 'String', id, answerId);
        answers.push(answer1);
        await dispatch(
            saveAndSign({ answers: answers, stageId: stage.candidate_stage_info.id, data: data }),
        )
            .then((data) => {
                handleCancel();
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        if (stage !== null) {
            if (stage?.name === 'Результаты тестирования на знание законодательства РК') {
                setQuestion(stage?.questions[0]);
                setQuestionId(stage?.questions[0]?.id);
                setAnswer(stage?.questions[0]?.answer?.answer_str);
                setAnswerId(stage?.questions[0]?.answer?.id);
                setStageStatus(stage?.candidate_stage_info?.status);
                setLoading(false);
            }
        } else {
            setLoading(true);
        }
    }, [stage]);

    function handleCancel() {
        setStage(null);
        setOpenKnowlLegis(false);
        modalCase.showModalKnowlLegs(openKnowlLegis);
        setLoading(true);
    }

    const onOk = async () => {
        try {
            setIsLoading(true);

            await form.validateFields(); // Валидация формы
            // Дополнительная логика для сохранения данных
            // handleCancel();
            // modalCase.showModalKnowlLegs(openKnowlLegis);
            handleSignSave();
        } catch (error) {
            setIsLoading(false);

            // Вывод сообщения об ошибке
            message.error('Пожалуйста, заполните обязательные поля');
        }
    };

    if (isLoading) {
        return '';
    }

    return (
        <div>
            <Modal
                title={<IntlMessage id={'candidates.title.titleTest'} />}
                open={openModal}
                onCancel={handleCancel}
                onOk={onOk}
                okText={<IntlMessage id={'personal.button.save'} />}
                cancelText={<IntlMessage id={'candidates.warning.cancel'} />}
                style={{ height: '100%', width: '100%' }}
                okButtonProps={{
                    disabled: stageStatus === 'Пройден успешно' || stageStatus === 'Завален',
                }}
                cancelButtonProps={{
                    disabled: stageStatus === 'Пройден успешно' || stageStatus === 'Завален',
                }}
            >
                <Spin spinning={loading} size="large">
                    <div>
                        <Form
                            fields={[
                                {
                                    name: ['result'],
                                    value: answer,
                                },
                            ]}
                            layout={'vertical'}
                            form={form}
                        >
                            <Form.Item
                                label={<IntlMessage id={'candidates.title.score'} />}
                                tooltip={{
                                    icon: <QuestionCircleOutlined />,
                                }}
                                name={'result'}
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id={'candidates.title.must'} />,
                                    },
                                ]}
                            >
                                <Input
                                    onChange={(e) => {
                                        if (!isNaN(e.target.value)) {
                                            if (Number(e.target.value) > 100) {
                                                setAnswer(value);
                                            } else {
                                                setAnswer(e.target.value);
                                            }
                                        } else {
                                            setAnswer(value);
                                        }
                                    }}
                                    value={answer}
                                    maxLength={3}
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                    disabled={
                                        stageStatus === 'Пройден успешно' ||
                                        stageStatus === 'Завален'
                                    }
                                />
                            </Form.Item>
                        </Form>
                    </div>
                </Spin>
            </Modal>
        </div>
    );
};

export default ModalKnowledgeLegislation;
