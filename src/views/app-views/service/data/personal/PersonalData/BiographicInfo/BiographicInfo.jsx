import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getFamilyStatuses } from '../../../../../../../store/slices/myInfo/personalInfoSlice';
import CollapseErrorBoundary from '../../common/CollapseErrorBoundary';
import { BiographicInfoAddressOfResidence } from './BiographicInfoAddressOfResidence';
import { BiographicInfoCitizenship } from './BiographicInfoCitizenship';
import { BiographicInfoCity } from './BiographicInfoCity';
import { BiographicInfoCountry } from './BiographicInfoCountry';
import { BiographicInfoFamilyStatus } from './BiographicInfoFamilyStatus';
import { BiographicInfoGender } from './BiographicInfoGender';
import { BiographicInfoIsVillageCheckbox } from './BiographicInfoIsVillageCheckbox';
import { BiographicInfoNationality } from './BiographicInfoNationality';
import { BiographicInfoPlaceOfResidence } from './BiographicInfoPlaceOfResidence';
import { BiographicInfoRegion } from './BiographicInfoRegion';
import { BiographicInfoVillage } from './BiographicInfoVillage';
import { setIsVillage } from '../../../../../../../store/slices/myInfo/myInfoSlice';

const BiographicInfo = ({ bio }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [selectedFields, setSelectedFields] = useState({
        country: false,
        region: false,
        cityOrVillage: false,
    });

    useEffect(() => {
        dispatch(getFamilyStatuses());
        dispatch(setIsVillage(bio?.birthplace?.city?.is_village ?? false));
    }, []);

    return (
        <CollapseErrorBoundary fallback={t('myInfo.dataLoadError')}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                }}
            >
                <BiographicInfoCountry
                    bio={bio}
                    selectedFields={selectedFields}
                    setSelectedFields={setSelectedFields}
                />
                <BiographicInfoRegion
                    bio={bio}
                    selectedFields={selectedFields}
                    setSelectedFields={setSelectedFields}
                />
                <BiographicInfoIsVillageCheckbox bio={bio} />
                <BiographicInfoCity
                    bio={bio}
                    selectedFields={selectedFields}
                    setSelectedFields={setSelectedFields}
                />
                <BiographicInfoVillage
                    bio={bio}
                    selectedFields={selectedFields}
                    setSelectedFields={setSelectedFields}
                />
                <BiographicInfoGender bio={bio} />
                <BiographicInfoCitizenship bio={bio} />
                <BiographicInfoNationality bio={bio} />
                <BiographicInfoFamilyStatus bio={bio} />
                <BiographicInfoPlaceOfResidence bio={bio} />
                <BiographicInfoAddressOfResidence bio={bio} />
            </div>
        </CollapseErrorBoundary>
    );
};

export default BiographicInfo;
