import { FileAddOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, message, Row, Select, Spin } from 'antd';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import IntlMessage, {
    IntlMessageText,
} from '../../../../../../../components/util-components/IntlMessage';
import LocalizationText from '../../../../../../../components/util-components/LocalizationText/LocalizationText';
import {
    saveAndSignEcp,
    saveAnswers,
} from '../../../../../../../store/slices/candidates/answersSlice/answersSlice';
import ListUsers from '../../../ListUsers/ListUsers';
import ModalFile from '../../../modals/modalPrimaryConversatiom/ModalFile';
import '../../../style.css';
import Breadcrumbs from '../BreadcrumbItems';
import SignEcp from 'components/shared-components/SignEcp';

const { TextArea } = Input;

const PrimaryConversation = () => {
    const { id } = useParams();
    const selectedCandidate = useSelector((state) => state.selectedCandidate.data);
    const isLoading = useSelector((state) => state.selectedCandidateStages.isLoading);
    const path = `${APP_PREFIX_PATH}/management/candidates/list/discover/${id}`;
    const main = <IntlMessage id={'candidates.button.firstConversation'} />;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form] = Form.useForm();

    const departmentUsers = useSelector((state) => state.candidateHrDoc.data);

    const isLoadingAnswers = useSelector((state) => state.candidateStageAnswers.isLoading);

    const [openDigitalSignature, setOpenDigitalSignature] = useState(false);
    const showModalDigitalSignature = (bool) => {
        setOpenDigitalSignature(bool);
    };

    const [openFileUpload, setOpenFileUpload] = useState(false);

    const showModalFileUpload = (bool) => {
        setOpenFileUpload(bool);
    };

    const [stageInfo, setStageInfo] = useState(null);

    const allStages = useSelector((state) => state.selectedCandidateStages.stages);
    const categories = useSelector((state) => state.candidateCategories.data);
    const [categoriesOptions, setCategoriesOptions] = useState([]);

    const [selectedCandidateFullName, setSelectedCandidateFullName] = useState('');

    const { stageId } = useParams();

    //Кем подобран и кем рекомендован
    const [question1Answer, setQuestion1Answer] = useState('');
    const [question1AnswerId, setQuestion1AnswerId] = useState(null);
    const [question1, setQuestion1] = useState({});
    const [choosedU, setChoosedU] = useState([]);

    //Краткие сведения из автобиографии
    const [question2Answer, setQuestion2Answer] = useState('');
    const [question2AnswerId, setQuestion2AnswerId] = useState(null);
    const [question2, setQuestion2] = useState({});

    //Как характеризуется с последнего места работы
    const [question3Answer, setQuestion3Answer] = useState('');
    const [question3AnswerId, setQuestion3AnswerId] = useState(null);
    const [question3, setQuestion3] = useState({});

    //Доведение требований к службе в СГО РК
    const [question4Answer, setQuestion4Answer] = useState('');
    const [question4AnswerId, setQuestion4AnswerId] = useState(null);
    const [question4, setQuestion4] = useState({});

    //Мотив кандидата на службу в СГО РК
    const [question5Answer, setQuestion5Answer] = useState('');
    const [question5AnswerId, setQuestion5AnswerId] = useState(null);
    const [question5, setQuestion5] = useState({});

    //Рекомендация кандидату (читать газеты, смотреть мировые новости и тд.)
    const [question6Answer, setQuestion6Answer] = useState('');
    const [question6AnswerId, setQuestion6AnswerId] = useState(null);
    const [question6, setQuestion6] = useState({});

    //Сведения о родственниках кандидата
    const [question7Answer, setQuestion7Answer] = useState('');
    const [question7AnswerId, setQuestion7AnswerId] = useState(null);
    const [question7, setQuestion7] = useState({});

    //Дополнительные сведения (физическая подготовка)
    const [question8Answer, setQuestion8Answer] = useState('');
    const [question8AnswerId, setQuestion8AnswerId] = useState(null);
    const [question8, setQuestion8] = useState({});

    //Подведение итогов беседы
    const [question9Answer, setQuestion9Answer] = useState('');
    const [question9AnswerId, setQuestion9AnswerId] = useState(null);
    const [question9, setQuestion9] = useState({});

    //Категория кандидата
    const [question10Answer, setQuestion10Answer] = useState('');
    const [question10AnswerId, setQuestion10AnswerId] = useState(null);
    const [question10, setQuestion10] = useState({});

    //Документ
    const [question11Answer, setQuestion11Answer] = useState('');
    const [question11AnswerId, setQuestion11AnswerId] = useState(null);
    const [question11, setQuestion11] = useState({});

    useEffect(() => {
        setSelectedCandidateFullName(
            selectedCandidate?.staff_unit.users[0].first_name +
                ' ' +
                selectedCandidate?.staff_unit.users[0].last_name +
                ' ' +
                selectedCandidate?.staff_unit.users[0].father_name,
        );
        allStages.forEach((item) => {
            if (stageId === item.id) {
                if (item.name === 'Первичная беседа') {
                    setStageInfo(item);
                    // setStageInfo(item.candidate_stage_type);
                    setAnswers(item.questions);
                }
            }
        });
    }, [selectedCandidate]);

    useEffect(() => {
        const list = [
            {
                value: '',
                label: '',
                disabled: true,
            },
        ];
        categories.forEach((category) => {
            list.push({
                value: category.id,
                label: <LocalizationText text={category} />,
                disabled: false,
            });
        });
        setCategoriesOptions(list);
    }, [categories]);

    function setAnswers(questions) {
        questions.forEach((question) => {
            if (question.question === 'Кем подобран и кем рекомендован') {
                if (question?.answer?.answer_str !== undefined) {
                    setChoosedU(question.answer.answer_str);
                }
                setQuestion1AnswerId(question?.answer?.id);
                setQuestion1(question);
            }
            if (question.question === 'Краткие сведения из автобиографии') {
                setQuestion2Answer(question?.answer?.answer);
                setQuestion2AnswerId(question?.answer?.id);
                setQuestion2(question);
            }
            if (question.question === 'Как характеризуется с последнего места работы') {
                setQuestion3Answer(question?.answer?.answer);
                setQuestion3AnswerId(question?.answer?.id);
                setQuestion3(question);
            }
            if (question.question === 'Доведение требований к службе в СГО РК') {
                setQuestion4Answer(question?.answer?.answer);
                setQuestion4AnswerId(question?.answer?.id);
                setQuestion4(question);
            }
            if (question.question === 'Мотив кандидата на службу в СГО РК') {
                setQuestion5Answer(question?.answer?.answer);
                setQuestion5AnswerId(question?.answer?.id);
                setQuestion5(question);
            }
            if (
                question.question ===
                'Рекомендация кандидату (читать газеты, смотреть мировые новости и тд.)'
            ) {
                setQuestion6Answer(question?.answer?.answer);
                setQuestion6AnswerId(question?.answer?.id);
                setQuestion6(question);
            }
            if (question.question === 'Сведения о родственниках кандидата') {
                setQuestion7Answer(question?.answer?.answer);
                setQuestion7AnswerId(question?.answer?.id);
                setQuestion7(question);
            }
            if (question.question === 'Дополнительные сведения (физическая подготовка)') {
                setQuestion8Answer(question?.answer?.answer);
                setQuestion8AnswerId(question?.answer?.id);
                setQuestion8(question);
            }
            if (question.question === 'Подведение итогов беседы') {
                setQuestion9Answer(question?.answer?.answer);
                setQuestion9AnswerId(question?.answer?.id);
                setQuestion9(question);
            }
            if (question.question === 'Категория кандидата') {
                setQuestion10Answer(question?.answer?.answer_str);
                setQuestion10AnswerId(question?.answer?.id);
                setQuestion10(question);
            }
            if (question.question === null) {
                setQuestion11Answer(question?.answer?.document_link);
                setQuestion11AnswerId(question?.answer?.id);
                setQuestion11(question);
            }
        });
    }

    function isDepartment(department) {
        if (department.id === choosedU) {
            message.error('Нельзя выбрать департамент/управление/отделение');
            throw new Error('Нельзя выбрать департамент/управление/отделение');
        }
        department.children.forEach((departmentChildren) => {
            isDepartment(departmentChildren);
        });
    }

    // function validateDepartmentUsers() {
    //     if (departmentUsers.length > 0) {
    //         departmentUsers.forEach((department) => {
    //             isDepartment(department);
    //         });
    //     }
    // }

    async function handleSaveAnswers() {
        try {
            const answers = [];
            const answer1 = createAnswerJsonData(
                choosedU,
                question1,
                'String',
                id,
                question1AnswerId,
            );
            const answer2 = createAnswerJsonData(
                question2Answer,
                question2,
                'Text',
                id,
                question2AnswerId,
            );
            const answer3 = createAnswerJsonData(
                question3Answer,
                question3,
                'Text',
                id,
                question3AnswerId,
            );
            const answer4 = createAnswerJsonData(
                question4Answer,
                question4,
                'Text',
                id,
                question4AnswerId,
            );
            const answer5 = createAnswerJsonData(
                question5Answer,
                question5,
                'Text',
                id,
                question5AnswerId,
            );
            const answer6 = createAnswerJsonData(
                question6Answer,
                question6,
                'Text',
                id,
                question6AnswerId,
            );
            const answer7 = createAnswerJsonData(
                question7Answer,
                question7,
                'Text',
                id,
                question7AnswerId,
            );
            const answer8 = createAnswerJsonData(
                question8Answer,
                question8,
                'Text',
                id,
                question8AnswerId,
            );
            const answer9 = createAnswerJsonData(
                question9Answer,
                question9,
                'Text',
                id,
                question9AnswerId,
            );
            const answer10 = createAnswerJsonData(
                question10Answer,
                question10,
                'String',
                id,
                question10AnswerId,
            );
            const answer11 = createAnswerJsonData(
                question11Answer,
                question11,
                'Document',
                id,
                question11AnswerId,
            );
            answers.push(answer1);
            answers.push(answer2);
            answers.push(answer3);
            answers.push(answer4);
            answers.push(answer5);
            answers.push(answer6);
            answers.push(answer7);
            answers.push(answer8);
            answers.push(answer9);
            answers.push(answer10);
            answers.push(answer11);
            dispatch(saveAnswers(answers));
        } catch (error) {
            console.log('Form validation error', error);
        }
    }

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
        if (type === 'Document') {
            data.document_link = answerStr === undefined ? '' : answerStr;
        }
        //answer - документы туда
        return data;
    }

    async function handleSignSave() {
        try {
            await form.validateFields();
            const data = {
                'status': 'Пройден успешно',
            };
            const answers = [];
            const answer1 = createAnswerJsonData(
                choosedU,
                question1,
                'String',
                id,
                question1AnswerId,
            );
            const answer2 = createAnswerJsonData(
                question2Answer,
                question2,
                'Text',
                id,
                question2AnswerId,
            );
            const answer3 = createAnswerJsonData(
                question3Answer,
                question3,
                'Text',
                id,
                question3AnswerId,
            );
            const answer4 = createAnswerJsonData(
                question4Answer,
                question4,
                'Text',
                id,
                question4AnswerId,
            );
            const answer5 = createAnswerJsonData(
                question5Answer,
                question5,
                'Text',
                id,
                question5AnswerId,
            );
            const answer6 = createAnswerJsonData(
                question6Answer,
                question6,
                'Text',
                id,
                question6AnswerId,
            );
            const answer7 = createAnswerJsonData(
                question7Answer,
                question7,
                'Text',
                id,
                question7AnswerId,
            );
            const answer8 = createAnswerJsonData(
                question8Answer,
                question8,
                'Text',
                id,
                question8AnswerId,
            );
            const answer9 = createAnswerJsonData(
                question9Answer,
                question9,
                'Text',
                id,
                question9AnswerId,
            );
            const answer10 = createAnswerJsonData(
                question10Answer,
                question10,
                'String',
                id,
                question10AnswerId,
            );
            const answer11 = createAnswerJsonData(
                question11Answer,
                question11,
                'Document',
                id,
                question11AnswerId,
            );
            answers.push(answer1);
            answers.push(answer2);
            answers.push(answer3);
            answers.push(answer4);
            answers.push(answer5);
            answers.push(answer6);
            answers.push(answer7);
            answers.push(answer8);
            answers.push(answer9);
            answers.push(answer10);
            answers.push(answer11);
            dispatch(
                saveAndSignEcp({
                    answers: answers,
                    stageId: stageInfo.candidate_stage_info.id,
                    data: data,
                }),
            );
            // navigate(path);
            // setTimeout(() => {window.location.assign(path)}, 50);
        } catch (error) {
            throw new Error(error);
        }
    }

    const placeholderString = IntlMessageText.getText({ id: 'candidates.title.placeholder' });

    const candidatePage = (id) => {
        navigate(`${APP_PREFIX_PATH}/management/candidates/${id}`);
    };

    return (
        <div>
            <Spin
                spinning={isLoading && isLoadingAnswers}
                size="large"
                style={{ position: 'absolute', top: 120 }}
            >
                <Row>
                    <Col xs={24} lg={16}>
                        <Breadcrumbs path={path} main={main} userName={selectedCandidateFullName} />
                    </Col>
                    <Col xs={24} lg={8} style={{ textAlign: 'end' }}>
                        <Row gutter={16}>
                            <Col>
                                <Button
                                    onClick={() => {
                                        navigate(-1);
                                    }}
                                >
                                    <IntlMessage id={'initiate.back'} />
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    onClick={() =>
                                        candidatePage(selectedCandidate.staff_unit.users[0].id)
                                    }
                                >
                                    <IntlMessage id={'candidates.button.dataCandidate'} />
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Form
                    form={form}
                    layout="vertical"
                    fields={[
                        {
                            name: ['question1Answer'],
                            value: choosedU,
                        },
                        {
                            name: ['question2Answer'],
                            value: question2Answer,
                        },
                        {
                            name: ['question3Answer'],
                            value: question3Answer,
                        },
                        {
                            name: ['question4Answer'],
                            value: question4Answer,
                        },
                        {
                            name: ['question5Answer'],
                            value: question5Answer,
                        },
                        {
                            name: ['question6Answer'],
                            value: question6Answer,
                        },
                        {
                            name: ['question7Answer'],
                            value: question7Answer,
                        },
                        {
                            name: ['question8Answer'],
                            value: question8Answer,
                        },
                        {
                            name: ['question9Answer'],
                            value: question9Answer,
                        },
                        {
                            name: ['question10Answer'],
                            value: question10Answer,
                        },
                        {
                            name: ['question11Answer'],
                            value: question11Answer,
                        },
                    ]}
                >
                    <Card>
                        <Row gutter={30}>
                            <Col xs={24} lg={12}>
                                <Row>
                                    <div
                                        style={{
                                            fontWight: '500',
                                            fontSize: '24px',
                                            lineHeight: '32px',
                                            color: ' #1A3353',
                                            marginBottom: '20px',
                                        }}
                                    >
                                        {selectedCandidateFullName}
                                    </div>
                                </Row>

                                <Row>
                                    <Form.Item
                                        label={
                                            <IntlMessage id={'candidates.title.recommendation'} />
                                        }
                                        rules={[{ required: true, message: 'Обязательное поле' }]}
                                        name="question1Answer"
                                        required
                                    >
                                        <ListUsers ids={choosedU} setIds={setChoosedU} />
                                    </Form.Item>

                                    <Form.Item name="question11Answer">
                                        <FileAddOutlined
                                            onClick={() => {
                                                setOpenFileUpload(true);
                                            }}
                                            style={{
                                                marginLeft: '15px',
                                                cursor: 'pointer',
                                                fontSize: '150%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginTop: '35px',
                                            }}
                                        />
                                    </Form.Item>
                                </Row>

                                <Form.Item
                                    label={<IntlMessage id={'candidates.title.biographic'} />}
                                    rules={[{ required: true, message: 'Обязательное поле' }]}
                                    name="question2Answer"
                                    required
                                >
                                    <Row>
                                        <TextArea
                                            value={question2Answer}
                                            onChange={(e) => {
                                                setQuestion2Answer(e.target.value);
                                            }}
                                            placeholder={placeholderString}
                                        />
                                    </Row>
                                </Form.Item>

                                <Form.Item
                                    label={<IntlMessage id={'candidates.title.char'} />}
                                    rules={[{ required: true, message: 'Обязательное поле' }]}
                                    name="question3Answer"
                                    required
                                >
                                    <Row>
                                        <TextArea
                                            value={question3Answer}
                                            onChange={(e) => {
                                                setQuestion3Answer(e.target.value);
                                            }}
                                            placeholder={placeholderString}
                                        />
                                    </Row>
                                </Form.Item>

                                <Form.Item
                                    label={<IntlMessage id={'candidates.title.delivery'} />}
                                    rules={[{ required: true, message: 'Обязательное поле' }]}
                                    name="question4Answer"
                                    required
                                >
                                    <Row>
                                        <TextArea
                                            value={question4Answer}
                                            onChange={(e) => {
                                                setQuestion4Answer(e.target.value);
                                            }}
                                            placeholder={placeholderString}
                                        />
                                    </Row>
                                </Form.Item>
                            </Col>

                            <Col xs={24} lg={12}>
                                <Form.Item
                                    label={<IntlMessage id={'candidates.title.motive'} />}
                                    rules={[{ required: true, message: 'Обязательное поле' }]}
                                    name="question5Answer"
                                    required
                                >
                                    <Row>
                                        <TextArea
                                            value={question5Answer}
                                            onChange={(e) => {
                                                setQuestion5Answer(e.target.value);
                                            }}
                                            placeholder={placeholderString}
                                        />
                                    </Row>
                                </Form.Item>

                                <Form.Item
                                    label={
                                        <IntlMessage id="candidates.title.recommendationForCandidate" />
                                    }
                                    rules={[{ required: true, message: 'Обязательное поле' }]}
                                    name="question6Answer"
                                    required
                                >
                                    <Row>
                                        <TextArea
                                            value={question6Answer}
                                            onChange={(e) => {
                                                setQuestion6Answer(e.target.value);
                                            }}
                                            placeholder={placeholderString}
                                        />
                                    </Row>
                                </Form.Item>

                                <Form.Item
                                    label={<IntlMessage id={'candidates.title.releationship'} />}
                                    rules={[{ required: true, message: 'Обязательное поле' }]}
                                    name="question7Answer"
                                    required
                                >
                                    <Row>
                                        <TextArea
                                            value={question7Answer}
                                            onChange={(e) => {
                                                setQuestion7Answer(e.target.value);
                                            }}
                                            placeholder={placeholderString}
                                        />
                                    </Row>
                                </Form.Item>

                                <Form.Item
                                    label={<IntlMessage id={'candidates.title.additional'} />}
                                    rules={[{ required: true, message: 'Обязательное поле' }]}
                                    name="question8Answer"
                                    required
                                >
                                    <Row>
                                        <TextArea
                                            value={question8Answer}
                                            onChange={(e) => {
                                                setQuestion8Answer(e.target.value);
                                            }}
                                            placeholder={placeholderString}
                                        />
                                    </Row>
                                </Form.Item>

                                <Form.Item
                                    label={<IntlMessage id={'candidates.title.result'} />}
                                    rules={[{ required: true, message: 'Обязательное поле' }]}
                                    name="question9Answer"
                                    required
                                >
                                    <Row>
                                        <TextArea
                                            value={question9Answer}
                                            onChange={(e) => {
                                                setQuestion9Answer(e.target.value);
                                            }}
                                            placeholder={placeholderString}
                                        />
                                    </Row>
                                </Form.Item>

                                <Form.Item
                                    label={<IntlMessage id={'candidates.title.category'} />}
                                    rules={[{ required: true, message: 'Обязательное поле' }]}
                                    name="question10Answer"
                                    required
                                >
                                    <Row>
                                        <Select
                                            value={question10Answer}
                                            style={{ width: '100%' }}
                                            options={categoriesOptions}
                                            onChange={(value) => {
                                                setQuestion10Answer(value);
                                            }}
                                        />
                                    </Row>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={8} justify={'end'} style={{ marginTop: '20px' }}>
                            <Col style={{ textAlign: 'end' }}>
                                <Button
                                    disabled={
                                        stageInfo?.candidate_stage_info?.status !== 'Не начат'
                                    }
                                    onClick={handleSaveAnswers}
                                    type="default"
                                >
                                    <IntlMessage id={'personal.button.save'} />
                                </Button>
                            </Col>
                            <Col style={{ textAlign: 'end' }}>
                                <Button
                                    disabled={
                                        stageInfo?.candidate_stage_info?.status !== 'Не начат'
                                    }
                                    onClick={showModalDigitalSignature}
                                    type="primary"
                                >
                                    <IntlMessage id={'candidates.button.signAndSave'} />
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Form>

                <ModalFile
                    modalCase={{ showModalFileUpload }}
                    openModal={openFileUpload}
                    question11Answer={question11Answer}
                    setQuestion11Answer={setQuestion11Answer}
                    stageInfo={stageInfo}
                />

                <SignEcp
                    open={openDigitalSignature}
                    onClose={() => setOpenDigitalSignature(false)}
                    callback={handleSignSave}
                />

                {/* <SignECP2
                    handleDispatch={handleSignSave}
                    modalCase={{ showModalDigitalSignature }}
                    openModal={openDigitalSignature}
                /> */}
            </Spin>
        </div>
    );
};
export default PrimaryConversation;
