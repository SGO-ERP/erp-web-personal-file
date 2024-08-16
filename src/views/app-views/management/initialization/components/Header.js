import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Row, Col, Select, Button, notification } from "antd";

import {
    getDocuments,
    resetDocument,
    resetDocuments,
    setDocument,
} from "store/slices/initialization/initializationDocumentsSlice";

import IntlMessage from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";

import { APP_PREFIX_PATH } from "configs/AppConfig";
import { LOADING_OPTION } from "../utils/loadings";
import {
    resetDocInfo,
    setPositionChange,
    setStepsToSend,
    setTwoLanguage,
} from "store/slices/initialization/initializationDocInfoSlice";
import { formatDate } from "../utils/dateHelper";
import moment from "moment";
import SignEcp from "components/shared-components/SignEcp";
import HrDocumentService from "services/HrDocumentsService";
import AuthService from "services/AuthService";
import { getCertificate } from "utils/helpers/certificate";
import { resetUsers } from "store/slices/initialization/initializationUsersSlice";

const Header = () => {
    const [isDisable, setIsDisable] = useState(false);
    const [isEcpOpen, setIsEcpOpen] = useState(false);
    const [documentsOptions, setDocumentsOptions] = useState([]);

    const currentUserId = useSelector((state) => state.profile.data?.id);

    const { documents, documentsLoading, selectedDocument } = useSelector(
        (state) => state.initializationDocuments,
    );
    const {
        tagsValue,
        dueDate,
        comment,
        stepsArray,
        stepsToSend,
        steps,
        tagsInfo,
        needSteps,
        twoLanguage,
    } = useSelector((state) => state.initializationDocInfo);
    const { wrongUser } = useSelector((state) => state.initializationUsers);
    const { selectedUser } = useSelector((state) => state.initializationUsers);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const draftId = searchParams.get("draftId");

    useEffect(() => {
        if (!currentUserId) return;

        dispatch(getDocuments(currentUserId));
    }, [currentUserId]);

    useEffect(() => {
        updateDocumentsOptions();
    }, [documents]);

    useEffect(() => {
        const keysStepsArray = Object.keys(stepsArray);
        const keysSteps = Object.keys(steps);

        const stepsCheck = keysStepsArray.reduce((acc, key) => {
            const matchingKey = keysSteps.find((keyIn) => key === keyIn);
            return matchingKey
                ? { ...acc, [key]: steps[matchingKey] }
                : { ...acc, [key]: stepsArray[key] };
        }, {});
        const containsNoArrays = Object.values(stepsCheck).every((value) => !Array.isArray(value));

        const stepsKeys = Object.keys(stepsCheck);

        if (needSteps && containsNoArrays && stepsKeys.length === keysStepsArray.length) {
            setIsDisable(false);
        } else {
            setIsDisable(true);
        }

        dispatch(setStepsToSend(stepsCheck));
    }, [steps, stepsArray]);

    const updateDocumentsOptions = () => {
        const options = documents.map((document) => ({
            value: document.id,
            label: LocalText.getName(document),
        }));

        setDocumentsOptions(options ?? []);
    };

    const handleSelect = (id) => {
        dispatch(resetDocInfo());
        dispatch(resetDocument());
        dispatch(resetUsers());
        const current = documents.find((document) => document.id === id);

        const actionsKeys = Object.keys(current.actions.args[0]);
        if (actionsKeys.includes("position_change")) dispatch(setPositionChange(true));

        if (current.path) dispatch(setTwoLanguage(true));

        dispatch(setDocument(current ?? {}));
    };

    const deleteOrder = () => {
        if (draftId) {
            console.log("deleted");
        } else {
            dispatch(resetDocuments());
            navigate(`${APP_PREFIX_PATH}/management/letters`);
        }
    };

    const handleDraft = () => {
        console.log("draft");
    };

    const transformedTagsValue = () => {
        return Object.entries(tagsValue).reduce((acc, [key, value]) => {
            if (value.names) {
                acc[key] = {
                    value: Array.isArray(value.value)
                        ? value.value[value.value.length - 1]
                        : value.value,
                    name: value.names.name ?? value.names.ru,
                    nameKZ: value.names.nameKZ ?? value.names.kz,
                };
            } else if (value.value?._d) {
                acc[key] = {
                    value: moment(value.value).format("YYYY-MM-DD"),
                    name: formatDate(value.value, false),
                    nameKZ: formatDate(value.value, true),
                };
            } else if (value.kz) {
                acc[key] = {
                    name: value.ru ?? "",
                    nameKZ: value.kz ?? "",
                };
            } else if (value.value) {
                if (value.value.kz) {
                    acc[key] = {
                        name: value.value.ru ?? "",
                        nameKZ: value.value.kz ?? "",
                    };
                } else {
                    acc[key] = {
                        name: value.value ?? "",
                        nameKZ: value.value ?? "",
                    };
                }
            }
            return acc;
        }, {});
    };

    const signOrder = async () => {
        const propertiesSend = transformedTagsValue();

        let params = {
            docId: selectedDocument.id,
            status: 1,
            date: dueDate,
            userId: selectedUser.id,
            properties: propertiesSend,
            steps: stepsToSend,
            comment: comment,
            actions: selectedDocument.actions,
        };

        try {
            params.certificate_blob = getCertificate();
            await HrDocumentService.hr_document_post_ecp(params);
            await AuthService.refreshToken();

            accept("Приказ иницирован");
        } catch (error) {
            console.log(error);
            notification.error({
                message: "Приказ не иницирован",
            });
            throw error;
        }
    };

    const accept = (massage) => {
        navigate(`${APP_PREFIX_PATH}/management/letters`);
        notification.success({
            message: massage,
        });
    };

    const { needComment, needDueDate } = useSelector((state) => state.initializationDocuments);

    const initButtonDisable = () => {
        if (!selectedDocument.id) return true;

        const properties = transformedTagsValue();
        const keys = Object.keys(properties);

        if (tagsInfo.length !== keys.length) return true;

        if (twoLanguage) {
            if (
                keys.some(
                    (key) =>
                        properties[key].nameKZ.trim() === "" && properties[key].name.trim() === "",
                )
            )
                return true;
        }
        if (!twoLanguage) {
            if (keys.some((key) => properties[key].nameKZ.trim() === "")) return true;
        }

        if (!selectedUser.id) return true;

        if (needComment && comment.trim() === "") return true;

        if (needDueDate && dueDate) return true;

        if (!wrongUser) return true;

        return false;
    };

    return (
        <Row>
            <SignEcp callback={signOrder} open={isEcpOpen} onClose={() => setIsEcpOpen(false)} />
            <Col xl={3}>
                <h4 style={{ marginTop: "6px" }}>
                    <IntlMessage id="initiate.chooseOrder" />
                </h4>
            </Col>
            <Col xl={12} align="start">
                <Select
                    allowClear
                    style={{ width: 400 }}
                    onChange={handleSelect}
                    loading={documentsLoading}
                    options={documentsLoading ? [LOADING_OPTION] : documentsOptions}
                />
            </Col>
            <Col xl={9}>
                <Row align="end">
                    <Button onClick={deleteOrder} style={{ marginLeft: 10 }} danger>
                        <IntlMessage id={"initiate.deleteAll"} style={{ marginRight: "10px" }} />
                    </Button>
                    <Button style={{ marginLeft: 10 }} onClick={handleDraft}>
                        <IntlMessage id={draftId ? "initiate.save" : "initiate.draftAll"} />
                    </Button>
                    <Button
                        style={{ marginLeft: 10 }}
                        type="primary"
                        // disabled={initButtonDisable() || isDisable}
                        onClick={() => setIsEcpOpen(true)}
                    >
                        <IntlMessage id={["initiate.initiate"]} />
                    </Button>
                </Row>
            </Col>
        </Row>
    );
};

export default Header;
