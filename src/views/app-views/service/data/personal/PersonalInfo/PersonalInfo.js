import { Button, Col, notification, Row, Spin, Typography, Input } from "antd";
import AvatarStatus from "components/shared-components/AvatarStatus";
import IntlMessage from "components/util-components/IntlMessage";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "store/slices/users/usersSlice";
import LocalizationText, {
    LocalText,
} from "../../../../../../components/util-components/LocalizationText/LocalizationText";
import { resetValues, save, setMode } from "../../../../../../store/slices/myInfo/myInfoSlice";
import EditInput from "../common/EditInput";
import { useAppSelector } from "../../../../../../hooks/useStore";
import StaffDivisionService from "../../../../../../services/StaffDivisionService";
import { getNameChangedHistory } from "store/slices/myInfo/personalInfoSlice";
import {
    setAllTabsPersonalInfoPhoneNumber,
    setInitialTabsPersonalInfoPhoneNumber,
} from "../../../../../../store/slices/myInfo/myInfoSlice";
import { phoneNumberFormatter } from "utils/phoneNumberFormatter/phoneNumberFormatter";
import { PERMISSION } from "constants/permission";

const { Text } = Typography;

export const PersonalInfo = ({ id }) => {
    let user = useSelector((state) => state.users.user);
    let isLoading = useSelector((state) => state.users.loading);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);

    const canEditPsycChar = myPermissions?.includes(PERMISSION.PSYCH_CHARACTERISTIC_EDITOR);
    const canEditPolygRes = myPermissions?.includes(PERMISSION.POLIGRAPH_EDITOR);

    const [divisionId, setDivisionId] = useState("");
    const [departament, setDepartament] = useState({ name: "", nameKZ: "", id: "" });

    const phoneNumber = useAppSelector(
        (state) => state.myInfo.allTabs.user_info.phone_number.value,
    );
    const formatedPhoneNumberResult =
        user?.phone_number != null ? phoneNumberFormatter.formatSync(user?.phone_number) : "";

    const dispatch = useDispatch();

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = () => {
        dispatch(getUser(id))
            .then((userData) => {
                setDivisionId(userData.payload.staff_unit.staff_division_id);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        if (!divisionId) return;
        fetchDivision(divisionId);
    }, [divisionId]);

    const fetchDivision = async (id) => {
        if (id) {
            try {
                const response = await StaffDivisionService.get_department(id);
                setDepartament(response);
            } catch (e) {
                setDepartament({ name: "", nameKZ: "", id: "" });
            }
        }
    };

    const handleSave = async () => {
        try {
            dispatch(save(user.id));
            dispatch(setMode(false));
            fetchUser();
            dispatch(getNameChangedHistory(user.id));
            notification.success({
                message: "Данные успешно сохранены",
            });
        } catch (error) {
            notification.error({
                message: "Некоторые данные могли не сохраниться",
            });
        }
    };

    useEffect(() => {
        if (!user?.phone_number) {
            return;
        }
        const setPhoneNumber = async (phoneNumber) => {
            try {
                const inputPhoneNumber = phoneNumber.replace(/\D/g, "");
                const formattedPhoneNumber = await phoneNumberFormatter.format(inputPhoneNumber);
                dispatch(setAllTabsPersonalInfoPhoneNumber(formattedPhoneNumber));
                dispatch(setInitialTabsPersonalInfoPhoneNumber(formattedPhoneNumber));
            } catch (error) {
                console.log("Error on format phone number");
            }
        };
        setPhoneNumber(user.phone_number);
    }, [user]);

    const discardChanges = () => {
        dispatch(setMode(false));
        dispatch(resetValues());
        window.location.reload();
    };

    const handleEdit = () => {
        fetchUser();
        dispatch(setMode(true));
    };

    const defaultText = {
        name: "",
        nameKZ: "",
    };

    let rankUrl = "/img/rank.png";

    if (user?.is_military) {
        rankUrl = user?.rank?.military_url ?? "/img/rank.png";
    } else {
        rankUrl = user?.rank?.employee_url ?? "/img/rank.png";
    }

    const handlePhoneNumberChange = async (event) => {
        const inputPhoneNumber = event.target.value.replace(/\D/g, "");

        if (inputPhoneNumber.length > 11) {
            return;
        }
        try {
            const formattedPhoneNumber = await phoneNumberFormatter.format(inputPhoneNumber);
            dispatch(setAllTabsPersonalInfoPhoneNumber(formattedPhoneNumber));
            dispatch(setInitialTabsPersonalInfoPhoneNumber(formattedPhoneNumber));
        } catch (error) {
            console.log("Error on format phone number");
        }
    };

    if (isLoading) {
        return (
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
        );
    }
    if (!user || !user?.actual_staff_unit || Array.isArray(user)) {
        return null;
    }
    return (
        <div>
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
            ) : (
                <>
                    {/* Row for name  */}
                    <Row justifycontent="space-between">
                        <Col xxs={24} xs={24} md={24} lg={12} xl={14}>
                            <Row style={{ alignItems: "center", flexWrap: "nowrap", gap: "12px" }}>
                                <Col
                                    style={{
                                        color: "#1A3353",
                                        fontWeight: "500",
                                        fontSize: "20px",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {user.father_name
                                        ? user.last_name +
                                          " " +
                                          user.first_name +
                                          " " +
                                          user?.father_name
                                        : user.last_name + " " + user.first_name}
                                </Col>
                                <Col style={{ color: "#72849A", fontSize: "16px" }}>
                                    {user?.statuses.length > 0 && (
                                        <LocalizationText text={user?.statuses[0]?.type} />
                                    )}
                                </Col>
                                <Col
                                    style={{
                                        marginLeft: "10px",
                                        fontSize: "20px",
                                        marginTop: "10px",
                                    }}
                                >
                                    {/*<FileTextTwoTone />*/}
                                </Col>
                            </Row>
                        </Col>
                        {isHR || canEditPsycChar || canEditPolygRes ? (
                            <Col
                                xxs={24}
                                xs={24}
                                md={24}
                                lg={12}
                                xl={10}
                                style={{ display: "flex", justifyContent: "end" }}
                            >
                                <Row gutter={4}>
                                    <Col style={{ paddingLeft: 0 }}>
                                        <Button shape="round" size={"small"}>
                                            {" "}
                                            <IntlMessage id="personal.button.updateData" />{" "}
                                        </Button>
                                    </Col>
                                    <Col>
                                        {modeRedactor && (
                                            <Button
                                                shape="round"
                                                size={"small"}
                                                onClick={discardChanges}
                                            >
                                                <IntlMessage id="personal.button.undoChanges" />
                                            </Button>
                                        )}
                                        {(!modeRedactor && isHR) ||
                                        (!modeRedactor && canEditPsycChar) ||
                                        (!modeRedactor && canEditPsycChar) ? (
                                            <Button
                                                shape="round"
                                                size={"small"}
                                                onClick={handleEdit}
                                            >
                                                <IntlMessage id="personal.button.edit" />{" "}
                                            </Button>
                                        ) : null}
                                    </Col>
                                    <Col>
                                        {!modeRedactor && (
                                            <Button type="primary" shape="round" size={"small"}>
                                                <IntlMessage id="personal.button.download" />{" "}
                                            </Button>
                                        )}
                                        {modeRedactor && (
                                            <Button
                                                type="primary"
                                                shape="round"
                                                size={"small"}
                                                onClick={handleSave}
                                            >
                                                <IntlMessage id="personal.button.save" />{" "}
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                            </Col>
                        ) : null}
                    </Row>

                    {/* Row for avatar and etc. */}
                    <Row
                        style={{ marginTop: "20px", alignItems: "center", flexWrap: "nowrap" }}
                        gutter={16}
                    >
                        <Col xl={3} style={{ marginBottom: "20px" }}>
                            <AvatarStatus size={120} src={user.icon} style={{ margin: "20px" }} />
                            <img
                                src={rankUrl}
                                alt={"Rank"}
                                style={{
                                    width: 50,
                                    height: 50,
                                    position: "absolute",
                                    top: 75,
                                    left: 90,
                                }}
                            />
                        </Col>
                        <Col style={{ width: "100%", display: "flex", alignItems: "start" }}>
                            <Col xl={6} lg={6}>
                                <Row className="user-info-container">
                                    <span>
                                        <Text style={{ fontWeight: 500 }}>
                                            <IntlMessage id="personal.generalInfo.birthday" />
                                        </Text>
                                    </span>
                                    <span>{moment(user.date_birth).format("DD.MM.YYYY")}</span>
                                </Row>
                                <Row className="user-info-container">
                                    <span>
                                        <Text style={{ fontWeight: 500 }}>
                                            <IntlMessage id="personal.generalInfo.personalID" />
                                        </Text>
                                    </span>
                                    <EditInput
                                        style={{ width: 80 }}
                                        defaultValue={user.personal_id ?? ""}
                                        fieldName="allTabs.user_info.personal_id"
                                        fieldNameGet="initialTabs.user_info.personal_id"
                                    />
                                </Row>
                                <Row className="user-info-container">
                                    <span>
                                        <Text style={{ fontWeight: 500 }}>
                                            <IntlMessage id="personal.generalInfo.personalNum" />
                                        </Text>
                                    </span>
                                    <span>
                                        <EditInput
                                            style={{ width: 100 }}
                                            defaultValue={user?.id_number ?? ""}
                                            fieldName="allTabs.user_info.id_number"
                                            fieldNameGet="initialTabs.user_info.id_number"
                                        />
                                    </span>
                                </Row>
                            </Col>
                            <Col xl={6} lg={6}>
                                <Row className="user-info-container">
                                    <span>
                                        <Text style={{ fontWeight: 500 }}>
                                            <IntlMessage id="personal.generalInfo.callSign" />
                                        </Text>
                                    </span>
                                    <EditInput
                                        style={{ width: 100 }}
                                        defaultValue={user.call_sign || ""}
                                        fieldName="allTabs.user_info.call_sign"
                                        fieldNameGet="initialTabs.user_info.call_sign"
                                    />
                                </Row>
                                <Row className="user-info-container">
                                    <span>
                                        <Text style={{ fontWeight: 500 }}>
                                            <IntlMessage id="personal.generalInfo.officePhoneNum" />
                                        </Text>
                                    </span>
                                    <EditInput
                                        style={{ width: 110 }}
                                        defaultValue={user?.service_phone_number ?? ""}
                                        fieldName="allTabs.user_info.service_phone_number"
                                        fieldNameGet="initialTabs.user_info.service_phone_number"
                                    />
                                </Row>
                                <Row className="user-info-container">
                                    <span>
                                        <Text style={{ fontWeight: 500 }}>
                                            <IntlMessage id="personal.generalInfo.mobilePhone" />
                                        </Text>
                                    </span>
                                    {modeRedactor ? (
                                        <Input
                                            style={{ width: 150 }}
                                            value={phoneNumber}
                                            onChange={handlePhoneNumberChange}
                                        />
                                    ) : formatedPhoneNumberResult?.data ? (
                                        formatedPhoneNumberResult.data
                                    ) : (
                                        ""
                                    )}
                                </Row>
                            </Col>
                            <Col xl={6} lg={6}>
                                <Row className="user-info-container">
                                    <span>
                                        <Text style={{ fontWeight: 500 }}>
                                            <IntlMessage id="personal.generalInfo.division" />
                                        </Text>
                                    </span>
                                    <span>
                                        <LocalizationText text={departament || defaultText} />
                                    </span>
                                </Row>
                                <Row className="user-info-container">
                                    <span>
                                        <Text style={{ fontWeight: 500 }}>
                                            <IntlMessage id="personal.generalInfo.post" />
                                        </Text>
                                    </span>
                                    <span>
                                        {user?.staff_unit?.actual_position ? (
                                            <>
                                                {LocalText.getName(
                                                    user?.staff_unit?.actual_position,
                                                )}
                                                {user?.staff_unit?.position ? (
                                                    <span>
                                                        &nbsp; (
                                                        <IntlMessage id={"according.bill"} />
                                                        &nbsp;
                                                        {LocalText.getName(
                                                            user?.staff_unit?.position,
                                                        )}
                                                        )
                                                    </span>
                                                ) : null}
                                            </>
                                        ) : (
                                            <>
                                                {LocalText.getName(
                                                    user?.staff_unit?.actual_position
                                                        ? user?.staff_unit?.actual_position
                                                        : user?.staff_unit?.position,
                                                )}
                                            </>
                                        )}
                                    </span>
                                </Row>
                                <Row className="user-info-container">
                                    <span>
                                        <Text style={{ fontWeight: 500 }}>
                                            <IntlMessage id="personal.generalInfo.cabinetNum" />
                                        </Text>
                                    </span>
                                    <EditInput
                                        style={{ width: 90 }}
                                        defaultValue={user?.cabinet ?? ""}
                                        fieldName="allTabs.user_info.cabinet"
                                        fieldNameGet="initialTabs.user_info.cabinet"
                                    />
                                </Row>
                            </Col>
                            <Col xl={6} lg={6}>
                                <Row className="user-info-container">
                                    <span>
                                        <Text style={{ fontWeight: 500 }}>
                                            <IntlMessage id="personal.family.IIN" />:
                                        </Text>
                                    </span>
                                    <span>
                                        <EditInput
                                            style={{ width: 120 }}
                                            defaultValue={user?.iin ?? ""}
                                            fieldName="allTabs.user_info.iin"
                                            fieldNameGet="initialTabs.user_info.iin"
                                        />
                                    </span>
                                </Row>
                            </Col>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
};
export default PersonalInfo;
