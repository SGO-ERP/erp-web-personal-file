import { FileTextTwoTone } from "@ant-design/icons";
import { Col, notification, Row } from "antd";
import RatingBar from "components/shared-components/RatingBar";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import IntlMessage from "components/util-components/IntlMessage";
import ModalLanguagesEdit from "../modals/ModalLanguagesEdit";
import CollapseErrorBoundary from "../../common/CollapseErrorBoundary";
import { useAppSelector } from "hooks/useStore";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import EducationService from "services/myInfo/EducationService";
import { PERMISSION } from "constants/permission";

const ForeignLanguageSkills = ({ setModalState, rateList }) => {
    const [currentLanguage, setCurrentLanguage] = useState(null);
    const [namesList, setNamesLits] = useState({});
    const [showEditModal, setShowEditModal] = useState(false);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    const profile = useSelector((state) => state.profile.data);

    const getLanguage = async (id, idx) => {
        const language = await EducationService.get_language_id(id);

        setNamesLits((prevData) => ({ ...prevData, [idx]: language }));
    };

    useEffect(() => {
        rateList
            .filter((rate) => !rate?.delete)
            .map((item, index) => {
                getLanguage(item.language_id, index);
            });
    }, [showEditModal, rateList]);

    const handleClick = (course) => {
        if (!modeRedactor) {
            return;
        }
        if (!isHR) {
            notification.warn({ message: <IntlMessage id={"personal.positionNotHR"} /> });
            return;
        }
        if (profile === null) {
            notification.warn({ message: <IntlMessage id={"personal.positionNotHR"} /> });
            return;
        }
        if (!modeRedactor) return;
        setCurrentLanguage(course);
        setShowEditModal(true);
    };

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            {currentLanguage && (
                <ModalLanguagesEdit
                    onClose={() => setShowEditModal(false)}
                    isOpen={showEditModal}
                    language={currentLanguage}
                />
            )}
            {rateList.length !== 0 &&
                rateList
                    .filter((rate) => !rate?.delete)
                    .map((item, index) => {
                        return (
                            <div
                                // TEMP: key={item.id}
                                key={index}
                                className={modeRedactor ? " clickable-accordion" : ""}
                            >
                                <Row
                                    className="align-items-center"
                                    style={{
                                        marginBottom: "1em",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Col xs={8} onClick={() => handleClick(item)}>
                                        <p
                                            className="items"
                                            style={{ marginTop: "5px", marginBottom: 0 }}
                                        >
                                            {LocalText.getName(namesList[index])}
                                        </p>
                                    </Col>
                                    <Col xs={14} onClick={() => handleClick(item)}>
                                        <RatingBar rating={item.level || ""} />
                                    </Col>
                                    <Col xs={2}>
                                        {item.document_link === null ||
                                        item.document_link === undefined ? null : (
                                            <FileTextTwoTone
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setModalState({
                                                        open: false,
                                                        link: item.document_link,
                                                    });
                                                }}
                                                style={{ fontSize: "20px" }}
                                            />
                                        )}
                                    </Col>
                                </Row>
                            </div>
                        );
                    })}
        </CollapseErrorBoundary>
    );
};

export default ForeignLanguageSkills;
