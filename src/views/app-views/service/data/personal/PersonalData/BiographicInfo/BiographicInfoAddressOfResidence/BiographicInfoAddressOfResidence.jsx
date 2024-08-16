import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import EditInput from "../../../common/EditInput";

export const BiographicInfoAddressOfResidence = ({ bio }) => {
    const { t } = useTranslation();

    return (
        <Row align="middle">
            <Col xs={12} md={12} lg={12} xl={12} className={"font-style text-muted editable-row"}>
                {t("personal.biographicInfo.addressOfResidence")}
            </Col>
            <Col xs={12} className={"font-style"}>
                <EditInput
                    defaultValue={bio?.residence_address || ""}
                    id={bio?.id}
                    fieldName="allTabs.personal_data.biographic_info.residence_address"
                    fieldNameGet="initialTabs.personal_data.biographic_info.residence_address"
                />
            </Col>
        </Row>
    );
};
