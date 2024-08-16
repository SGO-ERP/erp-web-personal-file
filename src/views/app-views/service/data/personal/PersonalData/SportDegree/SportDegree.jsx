import { FileTextTwoTone } from "@ant-design/icons";
import { Col, Divider, notification, Row } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ModelSkillSportsEdit from "../modals/ModalSkillSportsEdit";
import IntlMessage from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import CollapseErrorBoundary from "../../common/CollapseErrorBoundary";
import { useAppSelector } from "hooks/useStore";
import { PERMISSION } from "constants/permission";

// source = 'get' - data comes from GET (small) slice. Editing of get modal
// source = 'edited' - data comes from myInfo.edited slice. Editing of edited modal
// source = 'added' - data comes from myInfo.allTabs. Editing of added modal

const SportDegree = ({ degrees, source = "get", setModalState }) => {
    const [currentDegree, setCurrentDegree] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    const profile = useSelector((state) => state.profile.data);

    const handleClick = (degree) => {
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
        setCurrentDegree(degree);
        setShowEditModal(true);
    };

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            <Row
                gutter={[18, 16]}
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                {currentDegree && (
                    <ModelSkillSportsEdit
                        degree={currentDegree}
                        isOpen={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        source={source}
                    />
                )}

                {degrees?.length > 0 &&
                    degrees
                        .filter((item) => !item.delete)
                        .map((degree, i) => (
                            <React.Fragment key={i}>
                                <Col
                                    xs={20}
                                    className={
                                        "font-style" + (modeRedactor && " clickable-accordion")
                                    }
                                    onClick={() => handleClick(degree)}
                                >
                                    <h5>{LocalText.getName(degree.sport_type)}</h5>

                                    {LocalText.getName(degree)}
                                    <p
                                        style={{ color: "#366EF6", fontSize: "12px" }}
                                        className={"font-style"}
                                    >
                                        {moment(degree.assignment_date || "").format("DD.MM.YYYY")}
                                    </p>
                                </Col>
                                <Col>
                                    {degree.document_link === null ||
                                    degree.document_link === undefined ? null : (
                                        <FileTextTwoTone
                                            style={{ fontSize: "20px" }}
                                            /*  ADD THIS TO USE CALLBACK FOR MODAL WITH FILE */
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setModalState({
                                                    open: false,
                                                    link: degree.document_link,
                                                });
                                            }}
                                        />
                                    )}
                                </Col>
                                {i < degree.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
            </Row>
        </CollapseErrorBoundary>
    );
};

export default SportDegree;
