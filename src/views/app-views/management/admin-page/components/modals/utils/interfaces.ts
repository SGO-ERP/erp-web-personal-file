import { UploadFile } from "antd/lib/upload/interface";

export interface BadgeOrderMapTypes {
    otherMedal: number;
    defaultMedal: number;
    stateMedal: number;
}

export interface PropsRecordType {
    id: string;
    created_at: string;
    updated_at: string;
    name: string | null;
    nameKZ: string | null;
    url?: string | null;
    badge_order: number;
}

export interface PropsValueType {
    nameKZ: string;
    name: string;
    badge_order: "stateMedal" | "otherMedal" | "defaultMedal";
    url: UploadFile[];
}
