import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DownOutlined, FileTextTwoTone, UpOutlined } from "@ant-design/icons";
import { notification, Spin, Timeline } from "antd";
import { useAppSelector } from "hooks/useStore";
import moment from "moment";
import IntlMessage from "components/util-components/IntlMessage";
import LocalizationText, {
    LocalText,
} from "components/util-components/LocalizationText/LocalizationText";
import CollapseErrorBoundary from "../../common/CollapseErrorBoundary";
import ModalEducationEdit from "../modals/ModalEducationEdit";
import { PERMISSION } from "constants/permission";

const EducationDocuments = ({ setModalState, list }) => {
    const [source, setSource] = useState("get");
    const [showList, setShowList] = useState(true);
    const [currentEducation, setCurrentEducation] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);

    const profile = useSelector((state) => state.profile.data);

    const sortedEducations = list
        .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))

    const { institutionDegreeType, institutions, institutionsMilitary, specialties } = useSelector(
        (state) => state.education,
    );

    const limitedEducations = showList ? sortedEducations.slice(0, 3) : sortedEducations;

    const handleClick = (education) => {
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
        setCurrentEducation(education);
        setSource(education.source ? education.source : "get");
        setShowEditModal(true);
    };

    useEffect(() => {
        setShowList(modeRedactor ? false : true);
    }, [modeRedactor]);

    const generatePendingDot = () => {
        if (modeRedactor || list.length <= 3) return <></>;

        return showList ? (
            <DownOutlined
                onClick={() => setShowList(!showList)}
                style={{ color: "grey", fontSize: "16px" }}
            />
        ) : (
            <UpOutlined
                onClick={() => setShowList(!showList)}
                style={{ color: "grey", fontSize: "16px" }}
            />
        );
    };

    const generateInstitutionName = (id) => {
        const object =
            institutions.data.objects.find((item) => item.id === id) ??
            institutionsMilitary.data.objects.find((item) => item.id === id);
        return object ? <LocalizationText text={object} /> : "";
    };

    const generateSpecialtyName = (id) => {
        const object = specialties.data.objects.find((item) => item.id === id);
        return object ? (
            <>
                <IntlMessage id={"service.data.modalAcademicDegree.specialization"} />
                : <LocalizationText text={object} />
            </>
        ) : (
            ""
        );
    };

    const generateDegreeName = (id) => {
        const object = institutionDegreeType.data.objects.find((item) => item.id === id);
        return object ? <>({<LocalizationText text={object} />})</> : "";
    };

    if (
        institutions.loading ||
        specialties.loading ||
        institutionDegreeType.loading ||
        institutionsMilitary.loading
    )
        return <Spin spinning={true} />;

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id="myInfo.dataLoadError" />}>
            {currentEducation && (
                <ModalEducationEdit
                    onClose={() => setShowEditModal(false)}
                    isOpen={showEditModal}
                    source={source}
                    education={currentEducation}
                />
            )}
            <Timeline mode="left" pending={true} pendingDot={generatePendingDot()}>
                {limitedEducations
                    .filter((item) => !item.delete)
                    .map((item, index) => (
                        <Timeline.Item
                            // TEMP: key={item.id}
                            key={index}
                            label={
                                <div>
                                    <div className="timeline">
                                        {moment(item?.start_date).format("DD.MM.YYYY")} -{" "}
                                        {moment(item?.end_date).format("DD.MM.YYYY")}
                                    </div>
                                    <div>
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
                                                style={{
                                                    fontSize: "20px",
                                                    marginTop: "7px",
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            }
                            className={
                                "font-style" +
                                (modeRedactor && " clickable-accordion") +
                                (source !== "get" && index === 0 && " education-timeline-to-top")
                            }
                        >
                            <>
                                <div onClick={() => handleClick(item)}>
                                    <p className="timeline">
                                        {generateInstitutionName(
                                            item.institution_id ?? item.military_institution_id,
                                        )}
                                    </p>
                                    <p className="timeline">
                                        {generateSpecialtyName(item.specialty_id)}
                                        {generateDegreeName(item.degree_id)}
                                    </p>
                                    <p className="timeline-mute">
                                        {item.document_number ? (
                                            <>
                                                {<IntlMessage id={"service.data.doc"} />} &nbsp; №{" "}
                                                {item.document_number}
                                            </>
                                        ) : (
                                            <span style={{ opacity: 0 }}>.</span>
                                        )}
                                    </p>
                                </div>
                            </>
                        </Timeline.Item>
                    ))}
            </Timeline>
        </CollapseErrorBoundary>
    );
};

export default EducationDocuments;
