import { AutoComplete, Col, Row, notification } from "antd";
import IntlMessage from "components/util-components/IntlMessage";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchUsers,
    fetchUsersByStaffUnit,
    setInitials,
    setUser,
    resetUsers,
    setSkip,
} from "store/slices/initialization/initializationUsersSlice";
import { LOADING_OPTION } from "../utils/loadings";
import AvatarStatus from "components/shared-components/AvatarStatus";
import { debounce } from "lodash";
import { useSearchParams } from "react-router-dom";
import TagsGenerator, { generateTags } from "../utils/TagsGenerator";
import { generateAutoTags } from "../utils/userHelper";
import { setTags, setValueTags } from "store/slices/initialization/initializationDocInfoSlice";

const UsersBlock = () => {
    const [searchText, setSearchText] = useState("");

    const dispatch = useDispatch();

    const [searchParams] = useSearchParams();

    const { selectedDocument } = useSelector((state) => state.initializationDocuments);
    const { tagsInfo, tagsValue, isPositionChange } = useSelector(
        (state) => state.initializationDocInfo,
    );
    const { skip, usersList, loading, usersMax, selectUserInitials } = useSelector(
        (state) => state.initializationUsers,
    );

    const candidateUserId = searchParams.get("candidateUserId");
    const isFromVacancy = searchParams.get("fromVacancy");

    const positionKey = tagsInfo.find((tag) => tag.field_name === "staff_unit")?.key;

    useEffect(() => {
        fetchMoreUsers();
    }, [selectedDocument, skip]);

    useEffect(() => {
        if (!tagsValue[positionKey]) return;

        fetchMoreUsers();
    }, [tagsValue]);

    const fetchMoreUsers = () => {
        if (!selectedDocument.id) return;

        if (isPositionChange && tagsValue[positionKey]?.value) {
            dispatch(
                fetchUsersByStaffUnit({
                    id: tagsValue[positionKey]?.value,
                    text: searchText,
                }),
            )
                .then((actionResult) => {
                    if (!actionResult.payload) {
                        console.log("Error: user didn't come");
                    }
                })
                .catch((error) => {
                    console.error("An error occurred:", error);
                });
        } else {
            dispatch(
                fetchUsers({
                    id: selectedDocument.id,
                    text: searchText,
                }),
            )
                .then((actionResult) => {
                    if (!actionResult.payload) {
                        console.log("Error: user didn't come");
                    }
                })
                .catch((error) => {
                    console.error("An error occurred:", error);
                });
        }
    };

    const debouncedSearch = useCallback(debounce(fetchMoreUsers, 300), [searchText]);

    useEffect(() => {
        debouncedSearch();
        return debouncedSearch.cancel;
    }, [searchText, debouncedSearch]);

    const handleScroll = (e) => {
        if (usersList.length === usersMax || isPositionChange) return;

        const { target } = e;

        if (target.scrollTop + target.clientHeight === target.scrollHeight) {
            dispatch(setSkip(usersList.length));
        }
    };

    const handleSearch = (value) => {
        dispatch(resetUsers());
        dispatch(setSkip(0));
        setSearchText(value);
        dispatch(setInitials(value));
    };

    const handleSelect = async (userId) => {
        const currentUser = usersList.find((user) => user.id === userId);
        const initials = `${currentUser.first_name} ${currentUser.last_name}`;
        // const isPositionChange = Object.keys(document?.actions?.args?.[0])[0] === 'position_change'

        // if (isPositionChange && !currentUser.is_eligible) {
        //     notification.warning({
        //         message: "Выбранный субъект не подходит по квалификационным требованием",
        //     });

        //     return;
        // }

        const takeAutoTags = await generateAutoTags(selectedDocument.properties, currentUser);
        if (takeAutoTags.length > 0) {
            const filteredTags = tagsInfo.filter(
                (tag) => !takeAutoTags.some((auto) => auto.key === tag.key),
            );
            const tagsWithAuto = [...filteredTags, ...takeAutoTags];

            dispatch(setTags(tagsWithAuto));
            const transformedTags = takeAutoTags.reduce((acc, tag) => {
                acc[tag.key] = { value: { kz: tag.newWordKZ, ru: tag.newWord } };
                return acc;
            }, {});

            dispatch(setValueTags({ ...tagsValue, ...transformedTags }));
        }

        dispatch(setUser(currentUser));
        dispatch(setInitials(initials));
    };

    const handleClear = () => {
        dispatch(resetUsers());
        setSearchText("");
        dispatch(setSkip(0));
    };

    const isSubjectDisabled = () => {
        let isDisable = false;
        // return !!(isFromVacancy || candidateUserId || !selectedDocument.id);

        if (isFromVacancy) return true;
        if (candidateUserId) return true;
        if (!selectedDocument.id) return true;

        if (positionKey && !tagsValue[positionKey]?.value) {
            return true;
        }

        return isDisable;
    };

    return (
        <>
            <TagsGenerator tagsInfo={tagsInfo} tagsValue={tagsValue} which="users" />
            <Row style={isPositionChange ? { marginBottom: -5 } : {}}>
                <Col xl={7}>
                    <b>
                        <h5 style={{ alignItems: "center", marginTop: "11px" }}>
                            <IntlMessage id="initiate.chooseForm" />
                        </h5>
                    </b>
                </Col>
                <Col xl={17}>
                    <AutoComplete
                        className="chooseUser"
                        // disabled={isSubjectDisabled()}
                        options={[
                            ...usersList.map((item) => {
                                const updatedIcon = item.icon.replace(
                                    "192.168.0.61:8083",
                                    "193.106.99.68:2298",
                                );

                                const currentRank = item.rank?.name ?? "";
                                const sortRank =
                                    currentRank.length > 30
                                        ? currentRank.slice(0, 30) + "..."
                                        : currentRank;

                                return {
                                    value: item.id,
                                    label: (
                                        <AvatarStatus
                                            name={item.first_name}
                                            surname={item.last_name}
                                            subTitleTwo={sortRank}
                                            subTitleThree={
                                                isPositionChange ? (
                                                    item.is_eligible ? (
                                                        <span style={{ color: "lightgreen" }}>
                                                            ✓
                                                        </span>
                                                    ) : (
                                                        <span style={{ color: "red" }}>X</span>
                                                    )
                                                ) : null
                                            }
                                            src={updatedIcon}
                                        />
                                    ),
                                };
                            }),
                            ...(loading ? [LOADING_OPTION] : []),
                        ]}
                        variant={"outlined"}
                        onClear={handleClear}
                        onSelect={handleSelect}
                        onSearch={handleSearch}
                        // onPopupScroll={handleScroll}
                        allowClear
                        notFoundContent={<IntlMessage id="initiate.notFoundUsers" />}
                        value={selectUserInitials}
                    />
                </Col>
            </Row>
        </>
    );
};

export default UsersBlock;
