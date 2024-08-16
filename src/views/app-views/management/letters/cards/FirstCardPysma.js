import { Button, Card, Col, Input, Radio, Row } from "antd";
import IntlMessage from "components/util-components/IntlMessage";
import { APP_PREFIX_PATH } from "configs/AppConfig";
import { useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
    cascaderChanges,
    cascaderChanges2,
    changeLanguage,
} from "store/slices/initializationSlice";
import {
    getHrDocumentSNotSigned,
    postMultiHrDocumentByIdAndEcp,
} from "store/slices/lettersOrdersSlice/lettersOrdersSlice";
import { getSignedDocuments } from "store/slices/signedLettersSlice/signedLettersSlice";
import {
    changeCurrentPage,
    changeTabAction,
    notShowHideSecondCard,
    notShowHideThirdCard,
    querySearch,
    Tabs,
} from "store/slices/tableControllerSlice/tableControllerSlice";
import { getDraftLetters } from "../../../../../store/slices/signedLettersSlice/draftLettersSlice";
import { DraftLetters } from "../tables/DraftLetters";
import { History } from "../tables/History";
import { UnsignedTable } from "../tables/UnsignedTable";
import { resetSliceByOrder } from "store/slices/newInitializationsSlices/initializationNewSlice";
import SignEcp from "components/shared-components/SignEcp";
import { resetDocInfo } from "store/slices/initialization/initializationDocInfoSlice";
import { resetDocuments } from "store/slices/initialization/initializationDocumentsSlice";
import { resetUsers } from "store/slices/initialization/initializationUsersSlice";

const { Search } = Input;
export const FirstCardPysma = () => {
    const dispatch = useDispatch();
    const hrDocumentsNotSigned = useSelector((state) => state.lettersOrders.hrDocumentsNotSigned);
    const currentTab = useSelector((state) => state.tableController.currentTab);
    const showSecondCard = useSelector((state) => state.tableController.showHideSecondCard);
    const tableControllerSearch = useSelector((state) => state.tableController.searchValue);
    const [searchInput, setSearchInput] = useState("");
    const store = useStore();
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [isEcpOpen, setIsEcpOpen] = useState(false);
    const showHideSecondCard = useSelector((state) => state.tableController.showHideSecondCard);

    const { id } = useParams();

    const changeTable = (e) => {
        dispatch(changeCurrentPage({ page: 1, pageSize: 5 }));
        switch (e.target.value) {
            case Tabs.letter:
                dispatch(notShowHideSecondCard());
                dispatch(notShowHideThirdCard());
                dispatch(getHrDocumentSNotSigned({ page: 1, limit: 5 }));
                break;
            case Tabs.history:
                dispatch(notShowHideSecondCard());
                dispatch(notShowHideThirdCard());
                break;
            case Tabs.draft:
                dispatch(notShowHideSecondCard());
                dispatch(notShowHideThirdCard());
                break;
            case Tabs.candidates:
                break;

            default:
                tableComponent = null;
        }
        dispatch(changeTabAction(e.target.value));
    };

    const Sign = async () => {
        const state = store.getState();
        dispatch(
            postMultiHrDocumentByIdAndEcp({
                hrDocuments: selectedIds,
                page: state.tableController.currentPage,
                pageSize: state.tableController.pageSize,
            }),
        );
        setSelectedIds([]);
        setIsEcpOpen(false);

        setTimeout(() => {
            dispatch(notShowHideSecondCard());
        }, 1000);
    };

    let tableComponent;

    const debouncedSearch = (searchValue) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        setSearchTimeout(
            setTimeout(() => {
                dispatch(querySearch(searchValue));
                dispatch(changeCurrentPage({ page: 1, pageSize: 5 }));
                switch (currentTab) {
                    case Tabs.letter:
                        dispatch(getHrDocumentSNotSigned({ page: 1, limit: 5 }));
                        break;
                    case Tabs.history:
                        dispatch(getSignedDocuments({ page: 1, limit: 5 }));
                        break;
                    case Tabs.draft:
                        dispatch(getDraftLetters({ page: 1, limit: 5 }));
                        break;
                    case Tabs.candidates:
                        break;
                    default:
                }
            }, 300),
        );
    };

    switch (currentTab) {
        case Tabs.letter:
            tableComponent = (
                <UnsignedTable
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    hrDocumentsNotSigned={hrDocumentsNotSigned}
                    filteredUsers={hrDocumentsNotSigned}
                    isNotification={id ? true : false}
                />
            );
            break;
        case Tabs.history:
            tableComponent = <History />;
            break;
        case Tabs.draft:
            tableComponent = <DraftLetters />;
            break;
        case Tabs.candidates:
            break;

        default:
            tableComponent = null;
    }

    const initNewOrder = () => {
        dispatch(cascaderChanges(""));
        dispatch(cascaderChanges2(""));
        dispatch(changeLanguage(false));
        dispatch(resetSliceByOrder());

        dispatch(resetDocInfo());
        dispatch(resetDocuments());
        dispatch(resetUsers());
        navigate(`${APP_PREFIX_PATH}/management/letters/initiate`);
    };

    return (
        <div>
            <Card style={{ minWidth: "50vw" }}>
                <SignEcp callback={Sign} open={isEcpOpen} onClose={() => setIsEcpOpen(false)} />
                <Row justify="space-between">
                    <Col>
                        <Radio.Group
                            defaultValue={currentTab}
                            onChange={changeTable}
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                        >
                            <Radio.Button value={Tabs.letter}>
                                <IntlMessage id="letters.radioButton.unsigned" />
                            </Radio.Button>
                            <Radio.Button value={Tabs.history}>
                                <IntlMessage id="letters.radioButton.initialization" />
                            </Radio.Button>
                            <Radio.Button value={Tabs.draft}>
                                <IntlMessage id="letters.radioButton.draft" />
                            </Radio.Button>
                        </Radio.Group>
                    </Col>
                    {showSecondCard ? (
                        ""
                    ) : (
                        <Col
                            xs={24}
                            sm={12}
                            lg={10}
                            xl={8}
                            xxl={8}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Search
                                key={hrDocumentsNotSigned?.id}
                                placeholder="Поиск..."
                                style={{
                                    width: "300px",
                                    marginRight: "20px",
                                    marginTop: "10px",
                                    marginBottom: "10px",
                                }}
                                value={searchInput}
                                onChange={(e) => {
                                    setSearchInput(e.target.value);
                                }}
                                onSearch={() => {
                                    debouncedSearch(searchInput);
                                }}
                            />
                        </Col>
                    )}

                    <Col
                        style={{
                            display: "flex",
                            justifyContent: "end",
                            flexWrap: "wrap",
                        }}
                    >
                        {showSecondCard ? (
                            ""
                        ) : (
                            <Button
                                style={{
                                    marginRight: "10px",
                                    marginTop: "10px",
                                    marginBottom: "10px",
                                }}
                                onClick={() => initNewOrder()}
                                shape="default"
                            >
                                <IntlMessage id="letters.initiate.new.order" />
                            </Button>
                        )}

                        <Button
                            shape="default"
                            type="primary"
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                            onClick={() => setIsEcpOpen(true)}
                            disabled={selectedIds.length < 1}
                        >
                            <IntlMessage id="letters.sign" />
                        </Button>
                    </Col>
                </Row>
                {tableComponent}
            </Card>
        </div>
    );
};
