import { AutoComplete, Col, Row, Spin } from "antd";
import AvatarStatus from "components/shared-components/AvatarStatus";
import IntlMessage from "components/util-components/IntlMessage";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import "./styles/IndexStyle.css";
import {
    clearItemValue,
    fetchUsers,
    getInitials,
    getUser,
    resetUsers,
} from "store/slices/newInitializationsSlices/initializationNewSlice";
import UserService from "../../../../services/UserService";
import { useSearchParams } from "react-router-dom";

const PAGE_SIZE = 10;
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

const UserForm = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [inputText, setInputText] = useState("");
    const documentId = useSelector((state) => state.initializationNew.documentTemplate.id);
    const usersFromStore = useSelector((state) => state.initializationNew.users);
    const lastFetchedUsers = useSelector((state) => state.initializationNew.lastFetchedUsers);
    const userFromStore = useSelector((state) => state.initializationNew.selectUser);
    const { isFromCandidate, userDisable } = useSelector((state) => state.initializationNew);
    const [searchParams] = useSearchParams();
    const candidateUserId = searchParams.get("candidateUserId");
    const isFromVacancy = searchParams.get("fromVacancy");

    useEffect(() => {
        if (!documentId) return;
        fetchMoreUsers();
    }, [documentId]);

    const fetchMoreUsers = async () => {
        if (!documentId) return;
        setLoading(true);
        const actionResult = await dispatch(
            fetchUsers({
                id: documentId,
                text: searchText,
                limit: PAGE_SIZE,
                skip: page * PAGE_SIZE,
            }),
        );

        if (!actionResult.payload) {
            console.log("Error: user didnt come");
        }
        setLoading(false);
    };

    useEffect(() => {
        setHasMore(lastFetchedUsers.length === PAGE_SIZE);
    }, [lastFetchedUsers.length, usersFromStore]);

    const handleScroll = (e) => {
        if (!hasMore || loading) return;
        const { target } = e;
        if (target.scrollTop + target.clientHeight === target.scrollHeight) {
            setPage((page) => page + 1);
        }
    };

    useEffect(() => {
        if (page === 0) return;
        fetchMoreUsers();
    }, [page]);

    const debouncedSearch = useCallback(debounce(fetchMoreUsers, 300), [searchText]);

    const handleSearch = (value) => {
        dispatch(clearItemValue());
        dispatch(resetUsers());
        setSearchText(value);
        setInputText(value);
        setPage(0);
    };

    useEffect(() => {
        debouncedSearch();
        return debouncedSearch.cancel;
    }, [searchText, debouncedSearch]);

    useEffect(() => {
        setInputText("");
        if (!userFromStore) return;
        if (Object.keys(userFromStore).length === 0) return;
        const initials = `${userFromStore.first_name} ${userFromStore.last_name}`;
        dispatch(getInitials(initials));
        setInputText(initials);
    }, [userFromStore]);

    useEffect(() => {
        if (!candidateUserId) return;

        void getUserByCandidate();
    }, [candidateUserId, documentId]);

    const getUserByCandidate = async () => {
        const user = await UserService.user_get_by_id(candidateUserId);

        dispatch(getUser([user]));
        dispatch(getInitials(`${user.first_name} ${user.last_name}`));
    };

    const onSelect = (userId, option) => {
        dispatch(clearItemValue());
        dispatch(getUser(usersFromStore.filter((user) => user.id === userId)));
        const initials = `${option?.label?.props?.name} ${option?.label?.props?.surname}`;
        dispatch(getInitials(initials));
        setInputText(initials);
        setPage(0);
    };

    const onClear = () => {
        dispatch(resetUsers());
        setSearchText("");
        setInputText("");
        setPage(0);
        setHasMore(true);
    };

    const isSubjectDisabled = () => {
        return !!(isFromVacancy || candidateUserId || isFromCandidate || userDisable);
    };

    return (
        <Row>
            <Col xl={7}>
                <b>
                    <h5 style={{ alignItems: "center", marginTop: "5px" }}>
                        <IntlMessage id="initiate.chooseForm" />
                    </h5>
                </b>
            </Col>
            <Col xl={17}>
                <AutoComplete
                    className="chooseUser"
                    disabled={isSubjectDisabled()}
                    onPopupScroll={handleScroll}
                    options={[
                        ...usersFromStore.map((item) => ({
                            value: item.id,
                            label: (
                                <AvatarStatus
                                    name={item.first_name}
                                    surname={item.last_name}
                                    subTitleTwo={
                                        item.actual_position
                                            ? item.actual_position.name
                                            : item.position?.name
                                    }
                                    subTitleThree={item.rank?.name}
                                    src={item.icon}
                                />
                            ),
                        })),
                        ...(hasMore || loading ? [LOADING_OPTION] : []),
                    ]}
                    onSelect={onSelect}
                    onSearch={handleSearch}
                    onClear={onClear}
                    allowClear
                    notFoundContent={<IntlMessage id="initiate.notFoundUsers" />}
                    value={inputText}
                />
            </Col>
        </Row>
    );
};

export default UserForm;
