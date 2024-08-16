import React from "react";
import { Button, Col, Modal, Row, Typography } from "antd";
import { AvatarStatus } from "components/shared-components/AvatarStatus";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GroupsService from "services/GroupsService";
import UsersService from "services/myInfo/UsersService";
import { concatBySpace } from "utils/format/format";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    id?: string;
}

const RecommendedByEmployee = ({ isOpen, onClose, id }: Props) => {
    const { t } = useTranslation();
    const [user, setUser] = useState({} as any);
    const [division, setDivision] = useState({} as any);

    useEffect(() => {
        if (!id) return;
        (async () => {
            return await UsersService.get_user_by_id(id).then((response) => {
                setUser(response);
            });
        })();
    }, [id]);

    useEffect(() => {
        if (
            user.staff_unit?.staff_division !== null &&
            user.staff_unit?.staff_division?.parent_group_id
        ) {
            (async () => {
                return await GroupsService.get_by_id(
                    user.staff_unit?.staff_division?.parent_group_id,
                ).then((response) => {
                    setDivision(response);
                });
            })();
        }
    }, [user, id]);

    return (
        <Modal
            title={t("personal.services.classification.modal.recommendadition.title")}
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
                    <AvatarStatus size={84} src={user.icon} style={{ margin: "20px" }} />
                    {/* FIXME: [STATIC] rank src */}
                    <img
                        src={
                            user?.is_military === true
                                ? user?.rank?.military_url
                                : user?.rank?.employee_url
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
                        {concatBySpace([user.first_name, user.last_name, user.father_name])}
                    </Typography>
                    <Typography>
                        <span className="modal-text-key-primary">
                            {t("personal.generalInfo.officePhoneNum")} &nbsp;
                        </span>
                        <span className="modal-text-info-primary">{user.phone_number}</span>
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
                        {user.staff_unit?.staff_division !== null &&
                            user.staff_unit?.staff_division.name}
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
                        {user.staff_unit?.actual_position
                            ? user.staff_unit?.actual_position.name
                            : user.staff_unit?.position.name}
                    </span>
                </Typography>
            </Col>
            <Row style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                <Col>
                    <Button type={"primary"} onClick={onClose}>
                        Ок
                    </Button>
                </Col>
            </Row>
        </Modal>
    );
};

export default RecommendedByEmployee;
