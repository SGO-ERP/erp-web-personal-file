import React, { useEffect, useState } from "react";
import { Checkbox, Form, Select, Spin } from "antd";
import IntlMessage from "../../../../../../components/util-components/IntlMessage";
import { QuestionCircleFilled } from "@ant-design/icons/lib/icons";
import { LocalText } from "../../../../../../components/util-components/LocalizationText/LocalizationText";
import { PrivateServices } from "../../../../../../API";
import SelectPickerMenuService from "../../../../../../services/myInfo/SelectPickerMenuService";
import HrDocumentService from "services/HrDocumentsService";

const leader = { leader: "Начальник" };

const EditPosition = ({
    setPosition,
    form,
    staffDivision,
    setIsLeader,
    position,
    isCurator,
    setCurator,
    isOpen,
}) => {
    const [positionList, setPositionList] = useState([]);
    const [divisionParents, setDivisionParents] = useState([]);
    const [checkCur, setCheckCur] = useState();
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10 });
    const [searchText, setSearchText] = useState({});
    const [maxCount, setMaxCount] = useState(0);

    function flattenArray(arr) {
        let flattenedArray = [];

        arr.forEach((item) => {
            flattenedArray.push(item);
            if (item.children && item.children.length > 0) {
                flattenedArray = flattenedArray.concat(flattenArray(item.children));
            }
        });

        return flattenedArray;
    }

    const handleCurator = (e) => {
        setCurator(e);
    };

    useEffect(() => {
        fetchOptions();
    }, [scrollingLength, searchText, isOpen]);

    const fetchOptionsData = async (baseUrl, type) => {
        const response = await SelectPickerMenuService.getPosition({
            ...scrollingLength,
            search: searchText[type],
            baseUrl,
        });

        setMaxCount((prevData) => ({ ...prevData, [type]: response.total }));

        return response.objects.map((item) => ({
            value: item.id,
            label: LocalText.getName(item),
            object: item,
        }));
    };
    const fetchOptions = async () => {
        const position_list = await fetchOptionsData("/positions", "position");

        setPositionList(position_list);
    };

    useEffect(() => {
        if (!position || !isOpen) return;
        fetchDivisionParents();
        const divPar = divisionParents.find((div) => div.id === isCurator);
        if (isCurator !== null) {
            setCheckCur(true);
        }
        form.setFieldsValue({
            position: {
                value: position.id,
                label: LocalText.getName(position),
            },
            isCurator: isCurator !== null,
            curator_dep: {
                value: isCurator,
                label: LocalText.getName(divPar),
            },
        });
    }, [isOpen, position]);

    const [loading, setLoading] = useState(false);

    const fetchDivisionParents = async () => {
        setLoading(true);
        try {
            const response = await HrDocumentService.getMatreshka();

            setDivisionParents(flattenArray(response[0].children));
        } catch (error) {
            console.log("parents division error: ", error);
        }

        setLoading(false);
    };

    const handleChecked = (e) => {
        setCheckCur(e.target.checked);
        if (e.target.checked === false) {
            setCurator("");
            form.setFieldsValue({
                curator_dep: null,
            });
        }
    };

    return (
        <div>
            <Form form={form} layout="vertical">
                {/*<Form.Item*/}
                {/*    label={*/}
                {/*        <>*/}
                {/*            <IntlMessage id="name.position"/>*/}
                {/*            <QuestionCircleFilled*/}
                {/*                style={{*/}
                {/*                    color: ' rgba(114, 132, 154, 0.4)',*/}
                {/*                    marginLeft: '5px',*/}
                {/*                }}*/}
                {/*            />*/}
                {/*        </>*/}
                {/*    }*/}
                {/*    rules={[*/}
                {/*        {required: true, message: <IntlMessage id={'candidates.title.must'}/>},*/}
                {/*    ]}*/}
                {/*    required*/}
                {/*    name="position"*/}
                {/*    style={{margin: '0 0 10px'}}*/}
                {/*>*/}
                {/*    <Select*/}
                {/*        showSearch*/}
                {/*        style={{width: '100%'}}*/}
                {/*        onChange={handlePosition}*/}
                {/*        options={*/}
                {/*            Array.isArray(staffDivision.leader_id) &&*/}
                {/*            staffDivision.leader_id !== null*/}
                {/*                ? positionList*/}
                {/*                    .filter((pos) => !pos.object.name.startsWith(leader.leader))*/}
                {/*                : positionList*/}
                {/*        }*/}
                {/*        filterOption={(inputValue, option) =>*/}
                {/*            option?.label?.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0*/}
                {/*        }*/}
                {/*        onSearch={(e) => handleSearch(e, "position")}*/}
                {/*        onPopupScroll={(e) => handlePopupScroll(e, "position")}*/}
                {/*    />*/}
                {/*</Form.Item>*/}
                <Form.Item name="isCurator">
                    <Checkbox checked={checkCur} onChange={(e) => handleChecked(e)}>
                        <IntlMessage id={"candidates.currentTable.curator"} />
                    </Checkbox>
                </Form.Item>
                {checkCur === true && (
                    <Form.Item
                        label={
                            <>
                                <IntlMessage id="schedule.curator.choose.dep" />
                                <QuestionCircleFilled
                                    style={{
                                        color: "rgba(114, 132, 154, 0.4)",
                                        marginLeft: "5px",
                                    }}
                                />
                            </>
                        }
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={"candidates.title.must"} />,
                            },
                        ]}
                        required
                        name="curator_dep"
                        style={{ marginTop: "16px" }}
                    >
                        <Select
                            style={{ width: "100%" }}
                            onChange={handleCurator}
                            options={divisionParents.map((r) => ({
                                value: r.id,
                                label: <>{LocalText.getName(r)}</>,
                            }))}
                            notFoundContent={loading ? <Spin size="small" /> : null}
                        />
                    </Form.Item>
                )}
            </Form>
        </div>
    );
};

export default EditPosition;
