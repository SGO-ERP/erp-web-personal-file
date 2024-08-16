import { Spin } from "antd";

export const LOADING_OPTION = {
    value: "NULL",
    disabled: true,
    label: (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
            }}
        >
            <Spin size="small" />
        </div>
    ),
};
