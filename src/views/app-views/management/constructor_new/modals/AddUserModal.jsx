import { Col, Form, Modal, Radio, Row, Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DocumentStaffFunctionTypeService from "services/DocumentStaffFunctionTypeService";
import HrDocumentService from "services/HrDocumentsService";
import "../style.css";
import IntlMessage from "components/util-components/IntlMessage";
import {
    addUserInfo,
    clearEditUser,
    showAddUser,
} from "store/slices/newConstructorSlices/constructorNewSlice";
import Matreshka from "../../additionalComponents/Matreshka";
import uuidv4 from "utils/helpers/uuid";

const AddUserModal = () => {
    const { editUser, addUserModal, usersArray } = useSelector((state) => state.constructorNew);

    const [matreshkaValue, setMatreshkaValue] = useState({});
    const [dropdownItems, setDropdownItems] = useState([]);
    const [dropdownRoles, setDropdownRoles] = useState([]);
    const [currentRole, setCurrentRole] = useState(null);
    const [userType, setUserType] = useState("auto");
    const [autoUser, setAutoUser] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState([]);

    const [form] = Form.useForm();
    const dispatch = useDispatch();

    useEffect(() => {
        HrDocumentService.getMatreshka().then((r) => setDropdownItems(r));

        DocumentStaffFunctionTypeService.get_document_staff_type().then((r) => setDropdownRoles(r));
    }, []);

    const autoUserOptions = [
        {
            value: 4,
            label: "Прямой начальник",
        },
        {
            value: true,
            label: "Непосредственный начальник",
        },
        {
            value: 1,
            label: "Куратор",
        },
        {
            value: 2,
            label: "ПГС",
        },
        {
            value: 3,
            label: "Начальники",
        },
        {
            value: 5,
            label: "Все сотрудники",
        },
    ];

    const transformRoleData = (data, table) => {
        return data
            .filter(
                (el) =>
                    !table.some(
                        (name) =>
                            ["Инициатор", "Утверждающий", "Уведомляймый"].includes(name.role) &&
                            el.name === name.role,
                    ),
            )
            .map((el) => ({ value: el.id, label: el.name }));
    };

    const roleData = transformRoleData(dropdownRoles, editUser.key ? [] : usersArray);

    const matreshkaValidate = (rule) => {
        return new Promise((resolve, reject) => {
            if (!matreshkaValue.ids) {
                reject(<IntlMessage id="constructor.role.user.empty" />);
            } else {
                resolve();
            }
        });
    };

    const autoUserValidate = (rule) => {
        return new Promise((resolve, reject) => {
            if (!autoUser) {
                reject(<IntlMessage id="constructor.role.user.empty" />);
            } else {
                resolve();
            }
        });
    };

    const handleRole = (e) => {
        const filteredRole = dropdownRoles.find((el) => el.id === e);

        setCurrentRole(filteredRole);
    };

    const handleOk = async () => {
        const values = await form.validateFields();

        const unitId = matreshkaValue.ids
            ? matreshkaValue.ids[matreshkaValue.ids.length - 1]
            : null;

        const roleKeyMap = {
            "Инициатор": 1,
            "Уведомляемый": -1,
            "Утверждающий": 100,
        };

        const autoUserPosition =
            typeof autoUser === "boolean"
                ? autoUser
                    ? "Непосредственный начальник"
                    : null
                : autoUser === 1
                ? "Куратор"
                : autoUser === 2
                ? "ПГС"
                : autoUser === 3
                ? "Начальники"
                : autoUser === 4
                ? "Прямой начальник"
                : autoUser === 5
                ? "Все сотрудники"
                : null;

        const key =
            roleKeyMap[currentRole.name] ||
            (usersArray.length === 0
                ? 2
                : Math.max(...usersArray.map((item) => (item.key !== 100 ? item.key : 2))) + 1);

        dispatch(
            addUserInfo({
                roleId: currentRole.id,
                role: currentRole.name,
                autoUserType: autoUser === 4 ? false : autoUser,
                position: matreshkaValue.fullName ?? autoUserPosition,
                positionId: matreshkaValue.ids ?? null,
                unitId: unitId || null,
                key,
                id: editUser.id ? editUser.id : uuidv4(),
            }),
        );

        handleClose();
    };

    const handleClose = () => {
        form.resetFields();

        setMatreshkaValue({});
        setCurrentRole(null);
        setUserType("auto");
        setAutoUser(null);
        setFilteredUsers([]);

        dispatch(showAddUser(false));
        dispatch(clearEditUser());
    };

    useEffect(() => {
        form.resetFields();

        const values = {
            role: editUser.roleId,
        };

        if (editUser.key) {
            values.special_user = editUser.autoUserType === false ? 4 : editUser.autoUserType;

            const role = dropdownRoles.find((e) => e.id === editUser.roleId);
            const filteredTable = usersArray.filter((e) =>
                editUser.positionId ? e.positionId !== editUser.positionId : true,
            );

            if (editUser.autoUserType !== null) {
                setUserType("auto");
                setAutoUser(editUser.autoUserType === false ? 4 : editUser.autoUserType);
            } else {
                setUserType("choose");
                setFilteredUsers(filteredTable);
            }

            setCurrentRole(role);
        }

        form.setFieldsValue(values);
    }, [form, addUserModal, editUser]);

    return (
        <div>
            <Modal
                title={<IntlMessage id={"constructor.addParticipant"} />}
                open={addUserModal}
                okText={<IntlMessage id={"initiate.save"} />}
                cancelText={<IntlMessage id={"cancel"} />}
                onCancel={handleClose}
                onOk={handleOk}
            >
                <Col xs={24}>
                    <Row>
                        <Radio.Group style={{ marginBottom: "2%" }} value={userType}>
                            <Radio.Button
                                value="choose"
                                style={{ minWidth: "200px" }}
                                onClick={(e) => setUserType(e.target.value)}
                            >
                                <IntlMessage id={"order.add.user.current"} />
                            </Radio.Button>
                            <Radio.Button
                                value="auto"
                                style={{ minWidth: "200px" }}
                                onClick={(e) => setUserType(e.target.value)}
                            >
                                <IntlMessage id={"order.add.user.auto"} />
                            </Radio.Button>
                        </Radio.Group>
                    </Row>

                    <Form form={form} layout="vertical">
                        <Form.Item
                            label={<IntlMessage id={"letters.unsignedTable.role"} />}
                            name="role"
                            tooltip={<IntlMessage id={"constructor.selectRole"} />}
                            rules={[
                                {
                                    required: true,
                                    message: <IntlMessage id={"constructor.role.empty"} />,
                                },
                            ]}
                            required
                        >
                            <Select
                                filterOption={(inputValue, option) =>
                                    option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >=
                                    0
                                }
                                placeholder={<IntlMessage id={"constructor.selectRole"} />}
                                onChange={handleRole}
                                options={roleData}
                                showSearch
                            />
                        </Form.Item>
                        {userType !== "auto" ? (
                            <Form.Item
                                label={<IntlMessage id={"constructor.participant"} />}
                                name="auto_user"
                                tooltip="Локальное имя тега, будет отображаться в документе"
                                rules={[
                                    {
                                        validator: matreshkaValidate,
                                    },
                                ]}
                                required
                            >
                                <Matreshka
                                    placeholderId={"constructor.selectParticipant"}
                                    setValue={setMatreshkaValue}
                                    data={dropdownItems}
                                    filter={editUser.key ? filteredUsers : usersArray}
                                    role={currentRole}
                                    disable={true}
                                    edit={editUser}
                                />
                            </Form.Item>
                        ) : (
                            <Form.Item
                                label={<IntlMessage id={"order.add.user.auto"} />}
                                name="special_user"
                                tooltip="Локальное имя тега, будет отображаться в документе"
                                rules={[
                                    {
                                        validator: autoUserValidate,
                                    },
                                ]}
                                required
                            >
                                <Select
                                    placeholder={
                                        <IntlMessage id={"constructor.selectParticipant"} />
                                    }
                                    onChange={(val) => setAutoUser(val)}
                                    options={autoUserOptions}
                                    filterOption={(inputValue, option) =>
                                        option.label
                                            .toLowerCase()
                                            .indexOf(inputValue.toLowerCase()) >= 0
                                    }
                                    showSearch
                                />
                            </Form.Item>
                        )}
                    </Form>
                </Col>
            </Modal>
        </div>
    );
};

export default AddUserModal;
