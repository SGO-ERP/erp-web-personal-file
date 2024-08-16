import { Breadcrumb, Input, Row, Tabs } from "antd";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import Additional from "./personal/Additional/Additional";
import Education from "./personal/Education/Education";
import Family from "./personal/Family/Family";
import PersonalData from "./personal/PersonalData/PersonalData";
import PersonalInformation from "./personal/PersonalInfo/PersonalInfo";
import PersonalInfoCandidate from "./personal/PersonalInfo/PersonalInfoCandidate";
import Services from "./personal/Services/Services";
import tabKeys from "./personal/common/tabKeys";
import MedicalCard from "./personal/medical-card/MedicalCard";
import "./style.css";
import { resetSlice } from "../../../../store/slices/myInfo/myInfoSlice";
import { resetUsersSlice } from "../../../../store/slices/users/usersSlice";
import ErrorBoundary from "../../management/constructor_new/ErrorBoundary";

const searchTabKeys = (searchString) => {
    const results = [];

    tabKeys.forEach((tab) => {
        const matchingAccordions = [];

        tab.accordions.forEach((accordion) => {
            const foundFields = accordion.fields.filter((field) => {
                return field.toLowerCase().includes(searchString.toLowerCase());
            });

            if (
                accordion.name.toLowerCase().includes(searchString.toLowerCase()) ||
                foundFields.length
            ) {
                matchingAccordions.push({
                    accordion: accordion,
                    foundFields,
                });
            }
        });

        if (matchingAccordions.length) {
            results.push({
                tabName: tab.name,
                accordions: matchingAccordions,
            });
        }
    });

    return results;
};

const { Search } = Input;

// type: employee | candidate
export const DefaultDashboard = ({ type = "employee" }) => {
    const { id } = useParams();
    const location = useLocation();
    const { name } = location.state || {};
    const [activeKey, setActiveKey] = useState("pers");
    const [searchAll, setSearchAll] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    let user = useSelector((state) => state.users.user);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const getAccordions = (key) => searchResult.find((item) => item.tabName === key);
    const searchHandle = (e) => {
        const value = e.target.value;
        const lowerCase = value.toLowerCase();
        setSearchAll(lowerCase);
        setSearchResult(searchTabKeys(value));
    };
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(resetSlice());
        dispatch(resetUsersSlice());
    }, [dispatch]);

    useEffect(() => {
        if (searchResult.length === 0) return;

        setActiveKey(searchResult[0]?.tabName ?? "pers");
    }, [searchResult]);

    const operations = (
        <Search
            placeholder={IntlMessageText.getText({ id: "letters.search" })}
            onChange={searchHandle}
            style={{ width: "400px" }}
        />
    );
    const handleChange = (key) => {
        setActiveKey(key);
    };


    return (
        <div>
            {modeRedactor && (
                <Row className="edit-mode-banner">
                    <IntlMessage id="personal.editMode" />
                </Row>
            )}
            {type === "employee" && (
                <Breadcrumb>
                    <Breadcrumb.Item>
                        {name === "staff" ? (
                            <Link to="/app/management/staff">
                                <IntlMessage id="sidenav.management.employees" />
                            </Link>
                        ) : name === "order" ? (
                            <Link to="/app/management/letters">
                                <IntlMessage id="sidenav.management.lettersAndOrders" />
                            </Link>
                        ) : name === "vacancy" ? (
                            <Link to="/app/management/vacancy">
                                <IntlMessage id="sidenav.management.vacancy" />
                            </Link>
                        ) : (
                            <Link to="/app/duty/data/me">
                                <IntlMessage id="sidenav.myDuty.myData" />
                            </Link>
                        )}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <IntlMessage id="personalBusiness.quote" />{" "}
                        {/*{user?.father_name === null*/}
                        {/*    ? `${user?.last_name} ${user?.first_name}`*/}
                        {/*    : user?.last_name*/}
                        {/*    ? `${user?.last_name} ${user?.first_name} ${user?.father_name}`*/}
                        {/*    : ''}*/}
                    </Breadcrumb.Item>
                </Breadcrumb>
            )}
            {type === "candidate" && (
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <a href="/app/management/letters">
                            <IntlMessage id="personal.generalInfo.candidates" />
                        </a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="/app/management/staff">
                            {user?.father_name === null
                                ? `${user?.last_name} ${user?.first_name}`
                                : user?.last_name
                                ? `${user?.last_name} ${user?.first_name} ${user?.father_name}`
                                : ""}
                        </a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="/app/management/letters">
                            <IntlMessage id="personal.generalInfo.candidateProfile" />
                        </a>
                    </Breadcrumb.Item>
                </Breadcrumb>
            )}
            {type === "employee" && <PersonalInformation id={id} />}
            {type === "candidate" && <PersonalInfoCandidate id={id} />}
            <Tabs
                onChange={handleChange}
                activeKey={activeKey}
                tabBarExtraContent={operations}
                items={[
                    {
                        label: <IntlMessage id="personal.tabs.personalData" />,
                        key: "pers",
                        children: (
                            <ErrorBoundary>
                                <PersonalData
                                    searchList={searchAll}
                                    allOpen={searchAll.length === 0}
                                    activeAccordions={getAccordions("pers")?.accordions}
                                    id={id}
                                />
                            </ErrorBoundary>
                        ),
                    },
                    {
                        label: <IntlMessage id="personal.tabs.education" />,
                        key: "edu",
                        children: (
                            <ErrorBoundary>
                                <Education
                                    id={id}
                                    allOpen={searchAll.length === 0}
                                    activeAccordions={getAccordions("edu")?.accordions}
                                />
                            </ErrorBoundary>
                        ),
                    },
                    {
                        label: <IntlMessage id="personal.tabs.serviceDetails" />,
                        key: "service",
                        children: (
                            <ErrorBoundary>
                                <Services
                                    searchList={searchAll}
                                    id={id}
                                    allOpen={searchAll.length === 0}
                                    activeAccordions={getAccordions("service")?.accordions}
                                    type={type}
                                />
                            </ErrorBoundary>
                        ),
                    },
                    {
                        label: <IntlMessage id="personal.tabs.medicalCard" />,
                        key: "medical",
                        children: (
                            <ErrorBoundary>
                                <MedicalCard
                                    searchList={searchAll}
                                    id={id}
                                    allOpen={searchAll.length === 0}
                                    activeAccordions={getAccordions("medical")?.accordions}
                                    type={type}
                                />
                            </ErrorBoundary>
                        ),
                    },
                    {
                        label: <IntlMessage id="personal.tabs.family" />,
                        key: "family",
                        children: (
                            <ErrorBoundary>
                                <Family
                                    searchList={searchAll}
                                    id={id}
                                    allOpen={searchAll.length === 0}
                                    activeAccordions={getAccordions("family")?.accordions}
                                />
                            </ErrorBoundary>
                        ),
                    },
                    {
                        label: <IntlMessage id="personal.tabs.additional" />,
                        key: "addition",
                        children: (
                            <ErrorBoundary>
                                <Additional
                                    searchList={searchAll}
                                    id={id}
                                    allOpen={searchAll.length === 0}
                                    activeAccordions={getAccordions("addition")?.accordions}
                                    type={type}
                                />
                            </ErrorBoundary>
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default DefaultDashboard;
