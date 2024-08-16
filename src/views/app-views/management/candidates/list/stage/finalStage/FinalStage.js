import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { APP_PREFIX_PATH } from '../../../../../../../configs/AppConfig';
import { Col, Row, Spin } from 'antd';
import { getUser } from '../../../../../../../store/slices/users/usersSlice';
import { profileCandidateById } from '../../../../../../../store/slices/candidates/selectedCandidateSlice';
import {
    saveAndSignEcp,
    saveAnswers,
} from '../../../../../../../store/slices/candidates/answersSlice/answersSlice';

import { getProfile } from 'store/slices/ProfileSlice';
import { getUserID } from 'utils/helpers/common';
import FileUploaderService from '../../../../../../../services/myInfo/FileUploaderService';
import EditorComponent from '../EditorComponent';
import SignECP from '../../../modals/SignECP';
import SaveButton from '../externalRequests/SaveButton';
import ExternalForButtonViewInfo from '../externalRequests/ExternalForButtonViewInfo';
import HrDocumentTemplatesService from '../../../../../../../services/HrDocumentTemplatesService';
import RenderTemplateService from '../../../../../../../services/candidates/RenderTemplate';
import SignAndRejectButtons from '../externalRequests/SignAndRejectButtons';
import HtmlHelper from '../../../../../../../utils/HtmlHelper';

const FinalStage = ({ props }) => {
    const { id } = useParams();
    const selectedCandidate = useSelector((state) => state.selectedCandidate.data);
    const [selectedCandidateFullName, setSelectedCandidateFullName] = useState('');
    const dispatch = useDispatch();
    const path = `${APP_PREFIX_PATH}/management/candidates/list/discover/${id}`;

    // const [isLoading, setLoading] = useState(true);
    const isLoading = useSelector((state) => state.selectedCandidateStages.isLoading);

    const allStages = useSelector((state) => state.selectedCandidateStages.stages);

    const { stageId } = useParams();

    const [stageInfo, setStageInfo] = useState(null);
    const [stageStatus, setStageStatus] = useState(null);

    const profile = useSelector((state) => state.profile.data);
    const user = useSelector((state) => state.users.user);
    const candidateProfile = useSelector((state) => state.selectedCandidate.profile);

    const [searchParams, setSearchParams] = useSearchParams();
    const selectedStageId = searchParams.get('stageId');

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

    const [openDigitalSignature2, setOpenDigitalSignature2] = useState(false);
    const showModalDigitalSignature2 = (bool) => {
        setOpenDigitalSignature2(bool);
    };

    useEffect(() => {
        if (selectedCandidate !== null) {
            HrDocumentTemplatesService.hr_template().then((r) => {
                setSpecOrder(r.find((item) => item.name === 'Заключение на зачисление'));
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
                        if (item.name === 'Заключение о зачислении') {
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
            // setPathFile(null);
        } else {
            handleDownloadTemplate();
        }
        setAnswerId(question.answer?.id);
        setQuestion(question);
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

    // const [pathFile, setPathFile] = useState('http://193.106.99.68:2287/static/finish_candidate.html');

    async function handleDownloadTemplate() {
        if (specOrder !== null) {
            // const finishFileHtml = await FileUploaderService.getFileByLink(pathFile);
            const finishFileHtml = await RenderTemplateService.render_finish(specOrder.id, id);
            finishFileHtml.text().then((r) => {
                setTemplate(HtmlHelper.htmlForEditor(r));
            });

            // console.log(file)
            // handleFileConvert(file);
        }
    }

    function setTemplate(templateValue) {
        templateValue = templateValue.replaceAll('<ins', '<u');
        templateValue = templateValue.replaceAll('ins>', 'u>');
        setValue(templateValue);
    }

    async function handleSignSaveForSubmitForTheAgreements() {
        const data = {
            'status': 'В прогрессе',
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

        dispatch(
            saveAndSignEcp({
                answers: answers,
                stageId: stageInfo.candidate_stage_info.id,
                data: data,
            }),
        );
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
                        {selectedStageId !== null ? (
                            <SignAndRejectButtons
                                stageInfo={stageInfo}
                                selectedStageId={selectedStageId}
                                saveAnswer={handleSaveAnswers}
                            />
                        ) : (
                            <SaveButton
                                isDisabled={stageInfo?.candidate_stage_info.status}
                                saveAnswer={handleSaveAnswers}
                                handleSignSend={showModalDigitalSignature2}
                                isSend={true}
                            />
                        )}
                    </Col>
                </Row>
            </Spin>
            <SignECP
                stageName={stageInfo?.name}
                stageInfoId={stageInfo?.candidate_stage_info.id}
                handleSignSaveForSubmitForTheAgreements={handleSignSaveForSubmitForTheAgreements}
                modalCase={{ showModalDigitalSignature2 }}
                openModal={openDigitalSignature2}
            />
        </div>
    );
};

export default FinalStage;
