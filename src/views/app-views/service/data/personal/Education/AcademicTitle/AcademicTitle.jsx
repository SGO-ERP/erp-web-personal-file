import { Col, Divider, notification, Row, Spin } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import ModalAcademicTitleEdit from "../modals/ModalAcademicTitleEdit";
import IntlMessage from "components/util-components/IntlMessage";
import CollapseErrorBoundary from "../../common/CollapseErrorBoundary";
import { useAppSelector } from "hooks/useStore";
import { FileTextTwoTone } from "@ant-design/icons";
import EducationService from "services/myInfo/EducationService";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import { PERMISSION } from "constants/permission";

const AcademicTitle = ({ academicList, setModalState }) => {
    const [loading, setLoading] = useState(false);
    const [currentNames, setCurrentNames] = useState({});
    const profile = useSelector((state) => state.profile.data);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);

    const [showEditModal, setShowEditModal] = useState(false);
    const [currentRank, setCurrentRank] = useState(null);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);

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
        setCurrentRank(course);
        setShowEditModal(true);
    };

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const promises = academicList.map(async (item, index) => {
                    await getNames("degree", item.degree_id, index);
                    await getNames("specialty", item.specialty_id, index);
                });

                await Promise.all(promises);
            } catch (error) {
                console.log("failed get names, ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getNames = async (type, id, idx) => {
        let response;

        if (type === "degree" && id) {
            response = await EducationService.get_academic_title_degree_id(id);
        }
        if (type === "specialty" && id) {
            response = await EducationService.get_specialties_id(id);
        }

        setCurrentNames((prevData) => ({
            ...prevData,
            [idx]: {
                ...prevData[idx],
                [type]: response,
            },
        }));
    };

    return (
        <Spin spinning={loading}>
            <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
                {currentRank && (
                    <ModalAcademicTitleEdit
                        isOpen={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        title={currentRank}
                    />
                )}
                {academicList
                    .filter((item) => !item.delete)
                    .map((item, index) => (
                        <div
                            key={item.id || index}
                            onClick={() => handleClick(item)}
                            className={modeRedactor && " clickable-accordion"}
                        >
                            <Row gutter={[18, 16]}>
                                <Col xs={12} className={"font-style text-muted"}>
                                    <IntlMessage id="education.AcademicTitle.degree" />
                                </Col>
                                <Col xs={12} className={"font-style"}>
                                    {currentNames?.[index]
                                        ? LocalText.getName(currentNames[index]["degree"])
                                        : ""}
                                </Col>
                                <Col xs={12} className={"font-style text-muted"}>
                                    <IntlMessage id="education.AcademicTitle.specialty" />
                                </Col>
                                <Col xs={12} className={"font-style"}>
                                    {currentNames?.[index]
                                        ? LocalText.getName(currentNames[index]["specialty"])
                                        : ""}
                                </Col>
                                <Col xs={12} className={"font-style text-muted"}>
                                    <IntlMessage id="education.AcademicTitle.dateOfAssignment" />
                                </Col>
                                <Col xs={12} className={"font-style"}>
                                    {moment(item.assignment_date).format("DD.MM.YYYY")}
                                </Col>
                                <Col xs={12} className={"font-style text-muted"}>
                                    <IntlMessage id="education.AcademicTitle.documentNum" />
                                </Col>
                                <Col xs={12} className={"font-style"}>
                                    <Row gutter={16}>
                                        <Col xs={20}>№{item.document_number || ""}</Col>

                                        <Col xs={4}>
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
                                </Col>
                            </Row>
                            <Divider />
                        </div>
                    ))}
            </CollapseErrorBoundary>
        </Spin>
    );
};
export default AcademicTitle;
