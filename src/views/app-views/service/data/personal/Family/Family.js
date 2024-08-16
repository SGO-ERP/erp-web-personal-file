import { Button, Spin } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getFamilyCities,
    getFamilyProfile,
    getRelations,
} from "store/slices/myInfo/familyProfileSlice";
import ModalController from "../common/ModalController";
import ShowOnlyForRedactor from "../common/ShowOnlyForRedactor";
import FamilyList from "./components/FamilyList";
import ModalAddFamilyMember from "./modal/ModalAddFamilyMember";
import IntlMessage from "components/util-components/IntlMessage";
import { useAppSelector } from "../../../../../../hooks/useStore";
import { PERMISSION } from "constants/permission";
import NoSee from "../NoSee";

const Family = ({ id, activeAccordions, allOpen }) => {
    let dispatch = useDispatch();
    let familyDataRemote = useSelector((state) => state.familyProfile.familyProfile);
    let familyDataLocal = useSelector((state) => state.myInfo.allTabs.family);
    const editedData = useSelector((state) => state.myInfo.edited.family);

    let isLoading = useSelector((state) => state.familyProfile.loading);
    let error = useSelector((state) => state.familyProfile.error);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);

    useEffect(() => {
        dispatch(getFamilyProfile(id));
        dispatch(getRelations());
        dispatch(getFamilyCities());
    }, []);

    if (error) {
        return <div> {error}</div>;
    }

    return (
        <div>
            <div style={{ margin: "10px" }}>
                {isHR && (
                    <ShowOnlyForRedactor
                        forRedactor={
                            <div>
                                <ModalController>
                                    <ModalAddFamilyMember />
                                    <Button type={"primary"}>
                                        <IntlMessage id="personal.family.addFamilyMember" />
                                    </Button>
                                </ModalController>
                            </div>
                        }
                    />
                )}
            </div>
            {isLoading ? (
                <div
                    style={{
                        minHeight: "200px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Spin size="large" />
                </div>
            ) : familyDataRemote.family === "Permission Denied" ? (
                <NoSee />
            ) : (
                <div>
                    <FamilyList
                        familyList={familyDataRemote.family}
                        allOpen={allOpen}
                        activeAccordions={activeAccordions}
                    />
                    <div style={{ marginTop: "15px" }}>
                        {isHR && (
                            <ShowOnlyForRedactor
                                forRedactor={
                                    <div>
                                        <FamilyList
                                            familyList={familyDataLocal.members}
                                            allOpen={allOpen}
                                            activeAccordions={activeAccordions}
                                            source="added"
                                        />
                                        <div style={{ marginTop: "15px" }} />
                                        <FamilyList
                                            familyList={editedData.members}
                                            allOpen={allOpen}
                                            activeAccordions={activeAccordions}
                                            source="edited"
                                        />
                                    </div>
                                }
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Family;
