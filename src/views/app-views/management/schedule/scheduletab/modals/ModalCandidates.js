import { Col, Modal, Row, Table } from "antd";
import AvatarStatus from "components/shared-components/AvatarStatus";
import DataText from "components/shared-components/DataText";
import StaffUnionTextWithPluralizer from "components/shared-components/StaffUnionTextWithPluralizer";
import IntlMessage from "components/util-components/IntlMessage";
import LocalizationText, {
    LocalText,
} from "components/util-components/LocalizationText/LocalizationText";
import moment from "moment";
import React from "react";
import { NavLink } from "react-router-dom";
import { utils } from "xlsx";
import { APP_PREFIX_PATH } from "../../../../../../configs/AppConfig";
import "../../style.css";

const ModalCandidates = ({ isOpen, onClose, candidate, staffUnit }) => {
    const currentTableColumns = [
        {
            title: <IntlMessage id={"entryDate"} />,
            dataIndex: "last_signed_at",
            render: (text, record) => (
                <div>
                    <p className={"text"}>
                        {moment(record?.created_at).format("DD.MM.YYYY HH:mm")}
                    </p>
                    <p style={{ color: "#366EF6" }}>{moment(record?.created_at).fromNow()}</p>
                </div>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, "created_at"),
        },
        {
            title: <IntlMessage id={"personal.breadcrumbs.employee"} />,
            dataIndex: ["first_name"],
            render: (text, record) => (
                <div className="d-flex">
                    <Row>
                        <Col>
                            <AvatarStatus size={40} src={record?.user?.icon}>
                                {`${record?.user?.first_name} ${record?.user?.last_name} ${record?.user?.father_name}`}
                            </AvatarStatus>
                        </Col>
                        <Col>
                            <div className="mt-2">
                                {record?.father_name ? (
                                    <DataText
                                        name={`${record?.user?.first_name} ${record?.user?.last_name} ${record?.user?.father_name}`}
                                    />
                                ) : (
                                    <DataText
                                        name={`${record?.user?.first_name} ${record?.user?.last_name}`}
                                    />
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
            ),
            sorter: (a, b) => {
                return a.first_name.localeCompare(b.first_name);
            },
        },
        {
            title: <IntlMessage id={"post"} />,
            dataIndex: ["staffUnit", "position", "name"],
            render: (text, record) => (
                <div>
                    <b>
                        {LocalText.getName(
                            record?.user?.staff_unit?.actual_position
                                ? record?.user?.staff_unit?.actual_position
                                : record?.user?.staff_unit?.position,
                        )}
                    </b>
                    <br />
                    {LocalText.getName(record?.user?.staff_unit?.staff_division)}
                </div>
            ),
            sorter: (a, b) => {
                if (a.user.staff_unit.actual_position) {
                    return a.user.staff_unit.actual_position.name.localeCompare(
                        b.user.staff_unit.actual_position.name,
                    );
                } else {
                    return a.user.staff_unit.position.name.localeCompare(
                        b.user.staff_unit.position.name,
                    );
                }
            },
        },
        {
            title: <IntlMessage id={"letters.historytable.actions"} />,
            dataIndex: "id",
            render: (text, record) => (
                <div className="text-muted">
                    <NavLink to={`${APP_PREFIX_PATH}/duty/data/${record?.user?.id}`}>
                        <IntlMessage id={"personalBusiness"} />
                    </NavLink>
                </div>
            ),
        },
    ];

    return (
        <Modal
            title={
                <>
                    <IntlMessage id={"vacancy.view.candidates"} /> &quot;
                    {
                        <LocalizationText
                            text={
                                staffUnit.actual_position
                                    ? staffUnit.actual_position
                                    : staffUnit.position
                            }
                        />
                    }
                    &quot;
                </>
            }
            open={isOpen}
            okText={<IntlMessage id={"initiate.save"} />}
            cancelText={<IntlMessage id={"candidates.warning.cancel"} />}
            onCancel={onClose}
            onOk={onClose}
            width={1000}
        >
            <Table dataSource={candidate} columns={currentTableColumns} />
        </Modal>
    );
};

export default ModalCandidates;
