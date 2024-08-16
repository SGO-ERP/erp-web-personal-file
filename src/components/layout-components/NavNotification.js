import {
    BellOutlined,
    CheckCircleOutlined,
    MailOutlined,
    WarningOutlined,
    InfoCircleTwoTone,
} from "@ant-design/icons";
import { Badge, Button, Col, List, notification, Popover, Row } from "antd";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import IntlMessage from "../util-components/IntlMessage";
import NotificationService from "../../services/NotificationService";
import ModalNotification from "./ModalNotification";
import { AUTH_TOKEN } from "constants/AuthConstant";
import { env } from "../../configs/EnvironmentConfig";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchInfoNotifications,
    fetchOrdersNotifications,
    setNotificationModal,
} from "store/slices/notifications/notificationSlice";
import "./navNotificationStyle.css";

const getIcon = (icon) => {
    switch (icon) {
        case "mail":
            return <MailOutlined />;
        case "console.log":
            return <WarningOutlined />;
        case "check":
            return <CheckCircleOutlined />;
        default:
            return <MailOutlined />;
    }
};

const getNotificationBody = (value) => {
    const list = value;

    return list && list?.length > 0 ? (
        <List
            size="small"
            itemLayout="horizontal"
            dataSource={list}
            renderItem={(item) => (
                <List.Item>
                    <Row gutter={16}>
                        <Col xs={4}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <InfoCircleTwoTone
                                    style={{
                                        fontSize: "24px",
                                        marginTop: "10px",
                                    }}
                                    twoToneColor="#FF4D4F"
                                />
                            </div>
                        </Col>
                        <Col xs={20}>
                            <Row>
                                <Col xs={24}>
                                    {item.hr_document !== null ? (
                                        <IntlMessage id={"notification.warning.prykaz"} />
                                    ) : (
                                        item.survey !== null && (
                                            <IntlMessage id={"notification.warning.survey"} />
                                        )
                                    )}
                                </Col>
                                <Col xs={24}>{moment(item.created_at).format("DD.MM.YYYY")}</Col>
                            </Row>
                        </Col>
                    </Row>
                    {/*<div*/}
                    {/*    style={{*/}
                    {/*        justifyContent: "space-between",*/}
                    {/*        display: "flex",*/}
                    {/*        alignItems: "center",*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <div className="mr-3">*/}
                    {/*        /!* <span className="font-weight-bold text-dark">Text </span> *!/*/}
                    {/*        <span className="text-gray-light">*/}
                    {/*            {item.message}*/}
                    {/*            {*/}
                    {/*                item.hr_document !== null*/}
                    {/*                ?*/}
                    {/*                <IntlMessage id={'notification.warning.prykaz'} />*/}
                    {/*                    :*/}
                    {/*                    item.survey !== null*/}
                    {/*                &&*/}
                    {/*                    <IntlMessage id={'notification.warning.survey'} />*/}
                    {/*            }*/}
                    {/*        </span>*/}
                    {/*    </div>*/}
                    {/*    <div style={{ display: "flex", flexDirection: "column" }}>*/}
                    {/*        <small className="ml-auto">*/}
                    {/*        </small>*/}
                    {/*        <small className="ml-auto">*/}
                    {/*            {" "}*/}
                    {/*            {moment(item.created_at).format("HH:mm")}*/}
                    {/*        </small>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </List.Item>
            )}
        />
    ) : (
        <div className="empty-notification">
            <img
                src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
                alt="empty"
            />
            <p className="mt-3">
                <IntlMessage id={"notification.none"} />
            </p>
        </div>
    );
};

export const NavNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [closableModal, setClosableModal] = useState(false);
    const [currentCookie, setCurrentCookie] = useState(null);
    const [openByNotification, setOpenByNotification] = useState(true);
    const [notificationInfo, setNotificationInfo] = useState([]);

    const [timer, setTimer] = useState(0);

    useEffect(() => {
        console.log("openByNotification: ", openByNotification);
    }, [openByNotification]);

    const profile = useSelector((state) => state.profile.data);
    const token = localStorage.getItem(AUTH_TOKEN);
    const {
        isNotificationModal,
        infoTablePagination,
        orderTablePagination,
        ordersTotal,
        orderNotifications,
    } = useSelector((state) => state.notification);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);

    const dispatch = useDispatch();

    useEffect(() => {
        let socket = new WebSocket(`wss://${env.NOTIFICATION_WS_URL}?token=${token}`);

        socket.onopen = () => {
            console.log("WebSocket connection opened.");
            // You can now send data to the server or handle other logic.
        };

        socket.onmessage = function (event) {
            try {
                if (event.data !== "CONNECTED") {
                    const data = JSON.parse(event.data);

                    if (data.message) {
                        changeNotification(data);

                        notification.info({
                            message: "Новое уведомление",
                            description: data.message,
                        });
                    }
                }
            } catch (error) {
                // If parsing as JSON fails, treat it as plain text
                const plainText = event.data;

                // Handle the plain text message or simply ignore it
                console.log(`Received plain text message: ${plainText} ${error}`);
            }
        };

        socket.onclose = function (event) {
            if (event.wasClean) {
                console.log(
                    `close: Соединение закрыто чисто, код=${event.code} причина=${event.reason}`,
                );
            } else {
                // например, сервер убил процесс или сеть недоступна
                // обычно в этом случае event.code 1006
                console.log("close: Соединение прервано");
            }
        };

        socket.onerror = function (error) {
            // console.log(error);
        };

        fetchNotifications();
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [isNotificationModal]);

    const fetchNotifications = () => {
        dispatch(fetchInfoNotifications(infoTablePagination));
        dispatch(fetchOrdersNotifications(orderTablePagination));
    };

    const getCookie = (key) => {
        const cookies = document.cookie.split(";");

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(`${key}=`)) {
                const cookieValue = cookie.substring(key.length + 1);
                return JSON.parse(decodeURIComponent(cookieValue));
            }
        }

        return null;
    };

    const setCookie = (key, value = { times: 0, second: 0 }, path = "/") => {
        const valueJSON = JSON.stringify(value);
        document.cookie = `${key}=${valueJSON}; path=${path}`;
    };

    // Проверка если существующие куки и добавление их в стейт либо создание нового куки
    useEffect(() => {
        if (!profile?.id) return;

        const cookie = getCookie(profile.id);

        if (cookie) {
            if (cookie.second === 0 && ordersTotal > 0) {
                dispatch(setNotificationModal(true));
                setOpenByNotification(false);
            }
            setCurrentCookie(cookie);
            setClosableModal(cookie.times === 3);
        } else {
            if (ordersTotal > 0) {
                setCookie(profile.id);
                setCurrentCookie({ times: 0, second: 0 });
            }
        }
    }, [profile, ordersTotal]);

    // Добавление нового таймера
    useEffect(() => {
        if (!currentCookie) return;

        setTimer(currentCookie.second);
    }, [currentCookie]);

    const currentPath = window.location.pathname;

    useEffect(() => {
        if (!profile?.id) return;
        if (!currentCookie) return;
        if (isNotificationModal) return;
        if (ordersTotal === 0) return;
        if (modeRedactor) return;

        const correctPath = [
            "management/letters/constructor/add-order-template",
            "management/letters/initiate",
            "management/schedule/edit?staffListId=",
            "management/candidates/list/discover",
            "management/surveys/create",
            "management/combat-starting-position/year-plan/create",
            "management/combat-starting-position/month-plan/?schedule_year_id",
            "management/vacancy",
        ];

        const check = correctPath.some((path) => currentPath.includes(path));

        if (check) return;

        const { times, second } = currentCookie;
        setClosableModal(currentCookie.times === 3);

        if (timer !== 600) {
            const intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer + 1);
                updateCookie({ times: times, second: second + 1 });
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [profile, currentCookie, timer, isNotificationModal, modeRedactor, currentPath]);

    const updateCookie = (value) => {
        setCurrentCookie(value);
        setCookie(profile.id, value);
    };

    // setCookie("356f26fa-c181-47ba-972d-ad17d132c0cd");
    // console.log(document.cookie);

    useEffect(() => {
        if (timer === 600) {
            dispatch(setNotificationModal(true));
        }
    }, [timer]);

    const closeModalByDelay = () => {
        setTimer(0);
        dispatch(setNotificationModal(false));
        updateCookie({ times: currentCookie.times + 1, second: 0 });
    };

    const changeNotification = async (data) => {
        if (data.message) {
            let newNotification = {
                objects: [
                    {
                        message: data.message,
                        created_at: data.created_at,
                        sender_type: "Опросы и тесты",
                    },
                ],
            };

            let notification = await NotificationService.get_notifications_info({
                skip: 0,
                limit: 10,
            });

            notification.objects.map((el) => {
                newNotification.objects.push(el);
            });

            setNotifications(newNotification);
        }
    };

    const deleteAll = () => {
        notifications.objects.map((el) => NotificationService.delete_notifications_info(el.id));
        setNotifications([]);
    };

    const popoverRef = useRef(null);

    const closePopover = () => {
        if (!popoverRef?.current) return;

        popoverRef.current.close();
    };

    const openModalByNotification = () => {
        setOpenByNotification(true);
        dispatch(setNotificationModal(true));
        closePopover();
    };

    useEffect(() => {
        const information = async () => {
            const skip = 0;
            const limit = 5;
            const notification_info = await NotificationService.get_notifications_details({
                skip,
                limit,
            });

            setNotificationInfo(notification_info?.objects || []);
        };
        information();
    }, [closableModal]);

    const notificationList = (
        <div>
            <div className="nav-notification-header d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                    <IntlMessage id={"notification"} />
                </h4>
                <Button className="text-primary" type="text" size="small" onClick={deleteAll}>
                    <IntlMessage id={"clear"} />
                </Button>
            </div>
            <div className="nav-notification-body">{getNotificationBody(notificationInfo)}</div>
            <div className="nav-notification-footer">
                <Button type="link" onClick={openModalByNotification}>
                    Посмотреть все
                </Button>
            </div>
        </div>
    );

    const closeModalByNotification = () => {
        dispatch(setNotificationModal(false));
        // setOpenByNotification(false);
    };

    return (
        <>
            <Popover
                ref={popoverRef}
                placement="bottomRight"
                title={null}
                content={notificationList}
                trigger="click"
                overlayClassName="nav-notification"
            >
                <div className="nav-item">
                    <Badge>
                        <BellOutlined className="nav-icon mx-auto" type="bell" />
                    </Badge>
                </div>
            </Popover>

            <ModalNotification
                onCancel={closeModalByNotification}
                closable={closableModal}
                timer={timer}
                delayClose={closeModalByDelay}
                openByNotification={openByNotification}
                refreshCookie={() => setCookie(profile.id)}
            />
        </>
    );
};

export default NavNotification;
