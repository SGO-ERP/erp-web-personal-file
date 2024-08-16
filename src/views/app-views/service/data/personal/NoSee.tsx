import React from "react";
import "../style.css";
import { EyeInvisibleOutlined } from "@ant-design/icons";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";

function NoSee() {
    const defaultText = {
        name: "Нет доступа",
        nameKZ: "Қол жетімділік жоқ",
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
                <div style={{ textAlign: "center" }}>
                    <EyeInvisibleOutlined style={{ fontSize: 20 }} />
                    <p>{LocalText.getName(defaultText)}</p>
                </div>
            </h1>
        </div>
    );
}

export default NoSee;
