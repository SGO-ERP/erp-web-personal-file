import { DownloadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, notification, Row } from "antd";
import React, { useEffect, useState } from "react";
import IntlMessage from "../../../../../components/util-components/IntlMessage";
import { useDispatch, useSelector } from "react-redux";
import {
    addAutoFields,
    changePage,
    deleteHrDocumentsTemplateById,
    getHrDocumentsTemplateById,
    postHrDocumentTemplate,
    resetSlice,
    showAddDoc,
} from "store/slices/newConstructorSlices/constructorNewSlice";
import { useNavigate, useParams } from "react-router-dom";
import CreateOrderKZ from "./CreateOrderKZ";
import CreateOrderRU from "./CreateOrderRU";
import AddDocModal from "../modals/AddDocModal";
import ActionsCard from "./ActionsCard";
import LastStep from "./LastStep";
import uuidv4 from "utils/helpers/uuid";
import HtmlHelper from "utils/HtmlHelper";
import ActionsService from "services/ActionsService";
import { APP_PREFIX_PATH } from "../../../../../configs/AppConfig";
import HrDocumentTemplatesService from "services/HrDocumentTemplatesService";
import { getHrDocumentsTemplates } from "store/slices/candidates/ordersConstructorSlice";
import FileUploaderService from "../../../../../services/myInfo/FileUploaderService";

const Index = () => {
    const [modal, contextHolder] = Modal.useModal();
    const [takeActions, setTakeActions] = useState([]);
    const {
        page,
        orderTemplate,
        tagsInfoArray,
        actionsCard,
        usersArray,
        errorResponse,
        canDraft,
        stepsArr,
    } = useSelector((state) => state.constructorNew);
    const [templateForm] = Form.useForm();
    const [templateFormRU] = Form.useForm();
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = ""; // This is required for some browsers
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        if (takeActions.length === 0) {
            ActionsService.get_actions().then((r) => {
                setTakeActions(r);
            });
        }
    }, [takeActions]);

    useEffect(() => {
        if (id) {
            dispatch(getHrDocumentsTemplateById(id));
        }
    }, [id]);

    const deleteSample = () => {
        modal.confirm({
            icon: <ExclamationCircleOutlined />,
            title:
                localStorage.getItem("lan") === "kk"
                    ? "Осы үлгіні жою керек пе?"
                    : "Вы уверены что хотите удалить этот шаблон?",
            content:
                localStorage.getItem("lan") === "kk"
                    ? "Сіз бұл үлгіні жою болмаса, оны архивтіру арқылы сақтауға болады"
                    : "Вы можете архивировать шаблон вместо удаления",
            okText: localStorage.getItem("lan") === "kk" ? "Ия" : "Да",
            cancelText: localStorage.getItem("lan") === "kk" ? "Жоқ" : "Нет",
            onOk: () => deleteAll(),
        });
    };

    const addDoc = () => {
        dispatch(showAddDoc(true));
    };

    const renderHeader = () => {
        if (page === 0 || page === 1) {
            return (
                <div>
                    <Button onClick={() => addDoc()}>
                        <DownloadOutlined /> <IntlMessage id="constructor.download.template" />
                    </Button>
                    <AddDocModal />
                </div>
            );
        } else if (page === 2) {
            return (
                <h2>
                    <IntlMessage id="constructor.function.template" />
                </h2>
            );
        } else if (page === 3) {
            return (
                <Row>
                    <h2>
                        <IntlMessage id="constructor.select.member" />
                    </h2>
                    <h5 style={{ marginLeft: "1%", marginTop: "1%", color: "#72849A" }}>
                        <IntlMessage id="constructor.create.template" />
                    </h5>
                    <h5 style={{ marginLeft: "0.5%", marginTop: "1%" }}>
                        <IntlMessage id="constructor.create.prohodka" />
                    </h5>
                </Row>
            );
        }
    };

    const back = () => {
        if (page > 0) {
            if (page === 2) {
                dispatch(changePage(page - 2));
            } else {
                dispatch(changePage(page - 1));
            }
        }
    };

    const next = () => {
        if (page === 0) {
            if (orderTemplate.needRuLanguage) {
                dispatch(changePage(page + 1));
            } else {
                dispatch(changePage(page + 2));
            }
        } else {
            dispatch(changePage(page + 1));
        }
    };

    async function uploadDocument(editorValue, fileName) {
        const html = HtmlHelper.correctHtml(editorValue, id ? false : true);
        const response = new File([html], `${fileName}.html`);
        const formData = new FormData();
        formData.append("file", response);

        const documentLink = await FileUploaderService.upload(formData);
        return documentLink.link;
    }

    function aggregateByCommonKey(array) {
        const result = {};
        array.forEach((item) => {
            const key = Object.keys(item)[0]; // Get the first key of each object
            if (!result[key]) {
                // If this key has not been seen before
                result[key] = {}; // Initialize a new object for this key
            }
            Object.assign(result[key], item[key]); // Merge the properties of the item into the existing properties for this key
        });
        return result;
    }

    const upload = async () => {
        const documentLinkKZ = await uploadDocument(orderTemplate.textKZ, uuidv4());
    };

    const create = async (type) => {
        let template = {};
        let templateProperty = {};
        let actionObject = {
            args: [],
        };

        Object.keys(tagsInfoArray).map((tagKey) => {
            let propertyName = tagsInfoArray[tagKey].tagname;
            if (tagsInfoArray[tagKey].data_taken === "auto") {
                takeActions[takeActions.length - 1].properties.map((action) => {
                    if (action.auto_name === tagsInfoArray[tagKey].field_name) {
                        dispatch(addAutoFields(action));
                    }
                });
            }

            if (tagsInfoArray[tagKey].data_taken === "auto") {
                takeActions[takeActions.length - 1].properties.map((action) => {
                    if (action.auto_name === tagsInfoArray[tagKey].field_name) {
                        templateProperty[propertyName] = {
                            alias_name: action.alias_name,
                            alias_nameKZ: action.alias_nameKZ,
                            data_taken: action.data_taken,
                            type: action.type,
                            data_type: tagsInfoArray[tagKey].input_format,
                            field_name: tagsInfoArray[tagKey].field_name,
                            to_tags: {
                                prevWordKZ: tagsInfoArray[tagKey].prevWordKZ,
                                alias_name: tagsInfoArray[tagKey].alias_name,
                                alias_nameKZ: tagsInfoArray[tagKey].alias_nameKZ,
                                directory: tagsInfoArray[tagKey].directory,
                                isHidden: tagsInfoArray[tagKey].isHidden,
                                cases: tagsInfoArray[tagKey].cases,
                            },
                        };
                        dispatch(addAutoFields(action));
                    }
                });
            } else if (tagsInfoArray[tagKey].actions !== undefined) {
                templateProperty[propertyName] = {
                    alias_name: tagsInfoArray[tagKey].actions.alias_name,
                    alias_nameKZ: tagsInfoArray[tagKey].actions.alias_nameKZ,
                    data_taken: tagsInfoArray[tagKey].actions.data_taken,
                    type: tagsInfoArray[tagKey].actions.type,
                    data_type: tagsInfoArray[tagKey].input_format,
                    field_name: tagsInfoArray[tagKey].actions?.field_name || "manual",
                    to_tags: {
                        prevWordKZ: tagsInfoArray[tagKey].prevWordKZ,
                        prevWord: tagsInfoArray[tagKey].prevWord,
                        alias_name: tagsInfoArray[tagKey].actions.alias_name,
                        alias_nameKZ: tagsInfoArray[tagKey].actions.alias_nameKZ,
                        directory: tagsInfoArray[tagKey].directory,
                        isHidden: tagsInfoArray[tagKey].isHidden,
                        cases: tagsInfoArray[tagKey].cases,
                        actions: actionsCard.filter(
                            (action) => action.id === tagsInfoArray[tagKey].actionId,
                        ),
                    },
                };
            } else {
                templateProperty[propertyName] = {
                    alias_name: tagsInfoArray[tagKey].alias_name,
                    alias_nameKZ: tagsInfoArray[tagKey].alias_nameKZ,
                    data_taken: tagsInfoArray[tagKey].data_taken,
                    type: tagsInfoArray[tagKey].data_taken === "manual" ? "read" : "write",
                    data_type: tagsInfoArray[tagKey].input_format,
                    field_name: tagsInfoArray[tagKey].field_name || "manual",
                    to_tags: {
                        prevWordKZ: tagsInfoArray[tagKey].prevWordKZ,
                        prevWord: tagsInfoArray[tagKey].prevWord,
                        alias_name: tagsInfoArray[tagKey].alias_name,
                        alias_nameKZ: tagsInfoArray[tagKey].alias_nameKZ,
                        directory: tagsInfoArray[tagKey].directory,
                        isHidden: tagsInfoArray[tagKey].isHidden,
                        cases: tagsInfoArray[tagKey].cases,
                    },
                };

                const actionsSend = actionsCard.filter(
                    (action) => action.id === tagsInfoArray[tagKey].actionId,
                );

                if (actionsSend.length > 0) {
                    templateProperty[propertyName].to_tags.actions = actionsSend;
                }
            }
        });

        takeActions.map((action) => {
            tagsInfoArray.map((tag) => {
                if (tag.actionNames !== undefined && action.action_name == tag.actionNames.name) {
                    const args = action.actions.args[0];
                    const key = Object.keys(args)[0];
                    const keys = Object.keys(args[key]);
                    keys.map((keyIn) => {
                        if (
                            tag.actions !== undefined &&
                            tag.actions.alias_name === args[key][keyIn].alias_name
                        ) {
                            actionObject.args.push({
                                [key]: {
                                    [keyIn]: {
                                        alias_name: args[key][keyIn].alias_name,
                                        alias_nameKZ: args[key][keyIn].alias_nameKZ,
                                        tagname: tag.tagname,
                                    },
                                },
                            });
                        }
                    });
                }
            });
        });

        let actionsSend = {
            args: [aggregateByCommonKey(actionObject.args)],
        };

        if (Object.keys(actionsSend.args[0]).length === 0) {
            actionsSend = actionsCard[0].actions;
        }

        if (orderTemplate.needRuLanguage) {
            const documentLinkKZ = await uploadDocument(orderTemplate.textKZ, uuidv4());
            const documentLink = await uploadDocument(orderTemplate.textRU, uuidv4());

            template = {
                name: orderTemplate.name,
                nameKZ: orderTemplate.nameKZ,
                pathKZ: documentLinkKZ,
                path: documentLink,
                description: {
                    name: orderTemplate.descriptionRU,
                    nameKZ: orderTemplate.description,
                },
                subject_type: orderTemplate.person,
                actions: actionsSend,
                properties: templateProperty,
                is_visible: true,
                is_initial_comment_required: orderTemplate.needComment,
                is_due_date_required: orderTemplate.needDueDate,
            };
        } else {
            const documentLinkKZ = await uploadDocument(orderTemplate.textKZ, uuidv4());

            template = {
                name: orderTemplate.name,
                nameKZ: orderTemplate.nameKZ,
                pathKZ: documentLinkKZ,
                description: { nameKZ: orderTemplate.description, name: "" },
                subject_type: orderTemplate.person,
                actions: actionsSend,
                properties: templateProperty,
                is_visible: true,
                is_initial_comment_required: orderTemplate.needComment,
                is_due_date_required: orderTemplate.needDueDate,
            };
        }

        if (type === "create") {
            if (id === undefined) {
                let unitIds = [];
                let autoUser = [];

                usersArray.map((obj) => {
                    if (obj.unitId !== null) {
                        unitIds.push(obj.unitId);
                    } else {
                        unitIds.push(null);
                    }

                    if (obj.autoUserType !== null) {
                        autoUser.push(obj.autoUserType);
                    } else {
                        autoUser.push(null);
                    }
                });

                dispatch(
                    postHrDocumentTemplate({
                        template: template,
                        steps: usersArray,
                        staffUnitsIds: unitIds,
                        autoUser: autoUser,
                    }),
                );

                if (!id && !errorResponse) {
                    notification.success({
                        message:
                            localStorage.getItem("lan") === "kk"
                                ? "Үлгі сәтті жасалды"
                                : "Шаблон успешно создан",
                    });
                }
            } else {
                await HrDocumentTemplatesService.update_hr_template(id, template);
                notification.success({
                    message: <IntlMessage id="constructor.button.edit.end" />,
                });
            }
        } else {
            if (id) {
                await HrDocumentTemplatesService.update_hr_template(id, template);
                notification.success({
                    message: <IntlMessage id="constructor.button.edit.end" />,
                });
            } else {
                if (
                    template.name &&
                    template.nameKZ &&
                    template.name !== "" &&
                    template.nameKZ !== ""
                ) {
                    await HrDocumentTemplatesService.draft_hr_template_post(template);
                    notification.success({
                        message: <IntlMessage id="constructor.button.edit.end" />,
                    });
                } else {
                    notification.error({
                        message: <IntlMessage id="notification.name" />,
                    });
                    return;
                }
            }
        }

        await dispatch(getHrDocumentsTemplates({ page: 1, limit: 5 }));

        navigate(`${APP_PREFIX_PATH}/management/letters/constructor`);
        dispatch(resetSlice());
    };

    const deleteAll = () => {
        if (id) {
            dispatch(deleteHrDocumentsTemplateById(id));
            navigate(`${APP_PREFIX_PATH}/management/letters/constructor`);
        }
        dispatch(resetSlice());
    };

    const renderComponent = () => {
        if (page === 0) {
            return <CreateOrderKZ templateForm={templateForm} />;
        } else if (page === 1) {
            return <CreateOrderRU templateFormRU={templateFormRU} />;
        } else if (page === 2) {
            return <ActionsCard />;
        } else if (page === 3) {
            return <LastStep />;
        }
    };

    const isDisable = () => {
        if (page === 0) {
            if (
                orderTemplate.name.trim() &&
                orderTemplate.nameKZ.trim() &&
                orderTemplate.description.trim() &&
                orderTemplate.person &&
                orderTemplate.textKZ.trim() &&
                tagsInfoArray.length > 0
            ) {
                return false;
            }
        } else if (page === 1) {
            const tagComplete = tagsInfoArray
                .filter((tag) => !tag.isHidden)
                .some((tag) => tag.alias_name === null);

            if (orderTemplate.descriptionRU.trim() && !tagComplete) {
                return false;
            }
        } else if (page === 2) {
            let tagCount = 0;
            let actionCount = 0;
            let actionHave = actionsCard.filter(
                (card) => card.actionsValue && Object.keys(card.actionsValue).length > 0,
            );

            actionsCard.forEach((action) => {
                if (action.actions.args !== undefined) {
                    const keys = Object.keys(action.properties);
                    actionCount = actionCount + keys.length;
                }
            });

            tagsInfoArray.forEach((tag) => {
                if (tag.actionId !== undefined) {
                    tagCount++;
                }
            });

            if (actionHave.length > 0) {
                if (tagCount === actionCount) {
                    return tagsInfoArray.some((tag) => {
                        if (tag.data_taken === "dropdown") {
                            return tag.actionId === undefined;
                        }
                    });
                } else {
                    return true;
                }
            } else {
                return true;
            }
        } else {
            const isConditionMet =
                usersArray.length === 0 ||
                usersArray.filter((user) => user.key === 1 || user.key === 100).length < 2;

            const isConditionMetEdit =
                stepsArr.length === 0 ||
                stepsArr.filter(
                    (user) =>
                        user.staff_function.priority === 1 || user.staff_function.priority === 100,
                ).length < 2;

            if (stepsArr.length > 0) return isConditionMetEdit;

            return isConditionMet;
        }

        return true;
    };

    const check = id ? canDraft : true;

    return (
        <div>
            <Row style={{ marginBottom: "2%" }}>
                {contextHolder}
                <Col xl={14}>{renderHeader()}</Col>
                <Col xl={10}>
                    <Row align="end">
                        {page < 3 ? (
                            <div style={{ display: "flex" }}>
                                <div style={{ minWidth: 110 }}>
                                    <Button danger onClick={deleteSample}>
                                        <IntlMessage id="initiate.deleteAll" />
                                    </Button>
                                </div>
                                {check ? (
                                    <div style={{ minWidth: 120 }}>
                                        <Button onClick={() => create("draft")}>
                                            <IntlMessage id="initiate.draftAll" />
                                        </Button>
                                    </div>
                                ) : null}
                            </div>
                        ) : null}
                        {page > 0 && page < 4 ? (
                            <Button type="primary" onClick={back} style={{ marginRight: "1%" }}>
                                <IntlMessage id="initiate.back" />
                            </Button>
                        ) : null}
                        {page < 3 ? (
                            <Button type="primary" onClick={next} disabled={isDisable()}>
                                <IntlMessage id="initiate.next" />
                            </Button>
                        ) : null}
                        {page === 3 ? (
                            <Button
                                type="primary"
                                onClick={() => create("create")}
                                disabled={isDisable()}
                            >
                                <IntlMessage id={id ? "initiate.edit" : "initiate.create"} />
                            </Button>
                        ) : null}
                    </Row>
                </Col>
            </Row>
            {renderComponent()}
        </div>
    );
};

export default Index;
