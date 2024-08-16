import { HomeFilled, PhoneFilled } from "@ant-design/icons";
import { Col, Popover, Row, Table, Tooltip } from "antd";
import IntlMessage from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import { APP_PREFIX_PATH } from "configs/AppConfig";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Column } from "react-virtualized";
import AvatarStatus from "../../../../components/shared-components/AvatarStatus";
import StaffDivisionService from "../../../../services/StaffDivisionService";
import Spinner from "../data/personal/common/Spinner";

const FirstCard = (user) => {
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const currentLocale = i18n.language;
    const noDataMessage = currentLocale === "kk" ? "Деректер жоқ" : "Нет данных";
    const localizationMyDataBtn = currentLocale === "kk" ? "Жеке іс" : "Личное дело";
    const navigateToPersonalData = () => navigate(`${APP_PREFIX_PATH}/duty/data/${user.userId}`);
    const [staffDivisionName, setStaffDivisionName] = useState("");
    const [staffDivisionNamekz, setStaffDivisionNamekz] = useState("");
    const [newBadges, setNewBadges] = useState([]);

    const age = calculateAge(user.birthDate);

    const parts = staffDivisionName.split(" / ");
    const partsKZ = staffDivisionNamekz.split(" / ");

    useEffect(() => {
        if (!user || !user?.staffDivisionName) return;
        StaffDivisionService.staff_division_name(user.staffDivisionName.id).then((res) => {
            setStaffDivisionName(res.name);
            setStaffDivisionNamekz(res.nameKZ);
        });
    }, [user]);

    useEffect(() => {
        if (
            Array.isArray(user.badges) &&
            user.badges.length !== 0
        ) {
            const descSortedBadges = [...user.badges].sort((a, b) => b.type.badge_order - a.type.badge_order)
            setNewBadges(descSortedBadges)
        }
    }, [user.badges]);

    function calculateAge(dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        const lastDigit = age % 10;

        if (lastDigit === 2 || lastDigit === 3 || lastDigit === 4) {
            age = currentLocale === "kk" ? age + " жаста" : age + " года";
        } else if (lastDigit === 1) {
            age = currentLocale === "kk" ? age + " жаста" : age + " год";
        } else {
            age = currentLocale === "kk" ? age + " жаста" : age + " лет";
        }
        return age;
    }

    const content = (
        <div>
            <Table dataSource={newBadges.slice(5)}  pagination={{ pageSize: 5 }} >
                <Column
                    title="Описание"
                    dataIndex="name"
                    key="name"
                    width={20}
                    dataKey={""}
                    render={(_, record) => <span>{LocalText.getName(record?.type)}</span>}
                />
                <Column
                    title="Звание"
                    dataIndex="image"
                    key="image"
                    width={20}
                    dataKey={""}
                    render={(_, record) => (
                        <span>
                            <img
                                src={record?.type?.url}
                                style={
                                    record?.type?.name.toLowerCase() === "черный берет"
                                        ? { width: 46, height: 46 }
                                        : { width: 25, height: 46 }
                                }
                                alt={'Звание'}
                            />
                        </span>
                    )}
                />
            </Table>
        </div>
    );

    if (user.loading.userIsLoading) {
        return (
            <div>
                <Spinner />
            </div>
        );
    }
    return (
        <div
            style={{
                height: "100%",
                width: "100%",
                border: "1px solid #E6EBF1",
                borderRadius: "8px",
                boxShadow: "0px 1px 4px -1px rgba(0, 0, 0, 0.15)",
                backgroundColor: "#FFFFFF",
            }}
        >
            <div
                style={{
                    margin: "20px auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    height: "100%",
                    maxWidth: "344px",
                }}
            >
                <Row
                    style={{ display: "flex", flexWrap: "nowrap", justifyContent: "space-between" }}
                >
                    <Col style={{ height: "120px" }}>
                        <div style={{ position: "relative" }}>
                            <AvatarStatus style={{ margin: "20px" }} src={user.icon} size={120} />
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    position: "absolute",
                                    right: "7px",
                                    bottom: "-10px",
                                }}
                            >
                                {user.rankImg ? (
                                    <img
                                        src={user.rankImg}
                                        alt="Rank"
                                        style={{ width: "100%", display: "flex" }}
                                    />
                                ) : user.employeeRankImg ? (
                                    <img
                                        src={user.employeeRankImg}
                                        alt="Rank"
                                        style={{ width: "100%", display: "flex" }}
                                    />
                                ) : null}
                            </div>
                        </div>
                    </Col>
                    <Col
                        style={{
                            maxWidth: "200px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <Col>
                            <div style={{ fontWeight: "bold", color: "#1A3353", fontSize: "14px" }}>
                                {user.fatherName === null
                                    ? `${user.lastName} ${user.firstName}`
                                    : user.firstName && user.lastName
                                    ? `${user.lastName} ${user.firstName} ${user.fatherName}`
                                    : noDataMessage}
                            </div>
                        </Col>
                        <Col>
                            <div className="text-muted info-birth">
                                {user.birthDate ? (
                                    <>
                                        {moment(user.birthDate).format("DD.MM.YYYY")}, {age},{" "}
                                        {LocalText.getName(user.familyStatus)}
                                    </>
                                ) : (
                                    <div>{noDataMessage}</div>
                                )}
                            </div>
                        </Col>
                        <Col style={{}}>
                            <button
                                onClick={navigateToPersonalData}
                                style={{
                                    color: "white",
                                    padding: "5px 16px",
                                    backgroundColor: "#366EF6",
                                    borderRadius: "10px",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                {localizationMyDataBtn}
                            </button>
                        </Col>
                    </Col>
                </Row>

                <Row
                    style={{
                        marginTop: "27px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "15px",
                        flexWrap: "nowrap",
                    }}
                >
                    <Row>
                        <Col xs={24}>
                            <Col style={{ fontSize: "400", color: "#1A3353", fontWeight: "400" }}>
                                {!user.actual_position && !user.position ? (
                                    noDataMessage
                                ) : <>
                                    {LocalText.getName(user?.actual_position) ?? ''}
                                    {user.position ? (
                                        <span>
                                            &nbsp;
                                            ({LocalText.getName({
                                            name: "За счет должности",
                                            nameKZ: "Лауазымы есебінен",
                                            })} {LocalText.getName(user.position)})
                                        </span>
                                    ) : null}

                                </>}
                            </Col>
                            <Col style={{ fontSize: "500" }}>
                                {user?.userDepartament?.rank?.name
                                    ? i18n.language == "ru"
                                        ? user.userDepartament.rank.name
                                        : user.userDepartament.rank.nameKZ
                                    : noDataMessage}
                            </Col>
                        </Col>
                    </Row>

                    <Row style={{ fontSize: "12px" }}>
                        <Col>
                            {currentLocale === "kk"
                                ? partsKZ.map((item) => (
                                      <Col
                                          key={item.id}
                                          md={24}
                                          style={{ display: "flex", flexDirection: "column" }}
                                      >
                                          <span style={{ color: "#366EF6", marginBottom: "2px" }}>
                                              {item}
                                          </span>
                                      </Col>
                                  ))
                                : parts.map((item) => (
                                      <Col
                                          key={item.id}
                                          md={24}
                                          style={{ display: "flex", flexDirection: "column" }}
                                      >
                                          <span style={{ color: "#366EF6", marginBottom: "2px" }}>
                                              {item}
                                          </span>
                                      </Col>
                                  ))}
                        </Col>
                    </Row>
                </Row>

                <Row
                    style={{ marginTop: "34px", display: "flex", justifyContent: "space-between" }}
                >
                    <Row style={{}}>
                        <Col xs={24}>
                            <Col style={{ fontSize: "13px" }}>
                                <IntlMessage id="personal.generalInfo.callSign" />{" "}
                                {user.callSign ? user.callSign : noDataMessage}
                            </Col>
                            <Col style={{ fontSize: "13px" }}>
                                <IntlMessage id="myProfile.idNumber" />
                                {user.idNumber ? user.idNumber : noDataMessage}
                            </Col>
                        </Col>
                    </Row>
                    <Row style={{}}>
                        <Col>
                            <Row gutter={16}>
                                <Tooltip
                                    placement="topLeft"
                                    title={<IntlMessage id="myInfo.tooltip.phoneNumber" />}
                                >
                                    <Col>
                                        <PhoneFilled />
                                    </Col>
                                </Tooltip>
                                <Col style={{ fontSize: "13px" }}>
                                    {" "}
                                    {user.loading.user.service_phone_number
                                        ? user.loading.user.service_phone_number
                                        : noDataMessage}{" "}
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Tooltip
                                    placement="topLeft"
                                    title={<IntlMessage id="myInfo.tooltip.adsress" />}
                                >
                                    <Col>
                                        <HomeFilled />
                                    </Col>
                                </Tooltip>
                                <Col style={{ fontSize: "13px" }}>
                                    {user.loading.user.cabinet ? (
                                        user.loading.user.cabinet
                                    ) : (
                                        <div>{noDataMessage}</div>
                                    )}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Row>

                <Row
                    gutter={16}
                    justify={"center"}
                    style={{
                        margin: "15px 0",
                        display: "flex",
                        width: "100%",
                        justifyContent: "flex-start",
                    }}
                >
                    <Row
                        style={{
                            display: "flex",
                            gap: "20.8px",
                        }}
                    >
                        {newBadges?.slice(0, 5).map((badge, index) =>
                            badge ? (
                                <Col key={index} style={{ cursor: "pointer" }}>
                                    <Tooltip
                                        placement="topLeft"
                                        title={LocalText.getName(badge?.type)}
                                    >
                                        <img
                                            src={badge?.type?.url || "/img/defaults/badge.png"}
                                            alt={`badge-${index + 1}`}
                                            style={
                                                badge?.type?.name.toLowerCase() === "черный берет"
                                                    ? { width: 46, height: 46 }
                                                    : { width: 25, height: 46 }
                                            }
                                        />
                                    </Tooltip>
                                </Col>
                            ) : null,
                        )}
                        {newBadges?.length > 5 && (
                            <Col>
                                <Popover content={content} placement="right">
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            border: "1px solid #E6EBF1",
                                            borderRadius: "8px",
                                            textAlign: "center",
                                            lineHeight: "40px",
                                            fontSize: "16px",
                                            fontWeight: "400",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {newBadges?.length - 5}+
                                    </div>
                                </Popover>
                            </Col>
                        )}
                    </Row>
                </Row>
                <div></div>
            </div>
        </div>
    );
};

export default FirstCard;
