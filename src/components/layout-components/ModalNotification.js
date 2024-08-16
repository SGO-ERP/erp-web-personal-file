import React, { useEffect, useState } from "react";
import { Avatar, Button, Col, Modal, Row, Table, Tabs } from "antd";
import NotificationService from "services/NotificationService";
import { CloseOutlined } from "@ant-design/icons";
import NotificationModal from "./notificationModals/NotificationModal";
import SurveyNotification from "./notificationModals/SurveyNotification";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationModal, setOrderId } from "store/slices/notifications/notificationSlice";
import IntlMessage from "../util-components/IntlMessage";
import moment from "moment/moment";

const DEFAULT_PAGE_SIZE = 5;
const SHOW_SIZE_CHANGER = true;

const ModalNotification = ({
    onCancel,
    isAuto,
    closable,
    openByNotification,
    delayClose,
    refreshCookie,
}) => {
    const [notificationDocuments, setNotificationDocuments] = useState([]);
    const [docsTotal, setDocsTotal] = useState(0);
    const [currentDocs, setCurrentDocs] = useState(1);
    const [pageSizeDocs, setPageSizeDocs] = useState(5);

    const [notificationInfo, setNotificationInfo] = useState([]);
    const [infoTotal, setInfoTotal] = useState(0);
    const [currentInfo, setCurrentInfo] = useState(1);
    const [pageSizeInfo, setPageSizeInfo] = useState(5);

    const [loading, setLoading] = useState(false);

    const [modalData, setModalData] = useState({ isOpen: false, id: null, type: null });
    const profile = useSelector((state) => state.profile.data);
    const { TabPane } = Tabs;

    const dispatch = useDispatch();

    const { isNotificationModal, orderNotifications } = useSelector((state) => state.notification);
    // const profile = useSelector((state) => state.profile.data);

    useEffect(() => {
        fetchNotificationsDocs({
            skip: (currentDocs - 1) * pageSizeDocs,
            limit: pageSizeDocs,
        });
    }, [currentDocs, pageSizeDocs, isNotificationModal]);

    useEffect(() => {
        fetchNotificationsDetails({
            skip: (currentInfo - 1) * pageSizeInfo,
            limit: pageSizeInfo,
        });
    }, [currentDocs, pageSizeInfo, isNotificationModal]);

    const columnsDocs = [
        {
            title: <IntlMessage id={"archieve.data.created"} />,
            dataIndex: "date",
            key: "date",
            showSorterTooltip: { title: <IntlMessage id={"tooltip.sort.date.created"} /> },
            sorter: (a, b) => {
                if (a.date === null) {
                    return -1;
                } else if (b.date === null) {
                    return 1;
                } else {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);

                    return dateB.getTime() - dateA.getTime();
                }
            },
            // showSorterTooltip: { title: <IntlMessage id={"tooltip.sort.date.created"} /> },
            render: (date, record) => (
                <span>
                    {formatDate(date)}
                    <br />
                    <div style={{ color: "#366EF6" }}>{moment(date).fromNow()}</div>
                </span>
            ),
        },
        {
            title: <IntlMessage id={"staff"} />,
            dataIndex: "employee",
            key: "employee",
            sorter: (a, b) => a.employee.name.localeCompare(b.employee.name),
            showSorterTooltip: { title: <IntlMessage id={"tooltip.sort.surname"} /> },
            render: (employee) => (
                <Row align="middle">
                    <Col xs={4}>
                        <Avatar src={employee.img} />
                    </Col>
                    <Col xs={20}>{employee.name}</Col>
                </Row>
            ),
        },
        {
            title: <IntlMessage id={"personal.medicalCard.sickLeave.modal.name"} />,
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
            showSorterTooltip: { title: <IntlMessage id={"tooltip.sort.name"} /> },
        },
        {
            title: <IntlMessage id={"personal.services.equipment.modal.type"} />,
            dataIndex: "type",
            key: "type",
            sorter: (a, b) => a.type.localeCompare(b.type),
            showSorterTooltip: { title: <IntlMessage id={"tooltip.sort.type"} /> },
        },
        {
            title: <IntlMessage id={"constructor.tag.action"} />,
            dataIndex: "action",
            key: "action",
            align: "center",
            sorter: false,
            render: (_, value) => (
                <span>
                    <Button
                        type="link"
                        style={{ color: "#366EF6", marginRight: 10 }}
                        onClick={() => acceptButton(value)}
                    >
                        <IntlMessage id={"table.checkboxAccept"} />
                    </Button>
                </span>
            ),
        },
    ];

    const columnsInfo = [
        {
            title: <IntlMessage id={"archieve.data.created"} />,
            dataIndex: "date",
            key: "date",
            sorter: (a, b) => a.date.getTime() - b.date.getTime(),
            showSorterTooltip: { title: <IntlMessage id={"tooltip.sort.date.created"} /> },
            render: (date, record) => (
                <span>
                    {formatDate(date)}
                    <br />
                    {moment(date).fromNow()}
                </span>
            ),
        },
        {
            title: <IntlMessage id={"personal.medicalCard.sickLeave.modal.name"} />,
            dataIndex: "message",
            key: "message",
            sorter: (a, b) => a.message.localeCompare(b.message),
            showSorterTooltip: { title: <IntlMessage id={"tooltip.sort.name"} /> },
        },
        {
            title: <IntlMessage id={"personal.services.equipment.modal.type"} />,
            dataIndex: "type",
            key: "type",
            sorter: (a, b) => a.type.localeCompare(b.type),
            showSorterTooltip: { title: <IntlMessage id={"tooltip.sort.type"} /> },
        },
        {
            title: <IntlMessage id={"constructor.tag.action"} />,
            dataIndex: "action",
            key: "action",
            align: "center",
            sorter: false,
            render: (_, value) => (
                <span>
                    <Button
                        type="link"
                        style={{ color: "blue", marginRight: 10 }}
                        onClick={() => deleteInfo(value.id)}
                    >
                        <IntlMessage id={"initiate.clearDate"} />
                    </Button>
                </span>
            ),
        },
    ];

    function formatDate(inputDate) {
        const options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        };

        const date = new Date(inputDate);
        return new Intl.DateTimeFormat("ru-RU", options).format(date).replace(",", "");
    }

    function calculateTimeDifference(inputDate) {
        const currentDate = new Date();
        const date = new Date(inputDate);
        const timeDifference = currentDate - date;

        const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));
        const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        if (daysAgo > 0) {
            return `${daysAgo} ${daysAgo === 1 ? "день" : "дней"} назад`;
        } else {
            return `${hoursAgo} ${hoursAgo === 1 ? "час" : "часов"} назад`;
        }
    }

    const fetchNotificationsDocs = async ({ skip, limit }) => {
        setLoading(true);
        try {
            const notification = await NotificationService.get_notifications_details({
                skip,
                limit,
            });

            const dataSource =
                notification.objects.length > 0
                    ? notification.objects.map((e, index) => {
                          if (e.hr_document) {
                              const name =
                                  e.hr_document.users[0].last_name +
                                  " " +
                                  e.hr_document.users[0].first_name;
                              const father =
                                  e.hr_document.users[0].last_name +
                                  " " +
                                  e.hr_document.users[0].first_name +
                                  " " +
                                  e.hr_document.users[0].father_name;
                              return {
                                  key: index + 1,
                                  date: e.hr_document.created_at,
                                  employee: {
                                      name: e.hr_document.users[0].father_name ? father : name,
                                      img: e.hr_document.users[0].icon,
                                  },
                                  name: e.hr_document.document_template.name,
                                  nameKZ: e.hr_document.document_template.nameKZ,
                                  type: "Приказ",
                                  id: e.hr_document_id,
                              };
                          }

                          if (e.survey) {
                              const name =
                                  e.survey.owner.last_name + " " + e.survey.owner.first_name;
                              const father =
                                  e.survey.owner.last_name +
                                  " " +
                                  e.survey.owner.first_name +
                                  " " +
                                  e.survey.owner.father_name;
                              return {
                                  key: index + 1,
                                  date: e.survey.created_at,
                                  employee: {
                                      name: e.survey.owner.father_name ? father : name,
                                      img: e.survey.owner.icon,
                                  },
                                  name: e.survey.name,
                                  nameKZ: e.survey.nameKZ,
                                  type: e.survey.type,
                                  id: e.survey_id,
                              };
                          }
                      })
                    : [];

            setNotificationDocuments(dataSource);

            setDocsTotal(notification.total);
        } catch (e) {
            // notification.error({
            //     message: `Произошла ошибка при загрузке результата зачетов: ${e}`,
            // });

            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchNotificationsDetails = async ({ skip, limit }) => {
        setLoading(true);
        try {
            const notification_info = await NotificationService.get_notifications_info({
                skip,
                limit,
            });

            const dataSourceInfo = notification_info.objects.map((e, index) => {
                return {
                    date: e.created_at,
                    message: e.message,
                    type: e.sender_type,
                    key: index + 1,
                    id: e.id,
                };
            });

            setNotificationInfo(dataSourceInfo || []);

            setInfoTotal(notification_info.total);
        } catch (e) {
            // notification.error({
            //     message: `Произошла ошибка при загрузке результата зачетов: ${e}`,
            // });

            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const acceptButton = (val) => {
        if (val.type === "Приказ") {
            setModalData({ isOpen: true, id: val.id, type: "order" });
            dispatch(setOrderId(val.id));
            onCancel();
        }
        if (val.type === "Бланк компетенций") {
            setModalData({ isOpen: true, id: val.id, type: "survey" });
            onCancel();
        }
        if (val.type === "Опрос") {
            setModalData({ isOpen: true, id: val.id, type: "survey" });
            onCancel();
        }

        dispatch(setNotificationModal(false));
    };

    const deleteInfo = async (id) => {
        NotificationService.delete_notifications_info(id);
        setNotificationInfo(notificationInfo.filter((e) => e.id !== id));
    };

    const handlePostpone = () => {
        // onCancel(); // Close the modal
        delayClose();
    };

    const footer = closable ? null : (
        <div style={{ textAlign: "right" }}>
            <Button type="primary" onClick={handlePostpone}>
                Отложить на 10 минут
            </Button>
        </div>
    );

    const renderTable = (tabKey, dataSource, tabColumns, current, page, type) => {
        return dataSource.length > 0 ? (
            <Table
                key={tabKey}
                loading={loading}
                columns={tabColumns}
                dataSource={dataSource}
                pagination={{
                    current: current,
                    pageSize: page,
                    defaultPageSize: DEFAULT_PAGE_SIZE,
                    showSizeChanger: SHOW_SIZE_CHANGER,
                    total: docsTotal,
                    pageSizeOptions: ["5", "10", "20", "50"],
                    onChange: (page) => {
                        if (type === "docs") {
                            setCurrentDocs(page);
                        } else {
                            setCurrentInfo(page);
                        }
                    },
                    onShowSizeChange: (current, size) => {
                        if (type === "docs") {
                            setCurrentDocs(current);
                            setPageSizeDocs(size);
                        } else {
                            setCurrentInfo(current);
                            setPageSizeInfo(size);
                        }
                    },
                    showTotal: () => `Всего ${docsTotal} элементов`,
                }}
            />
        ) : (
            <div
                className="empty-notification"
                style={{ textAlign: "center", alignItems: "center", margin: "10px" }}
            >
                <img
                    src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
                    alt="empty"
                />
                <p className="mt-3">
                    <IntlMessage id={"notification.none"} />{" "}
                </p>
            </div>
        );
    };

    const title = () => {
        if (isAuto) {
            return `Новые  (${docsTotal + infoTotal} уведомления)`;
        }

        return (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>Новые ({docsTotal + infoTotal} уведомления)</div>{" "}
                {!openByNotification ? null : <CloseOutlined onClick={() => onCancel()} />}
            </div>
        );
    };

    const setSigned = (type) => {
        if (type === "back") {
            dispatch(setNotificationModal(true));
            dispatch(setOrderId(null));
        } else {
            dispatch(setNotificationModal(false));
            refreshCookie();
        }
    };

    useEffect(() => {
        if (!profile?.id) return;
        if (notificationDocuments.length === 0 && !openByNotification) {
            dispatch(setNotificationModal(false));
            refreshCookie();
        }
    }, [notificationDocuments, profile]);

    return (
        <Modal
            title={title()}
            open={isNotificationModal}
            onCancel={undefined}
            footer={!openByNotification ? footer : null}
            width={1200}
            closable={false}
        >
            <NotificationModal setSigned={setSigned} />
            <SurveyNotification props={modalData} />
            <Tabs defaultActiveKey="tab1">
                <TabPane tab="Документы и приказы" key="tab1">
                    {renderTable(
                        "tab1",
                        notificationDocuments,
                        columnsDocs,
                        currentDocs,
                        pageSizeDocs,
                        "docs",
                    )}
                </TabPane>
                <TabPane tab="Информативные" key="tab2">
                    {renderTable(
                        "tab2",
                        notificationInfo,
                        columnsInfo,
                        currentInfo,
                        pageSizeInfo,
                        "info",
                    )}
                </TabPane>
            </Tabs>
        </Modal>
    );
};

export default ModalNotification;
