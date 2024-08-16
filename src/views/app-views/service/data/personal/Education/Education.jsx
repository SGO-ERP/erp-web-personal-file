import { PlusCircleOutlined } from "@ant-design/icons";
import { Col, Collapse, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getEducation,
    getInstitution,
    getInstitutionMilitary,
    getInstitutionDegreeType,
    getCourseProviders,
    getSpecialties,
    getLanguages,
} from "store/slices/myInfo/educationSlice";
import ModalForDoc from "../../modals/ModalForDoc";
import "../../style.css";
import findAccordionByName from "../common/findAccordionByName";
import ModalController from "../common/ModalController";
import ShowOnlyForRedactor from "../common/ShowOnlyForRedactor";
import Spinner from "../common/Spinner";
import AcademicDegree from "./AcademicDegree/AcademicDegree";
import AcademicTitle from "./AcademicTitle/AcademicTitle";
import CoursesTraining from "./CoursesTraining/CoursesTraining";
import EducationDocuments from "./EducationDocuments/EducationDocuments";
import ForeignLanguageSkills from "./ForeignLanguageSkills/ForeignLanguageSkills";
import ModalAcademicDegree from "./modals/ModalAcademicDegree";
import ModalAcademicTitle from "./modals/ModalAcademicTitle";
import ModalLanguages from "./modals/ModalLanguages";
import IntlMessage from "components/util-components/IntlMessage";
import NoData from "../NoData";
import { useAppSelector } from "hooks/useStore";
import ModalEducationAdd from "./modals/ModalEducationAdd";
import ModalCourseAdd from "./modals/ModalCourseAdd";
import ShowAll from "../common/ShowAll";
import { CoursesTable } from "../PersonalData/ShowAllPersonalDataTable";
import AcademicDegreeTable from "./ShowAllEducationTable/AcademicDegreeTable";
import AcademicTitleTable from "./ShowAllEducationTable/AcademicTitleTable";
import { PERMISSION } from "constants/permission";

const { Panel } = Collapse;
const { Text } = Typography;

export const Education = ({ id, activeAccordions, allOpen }) => {
    const [modalState, setModalState] = useState({
        open: false,
        link: "",
    });

    const dispatch = useDispatch();
    const education_remote = useSelector((state) => state.education.educationData.data);
    const education_local = useSelector((state) => state.myInfo.allTabs.education);
    const education_edited = useSelector((state) => state.myInfo.edited.education);
    const loading = useSelector((state) => state.education.educationData.loading);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const languages = useSelector((state) => state.education.languages.data);
    const specialties = useSelector((state) => state.education.specialties.data);
    const sciences = useSelector((state) => state.education.sciences.data);
    const academic_degree = useSelector((state) => state.education.academic_degree.data);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);

    useEffect(() => {
        dispatch(getInstitution());
        dispatch(getInstitutionMilitary());
        dispatch(getInstitutionDegreeType());
        dispatch(getSpecialties());
        dispatch(getCourseProviders());
        dispatch(getLanguages());
    }, []);

    const takesLength = (type) => {
        if (!education_remote || education_remote.length === 0 || !education_remote[type.remote]) {
            return 0;
        }

        const remoteLength = education_remote[type.remote].length;

        const deleteEditedLength = education_edited[type.other].reduce(
            (acc, item) => acc + (item.delete ? 0 : 1),
            0,
        );

        const deleteLocalLength = education_local[type.other].reduce(
            (acc, item) => acc + (item.delete ? 0 : 1),
            0,
        );

        return remoteLength + deleteEditedLength + deleteLocalLength;
    };

    const takeFullMassive = (type) => {
        if (!education_remote || !education_remote[type.remote]) return [];

        return [
            ...education_remote[type.remote],
            ...education_local[type.other],
            ...education_edited[type.other],
        ];
    };

    const generateHeader = (type) => {
        const modals = {
            education: <ModalEducationAdd />,
            course: <ModalCourseAdd />,
        };

        const titles = {
            education: "education.eductionCardName.degree",
            course: "education.eductionCardName.courseTraining",
        };

        return (
            <Row gutter={16}>
                <Col>
                    <Text style={{ fontWeight: 500 }}>
                        <IntlMessage id={titles[type]} />
                    </Text>
                </Col>
                {isHR && (
                    <ShowOnlyForRedactor
                        forRedactor={
                            <Col>
                                <ModalController>
                                    {modals[type]}
                                    <PlusCircleOutlined
                                        style={{
                                            fontSize: "13px",
                                            color: "#366EF6",
                                        }}
                                    />
                                </ModalController>
                            </Col>
                        }
                    />
                )}
            </Row>
        );
    };

    const generateCollapse = (data) => {
        const { key, type } = data;

        const types = {
            language: {
                title: "education.eductionCardName.languageKnowledge",
                modalAdd: (
                    <ModalLanguages
                        list={takeFullMassive({
                            remote: "language_proficiency",
                            other: "add_language",
                        })}
                    />
                ),
                keyName: "Знание ин. языков",
                remote: "language_proficiency",
                other: "add_language",
            },
            education: {
                title: "education.eductionCardName.degree",
                modalAdd: <ModalEducationAdd />,
                keyName: "Образование",
                remote: "education",
                other: "add_education",
            },
            academic_degree: {
                title: "education.eductionCardName.academicDegree",
                modalAdd: <ModalAcademicDegree />,
                keyName: "Учёная степень",
                remote: "academic_degree",
                other: "add_academic_degree",
            },
            academic_title: {
                title: "education.eductionCardName.academicTitle",
                modalAdd: <ModalAcademicTitle />,
                keyName: "Ученое звание",
                remote: "academic_title",
                other: "add_academic_title",
            },
        };

        const arrayLength = takesLength({
            remote: types[type].remote,
            other: types[type].other,
        });

        const fullMassive = takeFullMassive({
            remote: types[type].remote,
            other: types[type].other,
        });

        const isEmpty = arrayLength > 0;

        const components = {
            language: (
                <ForeignLanguageSkills rateList={fullMassive} setModalState={setModalState} />
            ),
            education: <EducationDocuments list={fullMassive} setModalState={setModalState} />,
            academic_degree: (
                <AcademicDegree academicList={fullMassive} setModalState={setModalState} />
            ),
            academic_title: (
                <AcademicTitle academicList={fullMassive} setModalState={setModalState} />
            ),
        };

        const showAll = {
            academic_degree: <AcademicDegreeTable data={fullMassive} />,
            academic_title: <AcademicTitleTable data={fullMassive} />,
        };

        return (
            <Collapse
                defaultActiveKey={[key]}
                expandIconPosition={"end"}
                style={{ backgroundColor: "#FFFF" }}
            >
                <Panel
                    header={
                        <Row gutter={16}>
                            <Col>
                                <Text style={{ fontWeight: 500 }}>
                                    <IntlMessage id={types[type].title} />
                                </Text>
                            </Col>
                            {isHR && (
                                <ShowOnlyForRedactor
                                    forRedactor={
                                        <Col>
                                            <ModalController>
                                                {types[type].modalAdd}
                                                <PlusCircleOutlined
                                                    style={{
                                                        fontSize: "13px",
                                                        color: "#366EF6",
                                                    }}
                                                />
                                            </ModalController>
                                        </Col>
                                    }
                                />
                            )}
                        </Row>
                    }
                    extra={
                        (type === "academic_degree" || type === "academic_title") &&
                        fullMassive.length > 0 &&
                        !modeRedactor ? (
                            <ShowAll intlId={"personal.personalData.sportsSkills"}>
                                {showAll[type]}
                            </ShowAll>
                        ) : null
                    }
                    key={findAccordionByName(allOpen, activeAccordions, types[type].keyName, key)}
                >
                    {isEmpty > 0 ? components[type] : <NoData />}
                </Panel>
            </Collapse>
        );
    };

    useEffect(() => {
        dispatch(getEducation(id));
    }, []);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div>
            <Row gutter={[18, 16]}>
                <Col xs={24} lg={12}>
                    <Row gutter={[18, 16]}>
                        <Col xs={24}>{generateCollapse({ key: "1", type: "education" })}</Col>

                        <Col xs={24}>
                            <Collapse
                                defaultActiveKey={["2"]}
                                expandIconPosition={"end"}
                                style={{ backgroundColor: "#FFFF" }}
                            >
                                <Panel
                                    header={generateHeader("course")}
                                    key={findAccordionByName(
                                        allOpen,
                                        activeAccordions,
                                        "Курсы/обучение",
                                        "2",
                                    )}
                                    extra={
                                        education_remote?.course?.length && !modeRedactor ? (
                                            <ShowAll
                                                intlId={"education.eductionCardName.courseTraining"}
                                            >
                                                <CoursesTable data={education_remote.course} />
                                            </ShowAll>
                                        ) : null
                                    }
                                    className={"panel-with-hide"}
                                >
                                    {takesLength({
                                        remote: "course",
                                        other: "add_course",
                                    }) > 0 ? (
                                        <>
                                            <CoursesTraining
                                                courseList={education_remote?.course}
                                                setModalState={setModalState}
                                            />
                                            {isHR && (
                                                <ShowOnlyForRedactor
                                                    forRedactor={
                                                        <>
                                                            <CoursesTraining
                                                                courseList={
                                                                    education_local.add_course
                                                                }
                                                                source="added"
                                                                setModalState={setModalState}
                                                            />
                                                            <CoursesTraining
                                                                courseList={
                                                                    education_edited.add_course
                                                                }
                                                                source="edited"
                                                                setModalState={setModalState}
                                                            />
                                                        </>
                                                    }
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <NoData />
                                    )}
                                </Panel>
                            </Collapse>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} lg={12}>
                    <Row gutter={[18, 16]}>
                        <Col xs={24}>{generateCollapse({ key: "3", type: "language" })}</Col>
                        <Col xs={24}>{generateCollapse({ key: "4", type: "academic_degree" })}</Col>
                        <Col xs={24}>{generateCollapse({ key: "5", type: "academic_title" })}</Col>
                    </Row>
                </Col>
            </Row>
            <ModalForDoc setModalState={setModalState} modalState={modalState} />
        </div>
    );
};
export default Education;
