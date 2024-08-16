import { Button, Col, Modal, Row, Typography } from "antd";
import { AvatarStatus } from "components/shared-components/AvatarStatus";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GroupsService from "services/GroupsService";
import { concatBySpace } from "utils/format/format";
import { useNavigate } from "react-router-dom";
import { APP_PREFIX_PATH } from "../../../../../../../configs/AppConfig";
import IntlMessage from "components/util-components/IntlMessage";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    supervisor: any;
}

const InvestigatedEmployee = ({ isOpen, onClose, supervisor }: Props) => {
    const { t } = useTranslation();

    const [division, setDivision] = useState({} as any);
    const navigate = useNavigate();

    const id = supervisor?.id;

    const [shouldNavigate, setShouldNavigate] = useState(false);

    useEffect(() => {
        if (shouldNavigate) {
            navigate(`${APP_PREFIX_PATH}/duty/data/${id}`);
            onClose();
            window.location.reload();
        }
    }, [shouldNavigate]);

    const NavigateToInvestigatedPage = () => {
        setShouldNavigate(true);
    };

    useEffect(() => {
        const fetchDivision = async () => {
            if (supervisor?.staff_unit?.staff_division?.parent_group_id) {
                const response = await GroupsService.get_by_id(
                    supervisor?.staff_unit.staff_division.parent_group_id,
                );
                setDivision(response);
            }
        };
        fetchDivision();
    }, [supervisor, id]);

    return (
        <Modal
            title={t("personal.services.investigated.modal.title")}
            open={isOpen}
            onCancel={onClose}
            width={500}
            footer={null}
        >
            <Row gutter={16}>
                <Col
                    style={{
                        position: "relative",
                    }}
                >
                    {/* @ts-expect-error FIXME: props doesn't has types */}
                    <AvatarStatus size={84} src={supervisor?.icon} style={{ margin: "20px" }} />
                    {/* FIXME: [STATIC] rank src */}
                    <img
                        src={
                            supervisor?.is_military === true
                                ? supervisor?.rank?.military_url
                                : supervisor?.rank?.employee_url
                        }
                        alt={"Rank"}
                        style={{
                            width: 20,
                            height: 20,
                            position: "absolute",
                            top: 65,
                            right: 20,
                        }}
                    />
                </Col>
                <Col
                    style={{
                        paddingTop: "16px",
                    }}
                >
                    <Typography className="modal-text-info-primary">
                        {concatBySpace([
                            supervisor?.last_name,
                            supervisor?.first_name,
                            supervisor?.father_name,
                        ])}
                    </Typography>
                    <Typography>
                        <span className="modal-text-key-primary">
                            {t("personal.generalInfo.officePhoneNum")} &nbsp;
                        </span>
                        <span className="modal-text-info-primary">
                            {supervisor?.service_phone_number}
                        </span>
                    </Typography>

                    <p></p>
                </Col>
            </Row>
            <Col
                style={{
                    paddingTop: "16px",
                }}
            >
                <Typography>
                    <span className="modal-text-key-secondary">
                        {t("personal.generalInfo.division")} &nbsp;
                    </span>
                    <span className="modal-text-info-secondary">
                        {division.name}&nbsp;
                        {supervisor?.staff_unit?.staff_division?.name}
                    </span>
                </Typography>
                <Typography
                    style={{
                        paddingTop: "8px",
                    }}
                >
                    <span className="modal-text-key-secondary">
                        {t("personal.generalInfo.post")} &nbsp;
                    </span>
                    <span className="modal-text-info-secondary">
                        {supervisor?.staff_unit?.actual_position
                            ? supervisor?.staff_unit?.actual_position.name
                            : supervisor?.staff_unit?.position?.name}
                    </span>
                </Typography>
            </Col>

            <Row style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                <Col>
                    <Button style={{ marginRight: "10px" }} onClick={NavigateToInvestigatedPage}>
                        <IntlMessage id={"personalBusiness"} />
                    </Button>
                    <Button type={"primary"} onClick={onClose}>
                        Ок
                    </Button>
                </Col>
            </Row>
        </Modal>
    );
};

export default InvestigatedEmployee;
