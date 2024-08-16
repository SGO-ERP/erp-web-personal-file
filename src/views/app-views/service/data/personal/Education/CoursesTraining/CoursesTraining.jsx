import { FileTextTwoTone } from "@ant-design/icons";
import { Col, notification, Row } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import IntlMessage from "../../../../../../../components/util-components/IntlMessage";
import { getCourseProviders } from "../../../../../../../store/slices/myInfo/educationSlice";
import CollapseErrorBoundary from "../../common/CollapseErrorBoundary";
import { useAppSelector } from "../../../../../../../hooks/useStore";
import { LocalText } from "../../../../../../../components/util-components/LocalizationText/LocalizationText";
import ModalCourseEdit from "../modals/ModalCourseEdit";
import EducationService from "services/myInfo/EducationService";
import { PERMISSION } from "constants/permission";

let CoursesTraining = ({ setModalState, courseList, source = "get" }) => {
    const [currentCourse, setCurrentCourse] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const courseProviders = useSelector((state) => state.education.course_provider.data);
    const dispatch = useDispatch();

    const profile = useSelector((state) => state.profile.data);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);

    useEffect(() => {
        if (courseProviders.length === 0) return;
        dispatch(getCourseProviders());
    }, []);

    const { course_provider } = useSelector((state) => state.education);

    const getCourseName = (id) => {
        if (!course_provider.data.objects) return;
        const objectName = course_provider.data.objects.find((item) => item.id === id);
        return LocalText.getName(objectName);
    };

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
        setCurrentCourse(course);
        setShowEditModal(true);
    };

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            {currentCourse && (
                <ModalCourseEdit
                    onClose={() => setShowEditModal(false)}
                    isOpen={showEditModal}
                    source={source}
                    course={currentCourse}
                />
            )}
            {courseList.length !== 0 &&
                courseList.map((item, index) => {
                    if (!item.delete) {
                        return (
                            <div
                                // TEMP: key={item.id}
                                key={index}
                                className={modeRedactor ? " clickable-accordion" : ""}
                                onClick={() => handleClick(item)}
                            >
                                <Row>
                                    <Col xs={22}>
                                        <Row>
                                            <Col xs={24}>
                                                <p
                                                    style={{
                                                        marginBottom: "2px",
                                                        lineHeight: "24px",
                                                    }}
                                                    className="course"
                                                >
                                                    {item.name !== undefined
                                                        ? LocalText.getName(item)
                                                        : item.name}
                                                </p>
                                            </Col>
                                            <Col>
                                                <Row align="middle">
                                                    <p style={{ color: "#1a3353", fontSize: 12 }}>
                                                        {getCourseName(item.course_provider_id)}
                                                    </p>
                                                    <p
                                                        className={"font-style"}
                                                        style={{
                                                            color: "#366EF6",
                                                            fontSize: "12px",
                                                            marginLeft: "20px",
                                                        }}
                                                    >
                                                        {moment(item.start_date).format(
                                                            "DD.MM.YYYY",
                                                        )}{" "}
                                                        -{" "}
                                                        {moment(item.end_date).format("DD.MM.YYYY")}
                                                    </p>
                                                </Row>
                                            </Col>
                                        </Row>
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
                    }
                })}
        </CollapseErrorBoundary>
    );
};

export default CoursesTraining;
