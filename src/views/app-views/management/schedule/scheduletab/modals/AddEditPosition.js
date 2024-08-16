import { QuestionCircleFilled } from '@ant-design/icons/lib/icons';
import { Checkbox, Form, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import { PrivateServices } from 'API';
import { LocalText } from '../../../../../../components/util-components/LocalizationText/LocalizationText';
import SelectPickerMenuService from "../../../../../../services/myInfo/SelectPickerMenuService";

const leader = { leader: 'Начальник' };
const AddEditPosition = ({
    setPosition,
    form,
    staffDivision,
    setIsLeader,
    isCurator,
    setIsCurator,
    setCuratorDep,
    isOpen
}) => {
    const [positionList, setPositionList] = useState([]);
    const [divisionParents, setDivisionParents] = useState([]);
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10 });
    const [searchText, setSearchText] = useState({});
    const [maxCount, setMaxCount] = useState(0);

    useEffect(() => {
        if (!form.isFieldsTouched()) {
            form.resetFields();
        }
    }, [form]);

    useEffect(() => {
        PrivateServices.get('/api/v1/staff_division').then((response) => {
            setDivisionParents(flattenArray(response.data[0].children));
        });
    }, []);

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
            label: LocalText.getName(item) + ' (' + item.category_code + ')',
            object: item,
        }));
    };
    const fetchOptions = async () => {
        const position_list = await fetchOptionsData("/positions", "position");

        setPositionList(position_list);
    };

    const handlePosition = (e) => {
        const pos = positionList.find((item) => item.value === e).object;
        if (pos?.name?.startsWith(leader.leader)) {
            setIsLeader(true);
        }
        setPosition(pos);
    };

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
        setCuratorDep(e);
    };

    const handleSearch = (value, type) => {
        setSearchText((prevData) => ({ ...prevData, [type]: value }));
    };
    const handlePopupScroll = (e, type) => {
        const { target } = e;
        if (target.scrollTop + target.clientHeight === target.scrollHeight) {
            loadMoreOptions(type);
        }
    };
    const loadMoreOptions = (type) => {
        const newLimit = scrollingLength.limit + 10;
        const limitedLimit = newLimit > maxCount[type] ? maxCount[type] : newLimit;

        setScrollingLength({ skip: scrollingLength.skip, limit: limitedLimit });
    };


    return (
        <div>
            <Form form={form} layout="vertical">
                <Form.Item
                    label={
                        <>
                            <IntlMessage id="name.position" />
                            <QuestionCircleFilled
                                style={{
                                    color: ' rgba(114, 132, 154, 0.4)',
                                    marginLeft: '5px',
                                }}
                            />
                        </>
                    }
                    rules={[
                        { required: true, message: <IntlMessage id={'candidates.title.must'} /> },
                    ]}
                    required
                    name="position"
                    style={{ margin: '0 0 10px' }}
                >
                    <Select
                        showSearch
                        style={{ width: '100%' }}
                        onChange={handlePosition}
                        options={
                            Array.isArray(staffDivision.leader_id) &&
                            staffDivision.leader_id !== null
                                ? positionList
                                      .filter((pos) => !pos.object.name.startsWith(leader.leader))
                                : positionList
                        }
                        filterOption={(inputValue, option) =>
                            option?.label?.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                        }
                        onSearch={(e) => handleSearch(e, "position")}
                        onPopupScroll={(e) => handlePopupScroll(e, "position")}
                    />
                </Form.Item>
                <Form.Item
                    name="isCurator"
                    style={{marginTop:'16px'}}
                >
                <Checkbox
                    onChange={() => setIsCurator(!isCurator)}
                >
                    <IntlMessage id={'candidates.currentTable.curator'} />
                </Checkbox>
                </Form.Item>
                {
                    isCurator===true &&
                    <Form.Item
                        label={
                            <>
                                <IntlMessage id="schedule.curator.choose.dep" />
                                <QuestionCircleFilled
                                    style={{
                                        color: 'rgba(114, 132, 154, 0.4)',
                                        marginLeft: '5px',
                                    }}
                                />
                            </>
                        }
                        rules={[{ required: true,
                            message: <IntlMessage id={'candidates.title.must'} />,
                        }]}
                        required
                        name="curator_dep"
                        style={{marginTop:'16px'}}
                    >
                        <Select
                            style={{ width: '100%' }}
                            onChange={handleCurator}
                            options={divisionParents
                                .map((r) => ({
                                    value: r.id,
                                    label: <>
                                    {LocalText.getName(r)}
                                    </>,
                                }))}
                        />
                    </Form.Item>
                }
            </Form>
        </div>
    );
};

export default AddEditPosition;
