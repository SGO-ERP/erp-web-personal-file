import { Col, Row, Spin } from 'antd';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import HrDocumentTemplatesService from 'services/HrDocumentTemplatesService';
import RenderTemplateService from 'services/candidates/RenderTemplate';
import FileUploaderService from 'services/myInfo/FileUploaderService';
import { getProfile } from 'store/slices/ProfileSlice';
import { saveAndSignEcp, saveAnswers } from 'store/slices/candidates/answersSlice/answersSlice';
import { profileCandidateById } from 'store/slices/candidates/selectedCandidateSlice';
import { getUser } from 'store/slices/users/usersSlice';
import HtmlHelper from 'utils/HtmlHelper';
import { getUserID } from 'utils/helpers/common';
import EditorComponent from '../EditorComponent';
import ExternalForButtonViewInfo from '../externalRequests/ExternalForButtonViewInfo';
import SaveButton from '../externalRequests/SaveButton';
import SignEcp from 'components/shared-components/SignEcp';

const SpecCheck = ({ props }) => {
    const { id } = useParams();
    const selectedCandidate = useSelector((state) => state.selectedCandidate.data);
    const [selectedCandidateFullName, setSelectedCandidateFullName] = useState('');
    const [realText, setRealText] = useState('');

    const dispatch = useDispatch();
    const path = `${APP_PREFIX_PATH}/management/candidates/list/discover/${id}`;

    // const [isLoading, setLoading] = useState(true);
    const isLoading = useSelector((state) => state.selectedCandidateStages.isLoading);

    const allStages = useSelector((state) => state.selectedCandidateStages.stages);

    const { stageId } = useParams();
    const navigate = useNavigate();

    const [stageInfo, setStageInfo] = useState(null);
    const [stageStatus, setStageStatus] = useState(null);

    const profile = useSelector((state) => state.profile.data);
    const user = useSelector((state) => state.users.user);
    const candidateProfile = useSelector((state) => state.selectedCandidate.profile);

    useEffect(() => {
        const profile = async () => {
            dispatch(getProfile({ id: await getUserID() }));
        };
        profile();
    }, []);

    const [value, setValue] = useState('');
    const [question, setQuestion] = useState({});
    const [answerId, setAnswerId] = useState(null);

    const [specOrder, setSpecOrder] = useState(null);

    const [openDigitalSignature, setOpenDigitalSignature] = useState(false);
    const showModalDigitalSignature = (bool) => {
        setOpenDigitalSignature(bool);
    };

    useEffect(() => {
        if (selectedCandidate !== null) {
            HrDocumentTemplatesService.hr_template().then((r) => {
                setSpecOrder(r.find((item) => item.name === 'Заключение спец. проверки'));
                setSelectedCandidateFullName(
                    selectedCandidate?.staff_unit.users[0].first_name +
                        ' ' +
                        selectedCandidate?.staff_unit.users[0].last_name +
                        ' ' +
                        selectedCandidate?.staff_unit.users[0].father_name,
                );

                dispatch(getUser(selectedCandidate.staff_unit.users[0].id));
            });
        }
    }, [selectedCandidate]);

    useEffect(() => {
        if (user?.id === selectedCandidate.staff_unit.users[0].id) {
            if (candidateProfile === null) {
                dispatch(profileCandidateById(user?.id));
            } else {
                allStages.forEach((item) => {
                    if (stageId === item.id) {
                        if (item.name === 'Заключение по спец. проверке') {
                            setStageInfo(item);
                            setAnswer(item.questions[0]);
                            setStageStatus(item.candidate_stage_info.status);
                        }
                    }
                });
            }
        }
    }, [user, candidateProfile]);

    function setAnswer(question) {
        if (question.answer !== null) {
            setValue(question.answer.answer);
        } else {
            handleDownloadTemplate();
        }
        setAnswerId(question.answer?.id);
        setQuestion(question);
    }

    async function handleSignSave() {
        const data = {
            'status': 'Пройден успешно',
        };

        const answers = [];
        const answer1 = createAnswerJsonData(value, question, 'Text', id, answerId);
        answers.push(answer1);

        const file = await RenderTemplateService.renderHTML2PDF(
            HtmlHelper.correctHtml(value),
            `${stageInfo?.candidate_stage_info.id}.pdf`,
        );
        const formData = new FormData();
        formData.append('file', file);
        const response = await FileUploaderService.upload(formData);
        const document_link = response.link;

        const res = await dispatch(
            saveAndSignEcp({
                answers: answers,
                stageId: stageInfo.candidate_stage_info.id,
                data: data,
            }),
        );

        // navigate(path);
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
        return data;
    }

    // const [pathFile, setPathFile] = useState('http://193.106.99.68:2287/static/pre-finalv2.html');

    async function handleDownloadTemplate() {
        if (specOrder !== null) {
            // const finishFileHtml = await FileUploaderService.getFileByLink(pathFile);
            const finishFileHtml = await RenderTemplateService.render_spec(specOrder.id, id);
            finishFileHtml.text().then((r) => {
                setTemplate(HtmlHelper.htmlForEditor(r));
            });

            // handleFileConvert(file);
        }
    }

    function setTemplate(templateValue) {
        templateValue = templateValue.replaceAll('<ins', '<u');
        templateValue = templateValue.replaceAll('ins>', 'u>');
        setValue(templateValue);
    }

    function handleSaveAnswers() {
        const answers = [];
        const answer1 = createAnswerJsonData(value, question, 'Text', id, answerId);
        answers.push(answer1);
        dispatch(saveAnswers(answers));
    }

    return (
        <div>
            <Spin
                spinning={isLoading && stageInfo !== null}
                size="large"
                style={{ position: 'absolute', top: 120 }}
            >
                <Row>
                    <ExternalForButtonViewInfo
                        path={path}
                        main={props}
                        username={selectedCandidateFullName}
                        selectedCandidate={selectedCandidate}
                    />
                </Row>

                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={24}>
                        <Spin
                            spinning={isLoading && stageInfo !== null}
                            size="large"
                            style={{ position: 'absolute', top: 120 }}
                        >
                            {stageStatus !== null ? (
                                <EditorComponent
                                    setRealText={setRealText}
                                    disabled={stageStatus === 'Пройден успешно'}
                                    waterMarkerText={selectedCandidateFullName}
                                    value={value}
                                    setValue={setValue}
                                    style={{ maxWidth: '100%' }}
                                />
                            ) : (
                                ''
                            )}
                        </Spin>
                    </Col>
                    <Col xs={24} lg={24}>
                        <SaveButton
                            isDisabled={stageInfo?.candidate_stage_info.status}
                            saveAnswer={handleSaveAnswers}
                            handleSignSave={showModalDigitalSignature}
                            isSend={false}
                        />
                    </Col>
                </Row>
            </Spin>
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
        </div>
    );
};

export default SpecCheck;
