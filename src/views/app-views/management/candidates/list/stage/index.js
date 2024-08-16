import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PrimaryConversation from './primary/PrimaryConversation';
import { useDispatch, useSelector } from 'react-redux';
import { selectedCandidateInfo } from '../../../../../../store/slices/candidates/selectedCandidateSlice';
import { candidateStagesInfo } from '../../../../../../store/slices/candidates/selectedCandidateStagesSlice';
import TextEditer from './textEditor/TextEditer';
import { APP_PREFIX_PATH } from '../../../../../../configs/AppConfig';
import ExternalRequest from './externalRequests/ExternalRequest';
import SpecCheck from './specCheck/SpecCheck';
import FinalStage from './finalStage/FinalStage';

const StageItems = () => {
    const { stageId } = useParams();
    const { id } = useParams();

    const allStages = useSelector((state) => state.selectedCandidateStages.stages);

    const selectedCandidate = useSelector((state) => state.selectedCandidate.data);

    const dispatch = useDispatch();

    let [componentToRender, setComponentToRender] = useState();

    const path = `${APP_PREFIX_PATH}/management/candidates/list/discover/${id}`;

    const navigate = useNavigate();

    const redirectAnswers = useSelector((state) => state.candidateStageAnswers.redirect);
    useEffect(() => {
        if (redirectAnswers === 'saveAndSign') {
            dispatch(selectedCandidateInfo(id));
            navigate(path);
        }
        if (redirectAnswers === 'saveAnswers') {
            dispatch(selectedCandidateInfo(id));
        }
    }, [redirectAnswers]);

    useEffect(() => {
        if (selectedCandidate === null) {
            dispatch(selectedCandidateInfo(id));
        } else {
            allStages.forEach((item) => {
                if (stageId === item.id) {
                    if (item.name === 'Первичная беседа') {
                        setTimeout(() => {
                            setComponentToRender(<PrimaryConversation />);
                        }, 50);
                    } else {
                        if (item.name === 'Запросы с внешних источников (др. гос органы)') {
                            setTimeout(() => {
                                setComponentToRender(<ExternalRequest />);
                            }, 50);
                        } else {
                            if (item.name === 'Заключение по спец. проверке') {
                                setTimeout(() => {
                                    setComponentToRender(<SpecCheck props={item} />);
                                }, 50);
                            } else {
                                if (item.name === 'Заключение о зачислении') {
                                    setTimeout(() => {
                                        setComponentToRender(<FinalStage props={item} />);
                                    }, 50);
                                } else {
                                    setTimeout(() => {
                                        setComponentToRender(<TextEditer props={item} />);
                                    }, 50);
                                }
                            }
                        }
                    }
                }
            });
        }
    }, [selectedCandidate]);

    return <div>{componentToRender}</div>;
};

export default StageItems;
