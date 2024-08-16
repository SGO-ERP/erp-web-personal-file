import React from "react";
import { Empty } from "antd";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";

function NoDataChoose() {
    const directory = {
        name: "Выберите один из справочник для отображения данных",
        nameKZ: "Деректерді көрсету үшін анықтамалық кітаптардың бірін таңдаңыз",
    };
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                flexDirection: "column",
            }}
        >
            <h1
                style={{
                    lineHeight: "32px",
                    fontSize: "16px",
                    fontWeight: "400",
                    marginBottom: 0,
                }}
            >
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                <span style={{ color: "#72849A" }}>{LocalText.getName(directory)}</span>
            </h1>
        </div>
    );
}

export default NoDataChoose;
