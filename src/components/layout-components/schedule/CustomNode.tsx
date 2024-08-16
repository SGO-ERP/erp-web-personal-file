import { components } from 'API/types';
import { LocalText } from 'components/util-components/LocalizationText/LocalizationText';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { objectToQueryString } from 'utils/helpers/common';

interface Props {
    item:
        | components['schemas']['ArchiveStaffDivisionRead']
        | components['schemas']['StaffDivisionRead'];
}

export const CustomNode = ({ item }: Props) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const staffListId = searchParams.get('staffListId');

    const mode = searchParams.get('mode');
    const [isEdit, setIsEdit] = useState(false);
    useEffect(() => {
        if (mode === 'edit') {
            setIsEdit(true);
        }
    }, [mode, searchParams]);

    return (
        <div
            style={{
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
            }}
            onClick={() => {
                if (item.name !== 'Управление службой') {
                    if (item.id) {
                        const queryParams = {
                            ...(isEdit && {
                                'mode': mode,
                            }),
                            'type': 'staffDivision',
                            'staffDivision': item.id,
                            'staffListId': staffListId,
                        };
                        navigate(
                            `${APP_PREFIX_PATH}/management/schedule/${
                                isEdit ? 'edit/' : 'history/'
                            }?${objectToQueryString(queryParams)}`,
                        );
                    }
                }
            }}
        >
            <span className="title-normal" style={{ padding: '7px' }}>
                {LocalText.getName(item)}
            </span>
        </div>
    );
};
