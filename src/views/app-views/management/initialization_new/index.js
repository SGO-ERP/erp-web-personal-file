import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    changeLangOrder,
    fetchDocuments,
    getComment,
    getDocument,
    getDueDate,
    getProperties,
    resetSliceByOrder,
    setItemValue,
} from "store/slices/newInitializationsSlices/initializationNewSlice";
import { Button, Card, Col, notification, Radio, Row, Select } from "antd";
import IntlMessage from "components/util-components/IntlMessage";
import TextBlock from "./TextBlock";
import TagsBlock from "./TagsBlock";
import UserForm, { LOADING_OPTION } from "./UserForm";
import { APP_PREFIX_PATH } from "configs/AppConfig";
import GenerateProperties from "./GenerateProperties";
import CheckingProperties from "./CheckingProperties";
import DueDate from "./DueDate";
import CommentField from "./CommentField";
import ChooseSteps from "./ChooseSteps";
import HrDocumentService from "services/HrDocumentsService";
import AuthService from "services/AuthService";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./styles/IndexStyle.css";
import HrDocumentsStepsService from "services/HrDocumentsStepsService";
import { WarningOutlined } from "@ant-design/icons";
import SignEcp from "../../../../components/shared-components/SignEcp";
import { getCertificate } from "utils/helpers/certificate";

const Index = () => {
    const [optionsDocument, setOptionsDocument] = useState([]);
    const [documentsLoading, setDocumentsLoading] = useState(false);
    const [isEcpOpen, setIsEcpOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUserId = useSelector((state) => state.profile.data?.id);
    const currentLocale = localStorage.getItem("lan");
    const {
        initButtonDisable,
        needDueDate,
        needComment,
        documentTemplate,
        dueDate,
        selectUser,
        stepsToSend,
        comment,
        propertiesToSend,
        collectProperties,
        needRusLanguage,
        changeOnRus,
        hrDocumentsTemplates,
        isLoading,
    } = useSelector((state) => state.initializationNew);

    const editId = searchParams.get("editId");
    const editOrderId = searchParams.get("orderId");
    const draftId = searchParams.get("draftId");
    const statusId = searchParams.get("statusId");
    const candidateUserId = searchParams.get("candidateUserId");
    const isCandidate = searchParams.get("isCandidate");
    const subject = searchParams.get("subject");

    //запрос на доступные приказы для нынешного пользователя
    useEffect(() => {
        if (!currentUserId) return;
        dispatch(fetchDocuments(currentUserId));
    }, [currentUserId]);

    // заполнение каскадера с доступными приказами
    useEffect(() => {
        if (!hrDocumentsTemplates) return;
        setOptionsDocument(hrDocumentsTemplates);
    }, [hrDocumentsTemplates]);

    //вакансии и кандидаты
    useEffect(() => {
        if (!candidateUserId) return;
        getOrderByCandidate();
    }, [candidateUserId, optionsDocument]);

    //черновик
    useEffect(() => {
        if (!editId && !editOrderId) return;
        getOrderToEdit();
    }, [editId, editOrderId, optionsDocument]);

    //сохранение выброго приказа
    const getOrderValue = (id) => {
        dispatch(resetSliceByOrder());
        optionsDocument.map((doc) => {
            if (doc.id === id) {
                dispatch(getDocument(doc));
            }
        });
    };

    //сборка инфы с черновика
    const getOrderToEdit = async () => {
        optionsDocument.map((doc) => {
            if (doc.id == editOrderId) {
                dispatch(getDocument(doc));
            }
        });
        const propertiesEdited = await HrDocumentService.getDocumentById(editId);
        const collect = [];

        const keys = Object.keys(propertiesEdited.properties);
        let count = 0;

        keys.map((key) => {
            if (!propertiesEdited.properties[key].auto) {
                dispatch(
                    setItemValue({
                        id: count,
                        name: propertiesEdited.properties[key].name,
                        nameKZ: propertiesEdited.properties[key].nameKZ,
                    }),
                );

                if (propertiesEdited.properties[key].value) {
                    collect.push({
                        wordInOrder: key,
                        newWord: propertiesEdited.properties[key].name,
                        newWordKZ: propertiesEdited.properties[key].nameKZ,
                        isAuto: propertiesEdited.properties[key].data_taken === "auto",
                        isString: propertiesEdited.properties[key].type === "string",
                        ids: propertiesEdited.properties[key].value,
                    });
                } else {
                    collect.push({
                        wordInOrder: key,
                        newWord: propertiesEdited.properties[key].name,
                        newWordKZ: propertiesEdited.properties[key].nameKZ,
                        isAuto: propertiesEdited.properties[key].data_taken === "auto",
                        isString: propertiesEdited.properties[key].type === "string",
                    });
                }
                count++;
            }
        });

        dispatch(getComment(propertiesEdited.initial_comment));
        dispatch(getDueDate(propertiesEdited.due_date));
        dispatch(getProperties(collect));
    };

    //запрос приказа по параметрам кандидаты или вакансии
    const getOrderByCandidate = () => {
        optionsDocument.map((doc) => {
            if (isCandidate && doc.name === "Приказ о зачислении на службу сотрудника") {
                dispatch(getDocument(doc));
            } else if (doc.name === "Приказ о назначении на должность") {
                dispatch(getDocument(doc));
            }
        });
    };

    const handleInitializationClick = async () => {
        await onClickButtons(1);
    };

    const handleDraftClick = async () => {
        await onClickButtons(2);
    };

    //логика кнопок
    const onClickButtons = async (which) => {
        let notificationParam;
        let params = {
            docId: documentTemplate.id,
            status: 1,
            date: dueDate,
            userId: selectUser.id,
            properties: propertiesToSend,
            steps: stepsToSend,
            comment: comment,
            actions: documentTemplate.actions,
        };

        try {
            if (Object.keys(stepsToSend) === 0) {
                const steps = await HrDocumentsStepsService.get_document_step_user(
                    documentTemplate.id,
                    selectUser.id,
                );

                params.steps = steps;
            }
            if (which === 1) {
                params.certificate_blob = getCertificate();
                await HrDocumentService.hr_document_post_ecp(params);
                await AuthService.refreshToken();

                notificationParam = {
                    message: "Приказ иницирован",
                };
            } else if (which === 2) {
                await AuthService.refreshToken();

                const sendProperties = collectProperties.reduce((acc, property) => {
                    if (!property.ids) {
                        return {
                            ...acc,
                            [property.wordInOrder]: {
                                name: property.newWord,
                                nameKZ: property.newWordKZ,
                                auto:
                                    documentTemplate.properties[property.wordInOrder]
                                        ?.data_taken === "auto",
                                string:
                                    documentTemplate.properties[property.wordInOrder]?.data_type ===
                                    "string",
                            },
                        };
                    } else {
                        return {
                            ...acc,
                            [property.wordInOrder]: {
                                name: property.newWord,
                                nameKZ: property.newWordKZ,
                                value: property.ids,
                                auto:
                                    documentTemplate.properties[property.wordInOrder]
                                        ?.data_taken === "auto",
                                string:
                                    documentTemplate.properties[property.wordInOrder]?.data_type ===
                                    "string",
                            },
                        };
                    }
                }, {});

                if (collectProperties.length > 0) {
                    params.properties = sendProperties;
                }

                if (editId) {
                    params["id"] = editId;
                    params.status = statusId;
                    await HrDocumentService.hr_document_put(params);
                } else {
                    await HrDocumentService.hr_document_drafts_post(params);
                }

                notificationParam = {
                    message: "Приказ добавлен в черновик",
                };
            }

            notification.success(notificationParam);

            dispatch(resetSliceByOrder());

            navigate(`${APP_PREFIX_PATH}/management/letters`);
        } catch (error) {
            const err = error.response.data.detail;
            const newErr = err.replace(/[[\]']/g, "");
            const startIndex = newErr.indexOf("user:");
            let errorMessage = newErr;
            if (errorMessage.includes("You can not increase rank to")) {
                errorMessage = errorMessage.replace(
                    "You can not increase rank to",
                    currentLocale === "kk"
                        ? "Бұл дәрежеге көтеру мүмкін емес:"
                        : "Невозможно повысить звание до",
                );
            }
            if (startIndex !== -1) {
                const getErrUsername = newErr.substring(startIndex + 5).trim();
                if (currentLocale === "kk") {
                    errorMessage = "Белгіше осы пайдаланушыға тағайындалған: " + getErrUsername;
                } else {
                    errorMessage = "Значок уже присвоен этому пользователю: " + getErrUsername;
                }
            }
            let notificationParam = {
                message: errorMessage,
            };
            notification.error(notificationParam);
        }
    };

    //удаление приказа
    const deleteOrder = async () => {
        if (!editId) {
            dispatch(resetSliceByOrder());
            return;
        }

        try {
            await HrDocumentService.deleteDocumentById(editId);
            notification.success({
                message: currentLocale === "kk" ? "Тапсырыс өшірілд" : "Приказ удалёні",
            });
            navigate(`${APP_PREFIX_PATH}/management/letters`);
        } catch (e) {
            console.log(e);
        }
    };

    //смена языка приказа
    const changeLanguageOrder = (val) => dispatch(changeLangOrder(val.target.value !== "kaz"));

    return (
        <div style={{ minWidth: 1000 }}>
            <GenerateProperties />
            <CheckingProperties />
            <SignEcp
                callback={handleInitializationClick}
                open={isEcpOpen}
                onClose={() => setIsEcpOpen(false)}
            />
            <Row>
                <Col xl={3}>
                    <h4 style={{ marginTop: "6px" }}>
                        <IntlMessage id="initiate.chooseOrder" />
                    </h4>
                </Col>

                <Col xl={12} align="start">
                    <Select
                        className="headerCascader"
                        options={
                            isLoading
                                ? [LOADING_OPTION]
                                : optionsDocument?.map((doc) => {
                                      const option = {
                                          value: doc.id,
                                          label: doc.name,
                                      };
                                      return option;
                                  })
                        }
                        value={documentTemplate.id}
                        onChange={getOrderValue}
                        disabled={!!(candidateUserId && (editId ? subject === 1 : true))}
                    />
                </Col>
                <Col xl={9}>
                    <Row align="end">
                        <Button onClick={deleteOrder} className="headerButtons" danger>
                            <IntlMessage
                                id={"initiate.deleteAll"}
                                style={{ marginRight: "10px" }}
                            />
                        </Button>
                        {draftId ? (
                            <Button
                                className="headerButtons"
                                // onClick={() => onClickButton('3')}
                            >
                                <IntlMessage id="initiate.save" />
                            </Button>
                        ) : (
                            <Button className="headerButtons" onClick={handleDraftClick}>
                                <IntlMessage id="initiate.draftAll" />
                            </Button>
                        )}
                        <Button
                            className="headerButtons"
                            type="primary"
                            disabled={initButtonDisable}
                            onClick={() => setIsEcpOpen(true)}
                        >
                            <IntlMessage id={["initiate.initiate"]} />
                        </Button>
                    </Row>
                </Col>
            </Row>
            <Row gutter={15} style={{ marginTop: "20px" }}>
                <Col xl={12}>
                    <Card>
                        {needRusLanguage ? (
                            <Row style={{ marginBottom: "3%" }}>
                                <Col xs={7}>
                                    <Row style={{ marginTop: "3 %" }}>
                                        <Col
                                            xs={4}
                                            style={{ display: "flex", alignItems: "center" }}
                                        >
                                            <WarningOutlined
                                                style={{ fontSize: 21, color: "#366EF6" }}
                                            />
                                        </Col>
                                        <Col className="text3" xs={20}>
                                            <IntlMessage id="initiate.languageWarning" />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={17} align="end">
                                    <Radio.Group value={changeOnRus ? "rus" : "kaz"}>
                                        <Radio.Button value="rus" onClick={changeLanguageOrder}>
                                            Русский
                                        </Radio.Button>
                                        <Radio.Button value="kaz" onClick={changeLanguageOrder}>
                                            Казахский
                                        </Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                        ) : null}
                        <TextBlock />
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="userFormMain">
                        <Col xl={24}>
                            <UserForm />
                            <TagsBlock />
                        </Col>
                    </Card>
                    {needDueDate ? (
                        <Row>
                            <DueDate className="dueDateBlock" />
                        </Row>
                    ) : null}
                    {needComment ? (
                        <Row>
                            <CommentField className="commentFieldBlock" />
                        </Row>
                    ) : null}
                    <Row>
                        <ChooseSteps />
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default Index;
