import { FileSearchOutlined, HomeFilled, PhoneFilled, UpCircleFilled } from "@ant-design/icons";
import { Button, Card, Col, Row, Spin, Tooltip } from "antd";
import PopOverRankConstant from "components/shared-components/AvatarWithPopOver";
import TextComponent from "components/shared-components/NullableText/index";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import { APP_PREFIX_PATH } from "configs/AppConfig";
import { useEffect, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSteps } from "store/slices/hrDocumentStepSlice";
import { Tabs } from "store/slices/tableControllerSlice/tableControllerSlice";
import { fetchStaffDivision } from "store/slices/userStaffDivisionSlice";
import HrStepHistory from "../components/steps/Steps";
import "../pysmaStyle.css";
// import { fetchUserRankById } from 'store/slices/getRankByIdSlice';
import Spinner from "../../../service/data/personal/common/Spinner";
import StaffDivisionService from "services/StaffDivisionService";
import { useTranslation } from "react-i18next";
import UserRankById from "services/GetRankByIdService";
import UserMyDataService from "services/userMyData/userMyDataService";
import { getFamilyStatus } from "store/slices/userDataSlice/userDataSlice";
import moment from "moment";
import ServicesService from "services/myInfo/ServicesService";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";

export const SecondCardPysma = ({ isModal }) => {
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const store = useStore();
    const [info, setInfo] = useState(null);
    const [nameOld, setNameOld] = useState([]);
    const { i18n } = useTranslation();

    let userData = useSelector((state) => state.tableController.userCard);
    let steps = useSelector((state) => state.steps.steps);

    let user = userData?.users?.[0];
    const isLoading = useSelector((state) => state.steps.isLoading);
    const navigateToPersonalData = () =>
        navigate(`${APP_PREFIX_PATH}/duty/data/${user.id}`, { state: { name: "order" } });
    const navigateToDocument = () =>
        navigate(`${APP_PREFIX_PATH}/management/letters/document`, { state: userData });

    const navigateToPersonalDataService = () => navigate(`${APP_PREFIX_PATH}/duty/data/${user.id}`);

    useEffect(() => {
        const state = store.getState();
        if (state.tableController.currentTab !== Tabs.candidates) {
            dispatch(fetchSteps(userData.id));
            dispatch(fetchStaffDivision(user?.staff_unit?.staff_division?.parent_group_id));
        }

        StaffDivisionService.staff_division_name(
            userData?.users?.[0].staff_unit.staff_division_id,
        ).then((r) => {
            if (r) {
                setNameOld(r);
            } else {
                setNameOld(["CГО РК", " RK"]);
            }
        });
    }, []);

    const familyStatus = useSelector((state) => state.userMyData.familyStatus);

    useEffect(() => {
        dispatch(getFamilyStatus());
    }, []);

    useEffect(() => {
        if (nameOld) {
            drawInfo();
        }
    }, [nameOld]);

    function calculateAge(dateString) {
        const birthdate = new Date(dateString);
        const today = new Date();

        let age = today.getFullYear() - birthdate.getFullYear();

        const m = today.getMonth() - birthdate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
            age--;
        }

        return age;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);

        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    }

    function ageWord(age) {
        const lastDigit = age % 10;

        if (lastDigit === 1 && age !== 11) {
            return "год";
        } else if (lastDigit >= 2 && lastDigit <= 4 && (age < 12 || age > 14)) {
            return "года";
        } else {
            return "лет";
        }
    }

    const findDate = (dateString) => {
        const formattedDate = formatDate(dateString);

        return formattedDate;
    };

    const findAge = (dateString) => {
        const age = calculateAge(dateString);
        const word = ageWord(age);

        return age + " " + word;
    };

    const takeFullPos = () => {
        let fullNameOld;
        let fullNameOldKZ;

        if (nameOld) {
            fullNameOld = nameOld.name;
            fullNameOldKZ = nameOld.nameKZ;
        }

        const namesToDisplay = i18n.language === "ru" ? fullNameOld : fullNameOldKZ;

        if (namesToDisplay) {
            return (
                <div style={{ marginTop: "15px" }}>
                    <p
                        className="textBlue"
                        style={{ marginBottom: 2 }}
                        dangerouslySetInnerHTML={{
                            __html: namesToDisplay.replace(/ \/ /g, "<br/>"),
                        }}
                    />
                </div>
            );
        }
    };

    function formatDateName(dateStr) {
        const months = [
            "января",
            "февраля",
            "марта",
            "апреля",
            "мая",
            "июня",
            "июля",
            "августа",
            "сентября",
            "октября",
            "ноября",
            "декабря",
        ];

        const monthKz = [
            "қаңтар",
            "ақпан",
            "наурыз",
            "сәуір",
            "мамыр",
            "маусым",
            "шілде",
            "тамыз",
            "қыркүйек",
            "қазан",
            "қараша",
            "желтоқсан",
        ];

        const date = new Date(dateStr);

        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();

        return `${day} ${i18n.language ? months[month] : monthKz[month]} ${year}`;
    }

    const formatDateYear = (dateString, date_1, date_2) => {
        const date = new Date(dateString);
        const date1 = new Date(date_1);
        const date2 = new Date(date_2);
        const year = date.getFullYear();
        const date1Millis = date1.getTime();
        const date2Millis = date2.getTime();
        const differenceMillis = Math.abs(date2Millis - date1Millis);
        const days = Math.round(differenceMillis / (1000 * 60 * 60 * 24));
        return `${year} г. (${days} дней)`;
    };

    const drawInfo = async () => {
        const info = userData?.new_value[0];
        const infoUser = userData?.users[0];

        if (info && info["add_badge"] !== undefined) {
            setInfo(
                <div
                    style={{
                        width: "100%",
                        height: "280px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <p className="textInfo">
                        {i18n.language === "ru" ? "Новая медаль:" : "Жаңа медаль:"}
                    </p>

                    <img
                        src={info["add_badge"].url}
                        alt="Изображение черного берета"
                        style={{ marginRight: 15, width: 25, height: 46 }}
                    />
                    <p className="textRank" style={{ marginTop: 10 }}>
                        {i18n.language === "ru" ? info["add_badge"].name : info["add_badge"].nameKZ}
                    </p>
                </div>,
            );
        }

        if (info && info["add_black_beret"] !== undefined) {
            setInfo(
                <div
                    style={{
                        width: "100%",
                        height: "280px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <p className="textInfo" style={{ textAlign: "center" }}>
                        {i18n.language === "ru"
                            ? "Присвоение черного берета:"
                            : "Қара береттің тағайындалуы:"}
                    </p>

                    <img
                        src={info["add_black_beret"].url}
                        alt="Изображение черного берета"
                        style={{ marginRight: 15, width: 46, height: 46 }}
                    />
                    <p className="textRank" style={{ marginTop: 10 }}>
                        {i18n.language === "ru"
                            ? info["add_black_beret"].name
                            : info["add_black_beret"].nameKZ}
                    </p>
                </div>,
            );
        }

        if (info && info["delete_badge"] !== undefined) {
            setInfo(
                <div
                    style={{
                        width: "100%",
                        height: "280px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <p className="textInfo">
                        {i18n.language === "ru" ? "Лишение медали:" : "Медальдан айырылу:"}
                    </p>

                    <img
                        src={info["delete_badge"].url}
                        alt="Изображение черного берета"
                        style={{ marginRight: 15, width: 25, height: 46 }}
                    />
                    <p className="textRank" style={{ marginTop: 10 }}>
                        {i18n.language === "ru"
                            ? info["delete_badge"].name
                            : info["delete_badge"].nameKZ}
                    </p>
                </div>,
            );
        }

        if (info && info["delete_black_beret"] !== undefined) {
            setInfo(
                <div
                    style={{
                        width: "100%",
                        height: "280px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <p className="textInfo" style={{ textAlign: "center" }}>
                        {i18n.language === "ru"
                            ? "Лишение черного берета:"
                            : "Қара береттен айыру:"}
                    </p>

                    <img
                        src={info["delete_black_beret"].url}
                        alt="Изображение черного берета"
                        style={{ marginRight: 15, width: 46, height: 46 }}
                    />
                    <p className="textRank" style={{ marginTop: 10 }}>
                        {i18n.language === "ru"
                            ? info["delete_black_beret"].name
                            : info["delete_black_beret"].nameKZ}
                    </p>
                </div>,
            );
        }

        if (info && info["position_change"] !== undefined) {
            let num = 0;
            let fullNameOld;
            let oldPos;
            let newValue = null;

            if (userData.old_history_id !== null) {
                newValue = await UserRankById.get_user_positionId(userData.old_history_id);
            }

            const propertiesKeys = Object.keys(userData.properties);
            const newPosition = propertiesKeys
                .map(
                    (item) =>
                        userData.properties[item].value === info["position_change"].id &&
                        userData.properties[item],
                )
                .filter(Boolean);

            const actual_position = propertiesKeys.includes("actual_position_id")
                ? userData.properties["actual_position_id"]
                : null;

            const actual_position_lang =
                i18n.language === "ru"
                    ? ` (за счет должности ${LocalText.getName(newPosition[0])})`
                    : ` (лауазымы есебінен ${LocalText.getName(newPosition[0])})`;

            const finalPosition = actual_position
                ? LocalText.getName(actual_position) + actual_position_lang
                : LocalText.getName(newPosition[0]);

            let fullNameNew = await StaffDivisionService.staff_division_name(
                info["position_change"].staff_division_id,
            );

            if (newValue) {
                fullNameOld = await StaffDivisionService.staff_division_name(
                    newValue.staff_division_id,
                );
                oldPos = newValue;
            } else {
                fullNameOld = nameOld;
                const position = userData.users[0].staff_unit.actual_position
                    ? userData.users[0].staff_unit.actual_position
                    : userData.users[0].staff_unit.position;
                oldPos = position;
            }

            if (i18n.language === "ru") {
                fullNameOld = fullNameOld.name;
                fullNameNew = fullNameNew.name;
            } else {
                fullNameOld = fullNameOld.nameKZ;
                fullNameNew = fullNameNew.nameKZ;
            }

            if (fullNameNew && fullNameOld) {
                setInfo(
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <div>
                            <div style={{ color: "#1A3353" }}>
                                <div>
                                    <p className="textInfo" style={{ width: 160, marginBottom: 6 }}>
                                        {i18n.language === "ru"
                                            ? "Новая должность:"
                                            : "Жаңа лауазым:"}
                                    </p>
                                </div>
                                <p className="textRank" key={num} style={{ marginBottom: 6 }}>
                                    {finalPosition}
                                </p>
                                <p
                                    className="textBlue"
                                    style={{ marginBottom: 2 }}
                                    dangerouslySetInnerHTML={{
                                        __html: fullNameNew.replace(/ \/ /g, "<br/>"),
                                    }}
                                />
                            </div>
                            <div
                                style={{
                                    margin: "10px 0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <UpCircleFilled style={{ fontSize: 21, color: "#366EF6" }} />
                            </div>
                            <div>
                                <div>
                                    <p className="textInfo" style={{ width: 160, marginBottom: 6 }}>
                                        {i18n.language === "ru"
                                            ? "Старая должность:"
                                            : "Ескі позиция:"}
                                    </p>
                                </div>
                                <p className="textRank" key={num} style={{ marginBottom: 6 }}>
                                    {LocalText.getName(oldPos)}
                                </p>
                                <p
                                    className="textBlue"
                                    style={{ marginBottom: 2 }}
                                    dangerouslySetInnerHTML={{
                                        __html: fullNameOld.replace(/ \/ /g, "<br/>"),
                                    }}
                                />
                            </div>
                        </div>
                    </div>,
                );
            }
        }

        if (info && info["add_secondment"] !== undefined) {
            let num = 0;
            let findObj;
            let date1 = null;
            let date2;

            for (let item of info["add_secondment"]) {
                if (typeof item !== "object") {
                    if (date1 == null) {
                        date1 = formatDate(item);
                    } else {
                        date2 = formatDate(item);
                        let date21 = formatDate(item);
                        if (date1 > date2) {
                            date2 = date1;
                            date1 = date21;
                        }
                    }
                } else {
                    findObj = item;
                }
            }

            let fullNameNew = await StaffDivisionService.staff_division_name(findObj.id);

            if (i18n.language === "ru") {
                fullNameNew = fullNameNew[1].split(" / ");
            }

            setInfo(
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        justifyContent: "center",
                        marginTop: "30px",
                    }}
                >
                    <div style={{ color: "#1A3353" }}>
                        <p>{date1 + " - " + date2}</p>
                        <div>
                            <p className="textInfo" style={{ width: 160, marginBottom: 6 }}>
                                {i18n.language === "ru" ? "Новая должность:" : "Жаңа лауазым:"}
                            </p>
                        </div>
                        {fullNameNew.map((el) => {
                            num++;
                            return (
                                <p className="textBlue" key={num} style={{ marginBottom: 2 }}>
                                    {el}
                                </p>
                            );
                        })}
                    </div>
                    <div
                        style={{
                            margin: "10px 0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <UpCircleFilled style={{ fontSize: 21, color: "#366EF6" }} />
                    </div>
                    <div>
                        <div>
                            <p className="textInfo" style={{ width: 160, marginBottom: 6 }}>
                                {i18n.language === "ru" ? "Старая должность:" : "Ескі позиция:"}
                            </p>
                        </div>
                        {takeFullPos()}
                    </div>
                </div>,
            );
        }

        if (info && info["grant_leave"] !== undefined) {
            let start_date;
            let end_date;
            if (moment(info["grant_leave"][1]).isBefore(moment(info["grant_leave"][2]))) {
                start_date = formatDate(info["grant_leave"][1]);
                end_date = formatDate(info["grant_leave"][2]);
            } else {
                start_date = formatDate(info["grant_leave"][2]);
                end_date = formatDate(info["grant_leave"][1]);
            }

            const isPregnancy =
                info["grant_leave"][0]?.name === "В отпуске по беременности и родам";

            setInfo(
                <div
                    style={{
                        width: "100%",
                        height: "280px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <p className="textInfo" style={{ textAlign: "center" }}>
                        {
                            isPregnancy && i18n.language === "ru"
                                ? "Отпуск по беременности"
                                : "Декреттік демалыс"
                            // : i18n.language === 'ru'
                            // ? 'Отпуск ежегодный'
                            // : 'Жыл сайынғы демалыс'
                        }
                    </p>
                    <p className="textRank" style={{ marginTop: 10 }}>
                        {i18n.language === "ru" ? "За счет" : "Арқасында"}{" "}
                        {formatDateYear(
                            info["grant_leave"][0].created_at,
                            info["grant_leave"][1],
                            info["grant_leave"][2],
                        )}
                    </p>
                    <p className="textBlue" style={{ marginTop: -5 }}>
                        {end_date}
                    </p>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <UpCircleFilled style={{ fontSize: 21, color: "#366EF6" }} />
                    </div>
                    <p className="textBlue" style={{ marginTop: 10 }}>
                        {start_date}
                    </p>
                </div>,
            );
        }

        if (info && info["stop_leave"] !== undefined) {
            setInfo(
                <div
                    style={{
                        width: "100%",
                        height: "280px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <p className="textInfo" style={{ textAlign: "center" }}>
                        {i18n.language === "ru" ? "Отзыв с отпуска" : "Демалыстан шолу"}
                    </p>
                    <a
                        style={{
                            display: "flex",
                            textAlign: "center",
                            textDecoration: "underline",
                        }}
                    >
                        {info["stop_leave"].status_name}
                        <br />
                        {info["stop_leave"].document_number +
                            " от " +
                            formatDate(info["stop_leave"].date_from)}
                    </a>
                </div>,
            );
        }

        if (info && info["increase_rank"]) {
            const currentRanks = info["increase_rank"];

            setInfo(
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 280,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <p className="textInfo" style={{ marginBottom: 6 }}>
                            {i18n.language === "ru" ? "Новое звание:" : "Жаңа дәреже"}
                        </p>
                        <img
                            src={currentRanks?.new_rank?.military_url}
                            alt=""
                            width={41}
                            style={{ marginBottom: 10 }}
                        />
                        <p className="textRank" style={{ marginBottom: 6 }}>
                            {LocalText.getName(currentRanks?.new_rank)}
                        </p>
                    </div>
                    <div
                        style={{
                            margin: "10px 0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <UpCircleFilled style={{ fontSize: 21, color: "#366EF6" }} />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <p className="textInfo" style={{ marginBottom: 6 }}>
                            {i18n.language === "ru" ? "Старое звание:" : "Ескі тақырып:"}
                        </p>
                        <img
                            src={currentRanks?.old_rank?.military_url}
                            alt=""
                            width={41}
                            style={{ marginBottom: 10 }}
                        />
                        <p className="textRank" style={{ marginBottom: 6 }}>
                            {LocalText.getName(currentRanks?.old_rank)}
                        </p>
                    </div>
                </div>,
            );
        }

        if (info["decrease_rank"] !== undefined) {
            const currentRanks = info["decrease_rank"];

            setInfo(
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 280,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <p className="textInfo" style={{ marginBottom: 6 }}>
                            {LocalText.getName(currentRanks?.new_rank)}
                        </p>
                        <img
                            src={currentRanks?.new_rank?.military_url}
                            alt=""
                            width={41}
                            style={{ marginBottom: 10 }}
                        />
                        <p className="textRank" style={{ marginBottom: 6 }}>
                            {LocalText.getName(currentRanks?.new_rank)}
                        </p>
                    </div>
                    <div
                        style={{
                            margin: "10px 0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <UpCircleFilled style={{ fontSize: 21, color: "#366EF6" }} />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <p className="textInfo" style={{ marginBottom: 6 }}>
                            {i18n.language === "ru" ? "Старое звание:" : "Ескі тақырып:"}
                        </p>
                        <img
                            src={currentRanks?.old_rank?.military_url}
                            alt=""
                            width={41}
                            style={{ marginBottom: 10 }}
                        />
                        <p className="textRank" style={{ marginBottom: 6 }}>
                            {LocalText.getName(currentRanks?.old_rank)}
                        </p>
                    </div>
                </div>,
            );
        }

        if (info && info["renew_contract"] !== undefined) {
            let date1 = null;
            let date2;
            let newObj;

            for (let item of info["renew_contract"]) {
                if (typeof item !== "object") {
                    if (date1 == null) {
                        date1 = formatDateName(item);
                    } else {
                        date2 = formatDateName(item);
                        let date21 = formatDateName(item);
                        if (date1 > date2) {
                            date2 = date1;
                            date1 = date21;
                        }
                    }
                } else {
                    newObj = item;
                }
            }

            setInfo(
                <div
                    style={{
                        width: "100%",
                        height: "280px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <p className="textInfo" style={{ textAlign: "center" }}>
                        {i18n.language === "ru" ? newObj.name : newObj.nameKZ}:
                    </p>
                    <p className="textBlue" style={{ marginTop: -5, textAlign: "center" }}>
                        {i18n.language == "ru" ? newObj.name : newObj.nameKZ}
                    </p>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <UpCircleFilled style={{ fontSize: 21, color: "#366EF6" }} />
                    </div>
                    <p className="textBlue" style={{ marginTop: 10 }}>
                        {date2}
                    </p>
                </div>,
            );
        }

        if (info && info["temporary_status_change"] !== undefined) {
            let date1 = null;
            let date2;
            let newObj;

            for (let item of info["temporary_status_change"]) {
                if (typeof item !== "object") {
                    if (date1 == null) {
                        date1 = formatDateName(item);
                    } else {
                        date2 = formatDateName(item);
                        let date21 = formatDateName(item);
                        if (date1 > date2) {
                            date2 = date1;
                            date1 = date21;
                        }
                    }
                } else {
                    newObj = item;
                }
            }

            setInfo(
                <div
                    style={{
                        width: "100%",
                        height: "280px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <p className="textInfo" style={{ textAlign: "center" }}>
                        {i18n.language === "ru"
                            ? "Смена рабочего статуса:"
                            : "Жұмыс күйінің өзгеруі"}
                    </p>
                    <p className="textRank" style={{ marginTop: -5, textAlign: "center" }}>
                        {i18n.language == "ru" ? newObj.name : newObj.nameKZ}
                    </p>
                    <p className="textBlue" style={{ marginTop: -5, textAlign: "center" }}>
                        {date1}
                    </p>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <UpCircleFilled style={{ fontSize: 21, color: "#366EF6" }} />
                    </div>
                    <p className="textBlue" style={{ marginTop: 10 }}>
                        {date2}
                    </p>
                </div>,
            );
        }

        if (info && info["sick_leave"] !== undefined) {
            let date1 = null;
            let date2;

            for (let item of info["sick_leave"]) {
                if (typeof item !== "object") {
                    if (date1 == null) {
                        date1 = formatDateName(findDate(item));
                    } else {
                        date2 = formatDateName(findDate(item));
                        let date21 = formatDateName(findDate(item));
                        if (date1 > date2) {
                            date2 = date1;
                            date1 = date21;
                        }
                    }
                }
            }

            setInfo(
                <div
                    style={{
                        width: "100%",
                        height: "280px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <p className="textInfo" style={{ textAlign: "center" }}>
                        {i18n.language === "ru" ? "Отпуск по болезни:" : "Ауру бойынша демалыс:"}
                    </p>
                    <p className="textBlue" style={{ marginTop: -5, textAlign: "center" }}>
                        {date1}
                    </p>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <UpCircleFilled style={{ fontSize: 21, color: "#366EF6" }} />
                    </div>
                    <p className="textBlue" style={{ marginTop: 10 }}>
                        {date2}
                    </p>
                </div>,
            );
        }

        if (info && info["status_change"] !== undefined) {
            setInfo(
                <div
                    style={{
                        width: "100%",
                        height: "280px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <p className="textInfo" style={{ textAlign: "center" }}>
                        {i18n.language == "ru"
                            ? "Смена статуса на постоянный:"
                            : "Күйді тұрақты күйге өзгерту:"}
                    </p>
                    <p className="textRank" style={{ marginTop: -5, textAlign: "center" }}>
                        {i18n.language == "ru"
                            ? info["status_change"].name
                            : info["status_change"].nameKZ}
                    </p>
                </div>,
            );
        }

        if (info && info["add_secondment_to_state_body"] !== undefined) {
            let findObj;
            let date1 = null;
            let date2;

            for (let item of info["add_secondment_to_state_body"]) {
                if (typeof item !== "object") {
                    if (date1 == null) {
                        date1 = formatDate(item);
                    } else {
                        date2 = formatDate(item);
                        let date21 = formatDate(item);
                        if (date1 < date2) {
                            date2 = date1;
                            date1 = date21;
                        }
                    }
                } else {
                    findObj = item;
                }
            }

            setInfo(
                <div
                    style={{
                        width: "100%",
                        height: "280px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <p className="textInfo" style={{ textAlign: "center" }}>
                        {i18n.language === "ru" ? "Откомандирования в:" : "Шығу:"}
                    </p>
                    <p className="textRank" style={{ marginTop: -5, textAlign: "center" }}>
                        {i18n.language == "ru" ? findObj.name : findObj.nameKZ}
                    </p>
                    <p className="textBlue" style={{ marginTop: -5, textAlign: "center" }}>
                        {date1}
                    </p>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <UpCircleFilled style={{ fontSize: 21, color: "#366EF6" }} />
                    </div>
                    <p className="textBlue" style={{ marginTop: 10 }}>
                        {date2}
                    </p>
                </div>,
            );
        }

        if (info && info["add_penalty"] !== undefined) {
            setInfo(
                <div
                    style={{
                        width: "100%",
                        height: "280px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <p className="textInfo" style={{ textAlign: "center" }}>
                        {i18n.language == "ru"
                            ? "Наложение дисциплинарного взыскания:"
                            : "Тәртіптік жаза қолдану:"}
                    </p>
                    <p className="textRank" style={{ marginTop: 10 }}>
                        {i18n.language === "ru"
                            ? info["add_penalty"].name
                            : info["add_penalty"].nameKZ}
                    </p>
                </div>,
            );
        }

        if (info && info["delete_penalty"] !== undefined) {
            setInfo(
                <div
                    style={{
                        width: "100%",
                        height: "280px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <p className="textInfo" style={{ textAlign: "center" }}>
                        {i18n.language == "ru"
                            ? "Досрочное снятие дисциплинарного взыскания:"
                            : "Тәртіптік жазаны мерзімінен бұрын алып тастау:"}
                    </p>
                    <p className="textRank" style={{ marginTop: 10, textAlign: "center" }}>
                        {i18n.language === "ru"
                            ? info["delete_penalty"].penalty_type.name
                            : info["delete_penalty"].penalty_type.nameKZ}
                    </p>
                    <p
                        className="textRank"
                        style={{
                            marginTop: 10,
                            textAlign: "center",
                            color: "#72849A",
                        }}
                    >
                        {steps[0].assigned_to.staff_unit.actual_position
                            ? steps[0].assigned_to.staff_unit.actual_position.name
                            : steps[0].assigned_to.staff_unit.position.name}
                        <br />
                        {info["delete_penalty"].document_number +
                            " От " +
                            findDate(steps[0].assigned_to.created_at)}
                    </p>
                </div>,
            );
        }
    };

    if (isLoading && !nameOld) {
        return (
            <div
                style={{
                    width: "480px",
                    border: "1px solid #E6EBF1",
                    borderRadius: "8px",
                    boxShadow: "0px 1px 4px -1px rgba(0, 0, 0, 0.15)",
                    backgroundColor: "#FFFFFF",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Spinner />
            </div>
        );
    }

    if (nameOld) {
        return (
            <Card style={{ width: "600px" }}>
                <Row>
                    <Col xs={9}>
                        <Row style={{ marginBottom: 15 }}>
                            <p className="textTitle tm0">
                                <TextComponent
                                    text={LocalText.getName(userData?.document_template)}
                                />
                            </p>
                        </Row>
                        <Row>
                            <Card
                                style={{
                                    maxWidth: 180,
                                    minWidth: 180,
                                    minHeight: 280,
                                    padding: 0,
                                }}
                                bodyStyle={{ padding: 10 }}
                            >
                                {info}
                            </Card>
                        </Row>
                    </Col>
                    <Col xs={15}>
                        <Row style={{ minHeight: 215 }}>
                            <Col xs={11}>
                                <Row className="1">
                                    <Col xs={24} justify="center">
                                        <PopOverRankConstant user={userData?.users?.[0]} />
                                    </Col>
                                    <Col xs={23}>
                                        <p
                                            className="textInfo"
                                            style={{ marginTop: 19, textAlign: "center" }}
                                        >
                                            <TextComponent
                                                text={LocalText.getName(user?.rank)}
                                                defaultMessage="Звание отсутствует"
                                            />
                                        </p>
                                    </Col>
                                    <Col xs={24}>
                                        <Col>
                                            {i18n.language === "ru"
                                                ? "Позывной: "
                                                : "Қоңырау белгісі: "}
                                            <TextComponent text={user?.call_sign} />
                                        </Col>
                                        <Col>
                                            {i18n.language === "ru" ? "ID номер: " : "ID нөмірі: "}
                                            <TextComponent text={user?.id_number} />
                                        </Col>
                                    </Col>
                                </Row>
                            </Col>
                            <Col className="1" xs={13}>
                                <Col xs={24} style={{ marginLeft: 15 }}>
                                    <div style={{ minHeight: 148 }}>
                                        <div className="textName">
                                            <TextComponent text={user?.last_name} />{" "}
                                            <TextComponent text={user?.first_name} />{" "}
                                            <TextComponent text={user?.father_name} />
                                        </div>
                                        <div
                                            className="textBirth"
                                            style={{ width: 61, marginTop: 10, height: 50 }}
                                        >
                                            {findDate(user?.date_birth)} {findAge(user?.date_birth)}{" "}
                                            {/* {i18n.language === 'ru'
                                                ? familyStatus.name
                                                : familyStatus.nameKZ} */}
                                        </div>
                                        <Row style={{ margin: "auto" }}>
                                            <Col>
                                                <Col md={24}>{takeFullPos()}</Col>
                                            </Col>
                                        </Row>
                                    </div>
                                    <Row justify="end" style={{ marginTop: 14 }}>
                                        <Col
                                            lg={24}
                                            style={{
                                                display: "flex",
                                                justifyContent: "end",
                                                gap: "5.5px",
                                            }}
                                        >
                                            <Tooltip title={"Номер телефона"}>
                                                <PhoneFilled style={{ marginTop: 4 }} />
                                            </Tooltip>{" "}
                                            <p className="tm0">
                                                <TextComponent text={user?.service_phone_number} />
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row justify="end">
                                        <Col
                                            lg={24}
                                            style={{
                                                display: "flex",
                                                justifyContent: "end",
                                                gap: "5.5px",
                                            }}
                                        >
                                            <Tooltip title={"Домашний Адрес"}>
                                                <HomeFilled style={{ marginTop: 4 }} />
                                            </Tooltip>{" "}
                                            <p className="tm0">
                                                <TextComponent
                                                    text={user?.cabinet}
                                                    defaultMessage={
                                                        localStorage.getItem("lan") === "kk"
                                                            ? "Мекенжайы жоқ"
                                                            : "Адрес отсутствует"
                                                    }
                                                />
                                            </p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Col>
                        </Row>
                        <Row style={{ minHeight: 60 }}>
                            <Col lg={24} style={{ display: "flex", justifyContent: "flex-end" }}>
                                {user?.badges?.length > 0
                                    ? user?.badges
                                          .filter((badge) => badge.date_to === null)
                                          .map((badge, index) => {
                                              if (index == 0 || index == 1) {
                                                  return (
                                                      <img
                                                          key={index}
                                                          src={badge.type.url}
                                                          title={
                                                              i18n.language === "ru"
                                                                  ? badge.type.name
                                                                  : badge.type.nameKZ
                                                          }
                                                          style={
                                                              badge?.type?.name.toLowerCase() ===
                                                              "черный берет"
                                                                  ? {
                                                                        width: 46,
                                                                        height: 46,
                                                                        marginTop: 10,
                                                                        marginLeft: 10,
                                                                    }
                                                                  : {
                                                                        width: 25,
                                                                        height: 46,
                                                                        marginTop: 10,
                                                                        marginLeft: 10,
                                                                    }
                                                          }
                                                      />
                                                  );
                                              }

                                              if (index > 1 && index < 3) {
                                                  return (
                                                      <div
                                                          className="textBadge"
                                                          key={index}
                                                          style={{
                                                              width: 40,
                                                              height: 40,
                                                              marginTop: 10,
                                                              marginLeft: 10,
                                                              border: "1px solid #E6EBF1",
                                                              borderRadius: 10,
                                                              display: "flex",
                                                              justifyContent: "center",
                                                              alignItems: "center",
                                                          }}
                                                      >
                                                          +{user?.badges?.length - 2}
                                                      </div>
                                                  );
                                              }
                                          })
                                    : null}
                            </Col>
                        </Row>
                        <Row align="middle" style={{ minHeight: 60, justifyContent: "flex-end" }}>
                            <Col xs={5}>
                                {userData?.status?.name === "Завершен" && (
                                    <Button
                                        variant="primary"
                                        className="mx-1"
                                        style={{
                                            height: 42,
                                            padding: "0px 15px",
                                        }}
                                        onClick={navigateToDocument}
                                    >
                                        <FileSearchOutlined style={{ fontSize: 24 }} />
                                    </Button>
                                )}
                            </Col>
                            <Col
                                xs={6}
                                style={{ display: "flex", justifyContent: "end" }}
                                justify="end"
                            >
                                <Button
                                    shape="default"
                                    type="primary"
                                    variant="primary"
                                    style={{
                                        padding: "0px 15px",
                                        width: 82,
                                        height: 42,
                                        whiteSpace: "pre-line",
                                    }}
                                    onClick={navigateToPersonalData}
                                    disabled={isModal ? isModal : false}
                                >
                                    {i18n.language !== "ru" ? "Жеке іс" : "Личное\nдело"}
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <hr className="my-4" style={{ marginLeft: "4%", marginRight: "4%" }} />
                <div style={{ marginBottom: "10%" }}>
                    {isLoading ? (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Spin size="large"></Spin>
                        </div>
                    ) : (
                        <HrStepHistory steps={steps} />
                    )}
                </div>
            </Card>
        );
    }
};
