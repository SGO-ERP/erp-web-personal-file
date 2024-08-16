import React, { useState } from "react";
import { Button, Col, Modal, notification, Row, Spin, Typography } from "antd";
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import IntlMessage from "components/util-components/IntlMessage";
import { useAppDispatch } from "../../../../../hooks/useStore";
import { LocalText } from "../../../../../components/util-components/LocalizationText/LocalizationText";
import { components } from "../../../../../API/types";
import HRVacancyService from "../../../../../services/vacancy/HRVacancyService";

const { Text } = Typography;
const loadingIcon = <LoadingOutlined style={{ color: "white" }} spin />;

interface OfferCandidateProps {
    isOpen: boolean;
    onClose: () => void;
    data: components["schemas"]["schemas__hr_vacancy__HrVacancyRead"];
    ids: string[];
    successOffersIds: string[];
    setSuccessOffersIds: (ids: string[]) => void;
}

const OfferCandidate = ({
    isOpen,
    onClose,
    data,
    ids,
    successOffersIds,
    setSuccessOffersIds,
}: OfferCandidateProps) => {
    const dispatch = useAppDispatch();
    const currentLocale = localStorage.getItem("lan");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleOk = async () => {
        setIsLoading(true);
        if (data.id !== null && data.id !== undefined) {
            try {
                const promises = ids.map((id) => {
                    return HRVacancyService.respond(id);
                });
                // const response = await HRVacancyService.respond(data.id);
                const responses = await Promise.all(promises);

                if (responses) {
                    notification.success({
                        message:
                            currentLocale === "kk" ? "Өтінім жіберілді!" : "Заявка отправлена!",
                    });
                }
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                setSuccessOffersIds((prevIds) => {
                    return [...prevIds, data.id];
                });
            } catch (e) {
                if (!(e instanceof Error)) throw e;

                let message;

                if (!navigator.onLine) {
                    message =
                        currentLocale === "kk"
                            ? "Интернет байланысы жоқ!"
                            : "Нет интернет-соединения!";
                } else if ("response" in e) {
                    const response = (e as any).response;

                    switch (response.status) {
                        case 400:
                            message =
                                currentLocale === "kk"
                                    ? "Сіз оған дейің өтініш жібердіңіз!"
                                    : "Вы уже отправили заявление!";
                            break;
                        case 404:
                            // Not Found
                            message =
                                currentLocale === "kk"
                                    ? "Вакансия табылмады!"
                                    : "Вакансия не найдена!";
                            break;
                        default:
                            message =
                                currentLocale === "kk"
                                    ? "Серверден қате келді!"
                                    : "Ошибка с сервера!";
                    }
                } else {
                    message =
                        currentLocale === "kk"
                            ? "Сұрауды орнату кезінде қате болды!"
                            : "Произошла ошибка при установке запроса!";
                }

                notification.error({
                    message,
                });
            } finally {
                setIsLoading(false);
                onClose();
            }
        }
    };

    const position = data?.staff_unit?.actual_position
        ? data?.staff_unit?.actual_position
        : data?.staff_unit?.position;

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            onOk={handleOk}
            // okText={<IntlMessage fallback={'ru'} id="yes" />}
            // cancelText={<IntlMessage fallback={'ru'} id="no" />}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    <IntlMessage fallback={"ru"} id="no" />
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    <Spin spinning={isLoading} indicator={loadingIcon} size="small" />
                    {!isLoading && <IntlMessage fallback={"ru"} id="yes" />}
                </Button>,
            ]}
        >
            <Row justify="center">
                <Col xs={2} className="gutter-row">
                    <ExclamationCircleOutlined style={{ fontSize: "1.4rem", color: "#FAAD14" }} />
                </Col>
                <Col xs={20} className="gutter-row">
                    <Row>
                        <Text strong>
                            <IntlMessage fallback={"ru"} id="vacancy.give.order" />
                        </Text>
                    </Row>
                    <Row style={{ marginTop: "4px" }}>
                        {currentLocale === "kk" ? (
                            <Text>
                                Сіз шынымен де <b>&quot;{LocalText.getName(position)}&quot;?</b>{" "}
                                лауазымына өз кандидатураңызды ұсынғыңыз келе ме?
                            </Text>
                        ) : (
                            <Text>
                                Вы действительно хотите предложить собственную кандидатуру на
                                должность <b>&quot;{LocalText.getName(position)}&quot;?</b>
                            </Text>
                        )}
                    </Row>
                </Col>
            </Row>
        </Modal>
    );
};

export default OfferCandidate;
