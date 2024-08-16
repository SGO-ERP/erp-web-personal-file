/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NamedModel } from './NamedModel';
import type { SubjectType } from './SubjectType';

export type HrDocumentTemplateUpdate = {
    name: string;
    nameKZ?: string | null;
    path?: string;
    pathKZ: string;
    subject_type?: SubjectType;
    maintainer_id?: string;
    properties: Record<string, Record<string, any>>;
    description?: NamedModel;
    actions: Record<string, Array<any>>;
    is_visible: boolean;
    is_due_date_required?: boolean;
    is_initial_comment_required?: boolean;
    is_draft?: boolean;
    is_active?: boolean;
};
