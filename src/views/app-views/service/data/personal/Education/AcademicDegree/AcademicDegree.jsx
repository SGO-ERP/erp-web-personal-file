import { Col, Divider, notification, Row, Spin } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ModalAcademicDegreeEdit from "../modals/ModalAcademicDegreeEdit";
import IntlMessage from "components/util-components/IntlMessage";
import CollapseErrorBoundary from "../../common/CollapseErrorBoundary";
import { useAppSelector } from "hooks/useStore";
import { FileTextTwoTone } from "@ant-design/icons";
import EducationService from "services/myInfo/EducationService";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";
import { PERMISSION } from "constants/permission";

const AcademicDegree = ({ academicList, setModalState }) => {
    const [loading, setLoading] = useState(false);
    const [currentNames, setCurrentNames] = useState({});
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);

    const [showEditModal, setShowEditModal] = useState(false);
    const [currentDegree, setCurrentDegree] = useState(null);

    const [degreeOptions, setDegreeOptions] = useState([]);
    const [scienceOptions, setScienceOptions] = useState([]);
    const [specialtyOptions, setSpecialtyOptions] = useState([]);

    const profile = useSelector((state) => state.profile.data);
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
        setCurrentDegree(course);
        setShowEditModal(true);
    };

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const promises = academicList.map(async (item, index) => {
                    await getNames("degree", item.degree_id, index);
                    await getNames("science", item.science_id, index);
                    await getNames("specialty", item.specialty_id, index);
                });

                await Promise.all(promises);
            } catch (error) {
                console.log("failed get names, ", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchOptionsData = async (baseUrl, type) => {
            const response = await SelectPickerMenuService.getEducation({
                skip: 0,
                limit: 9999,
                baseUrl,
            });

            return response.objects.map((item) => ({
                value: item.id,
                label: LocalText.getName(item),
                object: item,
            }));
        };

        const fetchDegreeOptions = async () => {
            const degreeOptions = await fetchOptionsData(
                "/education/academic_degree_degrees",
                "degree_academic",
            );
            setDegreeOptions(degreeOptions);
        };

        const fetcScienceOptions = async () => {
            const scienceOptions = await fetchOptionsData("/education/sciences", "science");
            setScienceOptions(scienceOptions);
        };

        const fetchSpecialtyOptions = async () => {
            const specialtyOptions = await fetchOptionsData(
                "/education/specialties",
                "specialization",
            );
            setSpecialtyOptions(specialtyOptions);
        };

        fetchData();

        fetchDegreeOptions();
        fetcScienceOptions();
        fetchSpecialtyOptions();
    }, []);

    const getNames = async (type, id, idx) => {
        let response;

        if (type === "degree" && id) {
            response = await EducationService.get_academic_degree_types_id(id);
        }
        if (type === "science" && id) {
            response = await EducationService.get_sciences_id(id);
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
                {currentDegree && (
                    <ModalAcademicDegreeEdit
                        onClose={() => setShowEditModal(false)}
                        isOpen={showEditModal}
                        degree={currentDegree}
                    />
                )}
                {academicList
                    .filter((item) => !item.delete)
                    .map((item, index) => (
                        <div
                            key={item.id}
                            onClick={() =>
                                handleClick({
                                    ...item,
                                    degree_name:
                                        degreeOptions.filter((d) => d.value === item.degree_id)[0]
                                            ?.label ?? "",
                                    science_name:
                                        scienceOptions.filter((d) => d.value === item.science_id)[0]
                                            ?.label ?? "",
                                    specialty_name:
                                        specialtyOptions.filter(
                                            (d) => d.value === item.specialty_id,
                                        )[0]?.label ?? "",
                                })
                            }
                            className={modeRedactor && " clickable-accordion"}
                        >
                            <Row gutter={[18, 16]}>
                                <Col xs={12} className={"font-style text-muted"}>
                                    <IntlMessage id="education.AcademicTitle.degree" />
                                </Col>
                                <Col xs={12} className={"font-style"}>
                                    {item.degree?.label ||
                                        LocalText.getName(item.degree) ||
                                        item.degree_name}
                                </Col>
                                <Col xs={12} className={"font-style text-muted"}>
                                    <IntlMessage id="service.data.modalAcademicDegree.science" />
                                </Col>
                                <Col xs={12} className={"font-style"}>
                                    {item.science?.label ||
                                        LocalText.getName(item.science) ||
                                        item.science_name}
                                </Col>
                                <Col xs={12} className={"font-style text-muted"}>
                                    <IntlMessage id="education.AcademicTitle.specialty" />
                                </Col>
                                <Col xs={12} className={"font-style"}>
                                    {item.specialty?.label ||
                                        LocalText.getName(item.specialty) ||
                                        item.specialty_name}
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

export default AcademicDegree;
