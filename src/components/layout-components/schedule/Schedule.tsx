import { Button, Col, Modal, Row } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import IntlMessage from "components/util-components/IntlMessage";
import { APP_PREFIX_PATH } from "configs/AppConfig";
import { useSave } from "hooks/schedule/useSave";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getDraftStaffDivision } from "store/slices/schedule/archiveStaffDivision";
import { TreeContextTypes } from "utils/format/interfaces";
import { TreeContext } from "views/app-views/management/schedule/edit";
import AcceptChanges from "views/app-views/management/schedule/scheduletab/modals/AcceptChanges";
import ModalDraft from "views/app-views/management/schedule/scheduletab/modals/ModalDraft";
import WithdrawalOrder from "../../../views/app-views/management/schedule/scheduletab/modals/WithdrawalOrder";
import ModalChangePosition from "views/app-views/management/schedule/scheduletab/modals/ModalChangePosition";
import { PERMISSION } from "constants/permission";

const PageHeaderExtra = () => {
    const { save, isLoading, clearAllChanges, deleteDraft, progress } = useSave();
    const { setIsLoading, isEdit } = useContext(TreeContext) as TreeContextTypes;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const staffListId = searchParams.get("staffListId");

    const currentLocale = localStorage.getItem("lan");

    const [openDraftModal, setOpenDraftModal] = useState(false);
    const [isSign, setIsSign] = useState(false);
    const [withdrawal, setWithdrawal] = useState(false);

    const [modal, contextHolder] = Modal.useModal();
    const [saveOrApprove, setSave] = useState<"save" | "approve">("save");

    const users = useAppSelector((state) => state.disposal.remote);

    const [loading, setLoading] = useState(false);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const canEditSchedule = myPermissions?.includes(PERMISSION.STAFF_LIST_EDITOR);

    function handleShowEditBtns() {
        setOpenDraftModal(true);
    }

    useEffect(() => {
        setIsLoading && setIsLoading(isLoading);
    }, [isLoading]);

    useEffect(() => {
        setIsLoading && setIsLoading(loading);
    }, [loading]);

    const showConfirmExitDraft = () => {
        modal.confirm({
            title:
                currentLocale === "kk"
                    ? "Сіз өңдеуден шыққыңыз келетініне сенімдісіз бе?"
                    : "Вы уверены, что хотите выйти из редактирования?",
            icon: <ExclamationCircleOutlined style={{ fontSize: "1.4rem", color: "#FAAD14" }} />,
            content:
                currentLocale === "kk"
                    ? "Енгізілген өзгерістер сақталмайды"
                    : "Внесённые изменения не сохранятся",
            okText: currentLocale === "kk" ? "Ия" : "Да",
            cancelText: currentLocale === "kk" ? "Жоқ" : "Нет",
            onOk: () => {
                clearAllChanges();
                navigate(`${APP_PREFIX_PATH}/management/schedule/history`);
            },
        });
    };

    const showConfirmCancelChanges = () => {
        modal.confirm({
            title:
                currentLocale === "kk"
                    ? "Сіз енгізілген өзгерістерді жойғыңыз келетініне сенімдісіз бе?"
                    : "Вы уверены, что хотите отменить внесённые изменения?",
            icon: <ExclamationCircleOutlined style={{ fontSize: "1.4rem", color: "#FAAD14" }} />,
            content:
                currentLocale === "kk"
                    ? "Енгізілген деректерді жоюдың орнына жобаларда сақтауға болады"
                    : "Вы можете сохранить внесённые данные в черновиках вместо отмены",
            okText: currentLocale === "kk" ? "Ия" : "Да",
            cancelText: currentLocale === "kk" ? "Жоқ" : "Нет",
            onOk: () => {
                clearAllChanges();
                (async () => {
                    staffListId &&
                        (await dispatch(
                            getDraftStaffDivision({
                                query: {
                                    staff_list_id: staffListId,
                                },
                            }),
                        ));
                })();
            },
        });
    };

    const showConfirmDeleteDraft = () => {
        const handleDeleteDraft = async () => {
            setLoading(true);

            try {
                await deleteDraft();
            } catch (error) {
                // Обработка ошибки удаления черновика
            } finally {
                setLoading(false);
            }
        };

        modal.confirm({
            title:
                currentLocale === "kk"
                    ? "Сіз жобаны жойғыңыз келетініне сенімдісіз бе?"
                    : "Вы уверены, что хотите удалить черновик?",
            icon: <ExclamationCircleOutlined style={{ fontSize: "1.4rem", color: "#FAAD14" }} />,
            // content: currentLocale === 'kk' ? 'Енгізілген деректерді жоюдың орнына жобаларда сақтауға болады' : 'Вы можете сохранить внесённые данные в черновиках вместо отмены',
            okText: currentLocale === "kk" ? "Ия" : "Да",
            cancelText: currentLocale === "kk" ? "Жоқ" : "Нет",
            onOk: handleDeleteDraft,
            okButtonProps: { loading: loading },
        });
    };

    const [openChangeModal, setOpenChangeModal] = useState<boolean>(false);

    const handleChangePosition = () => {
        setOpenChangeModal(true);
    };

    return (
        <>
            {contextHolder}
            <AcceptChanges
                isOpen={isSign}
                onClose={() => setIsSign(false)}
                onSign={(signedBy, createdDate, rank, reqNumber, order) =>
                    save("sign", signedBy, createdDate, rank, reqNumber, order)
                }
                progress={progress}
                isLoading={isLoading}
            />
            <WithdrawalOrder
                isOpen={withdrawal}
                onClose={() => setWithdrawal(false)}
                setIsSign={setIsSign}
                saveOrApprove={saveOrApprove}
            />
            <ModalDraft onClose={() => setOpenDraftModal(false)} isOpen={openDraftModal} />
            <ModalChangePosition
                onClose={() => setOpenChangeModal(false)}
                isOpen={openChangeModal}
            />
            <Row gutter={10}>
                {isEdit && (
                    <>
                        <Col>
                            <Button danger onClick={showConfirmDeleteDraft}>
                                <IntlMessage id={"staffSchedule.delete_draft"} />
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={showConfirmExitDraft}>
                                <IntlMessage id={"staffSchedule.exit_draft"} />
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={showConfirmCancelChanges}>
                                <IntlMessage id={"staffSchedule.cancel_changes"} />
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                onClick={() => {
                                    if (users.length > 0) {
                                        setSave("save");
                                        setWithdrawal(true);
                                    } else {
                                        save("draft");
                                    }
                                }}
                            >
                                <IntlMessage id={"staffSchedule.save"} />
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                onClick={() => {
                                    if (users.length > 0) {
                                        setSave("approve");
                                        setWithdrawal(true);
                                    } else {
                                        setIsSign(true);
                                    }
                                }}
                            >
                                <IntlMessage id={"schedule.button.save.approve"} />
                            </Button>
                        </Col>
                    </>
                )}
                {!isEdit && canEditSchedule && (
                    <>
                        <Col>
                            <Button onClick={handleChangePosition}>Change</Button>
                        </Col>
                        <Col>
                            <Button>
                                <IntlMessage id={"staffSchedule.export"} />
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                key="2"
                                type="primary"
                                onClick={handleShowEditBtns}
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                <IntlMessage id={"staffSchedule.createDraft"} />
                            </Button>
                        </Col>
                    </>
                )}
            </Row>
        </>
    );
};

export default PageHeaderExtra;
