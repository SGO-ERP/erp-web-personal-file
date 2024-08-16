import React, { useEffect, useState } from "react";
import {
    Card,
    Checkbox,
    Col,
    Empty,
    Input,
    notification,
    PageHeader,
    Row,
    Space,
    Spin,
    Tag,
} from "antd";
import IntlMessage, { IntlMessageText } from "../../../../components/util-components/IntlMessage";
import ViewCandidates from "./modal/ViewCandidates";
import OfferCandidate from "./modal/OfferCandidate";
import { useAppDispatch } from "../../../../hooks/useStore";
import { cleanVacancies } from "../../../../store/slices/vacancy/vacancySlice";
import { LocalText } from "../../../../components/util-components/LocalizationText/LocalizationText";
import { cleanDepartments } from "../../../../store/slices/vacancy/staffDivisionDepartmentsSlice";
import HRVacancyService from "../../../../services/vacancy/HRVacancyService";
import Vacancy from "./Vacancy";
import { PrivateServices } from "../../../../API";

const { Search } = Input;

const Index = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepartmentsId, setSelectedDepartmentsId] = useState([]);

    const [openHRModal, setOpenHRModal] = useState(false);
    const [openOfferModal, setOpenOfferModal] = useState(false);
    const [selectedVacancyForHR, setSelectedVacancyForHR] = useState(null);
    const [selectedVacancyForOffer, setSelectedVacancyForOffer] = useState({});
    const [isAnyDepartmentSelected, setIsAnyDepartmentSelected] = useState(false);
    const [successOffersIds, setSuccessOffersIds] = useState([]);

    const [departments, setDepartments] = useState([]);
    const [departmentsVacancies, setDepartmentsVacancies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch();

    function getDivisionParents(division, data) {
        const stack = [];
        stack.push({ division, data });

        while (stack.length > 0) {
            const { division, data } = stack.pop();

            const updatedParents = [
                ...data,
                {
                    id: division.id,
                    name: division.name,
                    nameKZ: division.nameKZ,
                    type: division.type,
                    staff_division_number: division.staff_division_number ?? division.name,
                },
            ];

            if (Array.isArray(division.children) && division.children.length > 0) {
                stack.push({ division: division.children[0], data: updatedParents });
            } else {
                return updatedParents ?? [];
            }
        }
    }

    const seeLastChildren = async (vacancy) => {
        if (vacancy !== null) {
            const response = await PrivateServices.get(
                "/api/v1/staff_division/division_parents/{id}/",
                {
                    params: {
                        path: {
                            id: vacancy.staff_unit?.staff_division_id,
                        },
                    },
                },
            );
            if (response.data) {
                const parents = getDivisionParents(response.data, []);
                return parents;
            }
        }
        return [];
    };

    console.log(departments, "dep");
    useEffect(() => {
        setIsLoading(true);
        HRVacancyService.getStaffDivisionDepartments(0, 100)
            .then(async (response) => {
                const filteredDepartments = response.filter(
                    (department) => department.count_vacancies > 0,
                );
                setDepartments(filteredDepartments);
                const departmentPromises = filteredDepartments.map(async (department) => {
                    const response = await HRVacancyService.getByDepartmentId(department.id);
                    const vacancyPromises = response.vacancies.map(async (vacancy) => {
                        const parents = await seeLastChildren(vacancy);
                        return {
                            vacancy: vacancy,
                            parents: parents,
                        };
                    });
                    const vacancies = await Promise.all(vacancyPromises);
                    return {
                        ...department,
                        vacancies: vacancies,
                    };
                });

                const results = await Promise.all(departmentPromises);
                setDepartmentsVacancies(results);
                setIsLoading(false);
            })
            .catch((error) => {
                notification.error({
                    message: IntlMessageText.getText({ id: "error.warning.internal" }),
                });
            });

        return () => {
            dispatch(cleanVacancies());
            dispatch(cleanDepartments());
            setSelectedDepartmentsId([]);
            setIsAnyDepartmentSelected(false);
            setSearchQuery("");
        };
    }, []);

    useEffect(() => {
        setIsAnyDepartmentSelected(selectedDepartmentsId.length > 0);
    }, [selectedDepartmentsId]);

    const toggleVacanciesByDepartmentId = (id, vacancyCount) => {
        if (selectedDepartmentsId.includes(id)) {
            setSelectedDepartmentsId(selectedDepartmentsId.filter((f) => f !== id));
        } else {
            if (vacancyCount > 0) {
                setSelectedDepartmentsId([...selectedDepartmentsId, id]);
            } else {
                return null;
            }
        }
    };

    const departmentVacancy = (departments) => {
        const uniqueCards = [];
        const vacanciesWithIds = [];
        const filteredVacancies = departments?.vacancies
            .filter((card) =>
                LocalText.getName(
                    card?.vacancy?.staff_unit?.actual_position
                        ? card?.vacancy?.staff_unit?.actual_position
                        : card?.vacancy?.staff_unit?.position,
                )
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
            )
            .forEach((card) => {
                const cardId = card?.vacancy?.staff_unit?.position_id;
                const cardDivisionId = card?.vacancy?.staff_unit?.staff_division_id;
                const uniqueKey = cardId + "_" + cardDivisionId;
                if (!uniqueCards.includes(uniqueKey)) {
                    uniqueCards.push(uniqueKey);
                    vacanciesWithIds.push({
                        vacancy: card,
                        ids: [card.vacancy.id],
                    });
                } else {
                    const index = uniqueCards.indexOf(uniqueKey);
                    vacanciesWithIds[index].ids.push(card.vacancy.id);
                }
            });

        if (vacanciesWithIds.length === 0) {
            return null;
        }

        return (
            <div key={departments.id}>
                <Col
                    key={departments.id}
                    style={{
                        fontSize: "20px",
                        marginBottom: "20px",
                        fontWeight: 500,
                    }}
                >
                    {(departments.type ? LocalText.getName(departments.type) : "") +
                        " " +
                        (departments.staff_division_number ?? departments.name) +
                        " "}
                    <span
                        style={{
                            color: "#72849A",
                        }}
                    >
                        ({departments.count_vacancies})
                    </span>
                </Col>
                {filteredVacancies}
                {vacanciesWithIds.map((card, index) => (
                    <Col key={index}>
                        <Vacancy
                            card={card}
                            setOpenHRModal={setOpenHRModal}
                            setOpenOfferModal={setOpenOfferModal}
                            setSelectedVacancyForOffer={setSelectedVacancyForOffer}
                            setSelectedVacancyForHR={setSelectedVacancyForHR}
                            successOffersIds={successOffersIds}
                        />
                    </Col>
                ))}
            </div>
        );
    };

    if (!isLoading && departmentsVacancies.length === 0) {
        return (
            <>
                <PageHeader
                    title={
                        <b style={{ fontSize: "20px" }}>
                            <IntlMessage id={"vacancies"} />
                        </b>
                    }
                    backIcon={false}
                    style={{
                        backgroundColor: "white",
                        width: "calc(100% + 50px)",
                        marginLeft: "-25px",
                        marginTop: "-25px",
                    }}
                />
                <Space
                    style={{ minHeight: 400, width: "100%", justifyContent: "center" }}
                    direction="horizontal"
                    align="center"
                >
                    <Empty />
                </Space>
            </>
        );
    }

    return (
        <>
            <PageHeader
                title={
                    <b style={{ fontSize: "20px" }}>
                        <IntlMessage id={"vacancies"} />
                    </b>
                }
                backIcon={false}
                style={{
                    backgroundColor: "white",
                    width: "calc(100% + 50px)",
                    marginLeft: "-25px",
                    marginTop: "-25px",
                }}
            />
            <Row gutter={16}>
                <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5} style={{ minWidth: "250px" }}>
                    <Card style={{ marginTop: "20px" }}>
                        <Col style={{ padding: 0 }}>
                            <Row justify="start">
                                <b>
                                    <IntlMessage id={"vacancy.filter"} />
                                </b>
                            </Row>
                            <div
                                style={{
                                    height: "1px",
                                    backgroundColor: "#E6EBF1",
                                    margin: "12px 0",
                                }}
                            />
                            {isLoading ? (
                                <div
                                    style={{
                                        minHeight: "100px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Spin size="small" />
                                </div>
                            ) : (
                                <Checkbox.Group
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "10px",
                                    }}
                                >
                                    {departments.map((option, index) => (
                                        <Row key={option.id} align="bottom" justify="space-between">
                                            <Checkbox
                                                style={{
                                                    fontSize: "12px",
                                                }}
                                                value={option.id}
                                                onChange={() =>
                                                    toggleVacanciesByDepartmentId(
                                                        option.id,
                                                        option.count_vacancies,
                                                    )
                                                }
                                            >
                                                {(option.type
                                                    ? LocalText.getName(option.type)
                                                    : "") +
                                                    " " +
                                                    (option.staff_division_number ??
                                                        LocalText.getName(option))}
                                            </Checkbox>
                                            <Tag
                                                key={index}
                                                style={{
                                                    borderRadius: "14px",
                                                    fontSize: "12px",
                                                    lineHeight: "16px",
                                                    margin: 0,
                                                }}
                                            >
                                                {option?.count_vacancies}
                                            </Tag>
                                        </Row>
                                    ))}
                                </Checkbox.Group>
                            )}
                        </Col>
                    </Card>
                </Col>
                <Col xs={17} sm={17} md={17} lg={17} xl={18} xxl={19}>
                    <Row
                        justify="end"
                        style={{
                            marginTop: "20px",
                            padding: "0 16px",
                        }}
                    >
                        <Search
                            placeholder="Поиск..."
                            style={{
                                width: "300px",
                                zIndex: 2,
                            }}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Row>
                    <Col style={{ marginTop: "-40px" }}>
                        {isLoading ? (
                            <div
                                style={{
                                    minHeight: "200px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Spin size="large" />
                            </div>
                        ) : isAnyDepartmentSelected ? (
                            departmentsVacancies
                                ?.filter((item) => selectedDepartmentsId.includes(item.id))
                                .map((departments) => departmentVacancy(departments))
                        ) : (
                            departmentsVacancies.map((departments) =>
                                departmentVacancy(departments),
                            )
                        )}
                    </Col>
                </Col>
            </Row>
            {/*{openHRModal &&*/}
            <ViewCandidates
                // key={uuidv4()}
                isOpen={openHRModal}
                onClose={() => {
                    setOpenHRModal(false);
                }}
                data={selectedVacancyForHR}
            />
            {/*}*/}
            <OfferCandidate
                isOpen={openOfferModal}
                onClose={() => {
                    setOpenOfferModal(false);
                }}
                data={selectedVacancyForOffer.vacancy}
                ids={selectedVacancyForOffer.ids}
                setSuccessOffersIds={setSuccessOffersIds}
            />
        </>
    );
};

export default Index;
