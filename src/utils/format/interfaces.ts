import { components } from 'API/types';
import { Dispatch, SetStateAction } from 'react';

export type ArrayElement<ArrayType extends readonly unknown[] | undefined | null> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export interface TreeContextTypes {
    isLoading: boolean;
    setIsLoading?: Dispatch<SetStateAction<boolean>>;
    isEdit: boolean;
}

export type DivisionInput = components['schemas']['NewArchiveStaffDivisionCreate'] & {
    id: string;
    isLocal: boolean;
};

export type Division = DivisionInput & {
    children: Division[];
};
