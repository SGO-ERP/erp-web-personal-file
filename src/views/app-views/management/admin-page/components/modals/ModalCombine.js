import React, { useEffect } from "react";
import { Form, Input, Modal, Select } from "antd";
import IntlMessage from "../../../../../../components/util-components/IntlMessage";
import { useForm } from "antd/es/form/Form";
import { PrivateServices } from "../../../../../../API";
import { useAppSelector } from "../../../../../../hooks/useStore";
import LocalizationText from "../../../../../../components/util-components/LocalizationText/LocalizationText";

const ModalCombine = ({ onClose, isOpen, choose, record, setRecord }) => {
    const [form] = useForm();
    const { rank_types } = useAppSelector((state) => state.adminRanks);
    const { badge_types } = useAppSelector((state) => state.adminBadge);
    const { position_types } = useAppSelector((state) => state.adminPositions);
    const { penalty_types } = useAppSelector((state) => state.adminPenalties);
    const { property_types } = useAppSelector((state) => state.adminProperties);
    const { sport_types } = useAppSelector((state) => state.adminSportTypes);
    const { status_types } = useAppSelector((state) => state.adminStatuses);
    const { specialty_types } = useAppSelector((state) => state.adminSpecialties);
    const { academic_degree_types } = useAppSelector((state) => state.adminAcademicDegrees);
    const { academic_title_types } = useAppSelector((state) => state.adminAcademicTitles);
    const { country_types } = useAppSelector((state) => state.adminCountries);
    const { course_types } = useAppSelector((state) => state.adminCourses);
    const { institution_types } = useAppSelector((state) => state.adminInstitutions);
    const { institution_degree_types } = useAppSelector((state) => state.adminInstitutionDegrees);
    const { language_types } = useAppSelector((state) => state.adminLanguages);
    const { science_types } = useAppSelector((state) => state.adminSciences);
    const { nationality_types } = useAppSelector((state) => state.adminNationalities);
    const { birthPlace_types } = useAppSelector((state) => state.adminBirthPlaces);
    const { citizenship_types } = useAppSelector((state) => state.adminCitizenship);
    const { illness_types } = useAppSelector((state) => state.adminIllness);
    const { liberation_types } = useAppSelector((state) => state.adminLiberation);
    const { violation_types } = useAppSelector((state) => state.adminViolation);
    const { city_types } = useAppSelector((state) => state.adminCity);
    const { region_types } = useAppSelector((state) => state.adminRegion);
    const { military_institution_types } = useAppSelector(
        (state) => state.adminMilitaryInstitution,
    );
    const { sport_degree_type } = useAppSelector((state) => state.adminSportDegreeType);
    const { weapon_models } = useAppSelector((state) => state.adminWeaponModels);
    const { weapon_types } = useAppSelector((state) => state.adminWeaponType);
    const { clothing_types } = useAppSelector((state) => state.adminClothingType);
    const { clothing_models } = useAppSelector((state) => state.adminClothingModels);
    const { other_types } = useAppSelector((state) => state.adminOtherType);
    const { other_models } = useAppSelector((state) => state.adminOtherModel);

    const handleOk = async () => {
        const entityMappings = {
            "Звание": "ranks",
            "Медали": "badges",
            "Должность": "positions",
            "Взыскание": "penalties",
            "Вид имущество": "properties",
            "Вид спорта": "sport_degree_type",
            "Статус": "statuses",
            "Специальность": "specialties",
            "Академическая степень": "academic_degrees",
            "Ученое звание степени": "academic_titles",
            "Страна": "country",
            "Поставщики курсов": "courses",
            "Степень": "inst_degrees",
            "Учебные заведения": "institution",
            "Языки": "languages",
            "Наука": "sciences",
            "Национальность": "nationality",
            "Mесто рождения": "birthplace",
            "Гражданство": "citizenship",
            "Наименование болезни": "illness_type",
            "Освобождение": "liberation",
            "Правонарушение": "violation_type",
            "Город": "city",
            "Область": "region",
            "Военные учебные заведения": "military_institution",
            "Наименование спортивного навыка": "sport_degree_type",
            "Тип вооружения": "createWeaponType",
            "Модели вооружения": "createWeaponModel",
            "Тип одежды`": "createClothingType",
            "Модели одежды": "createClothingModel",
            "Тип иного": "createOtherType",
            "Модели иного": "createOtherModel",
        };

        const entity = entityMappings[choose];
        const values = form.getFieldsValue();

        if (entity) {
            await PrivateServices.post("/api/v1/dictionary/operations/join_records", {
                params: {
                    query: {
                        entity: entity,
                    },
                },
                body: {
                    correct_id: values.chooseRecordPriority,
                    ids_to_change: values.chooseRecordToCombine,
                },
            });
        }

        handleCancel();
    };

    const handleCancel = () => {
        setRecord("");
        form.resetFields();
        onClose();
    };

    const handleOption = () => {
        const optionMap = {
            "Звание": rank_types.data.objects,
            "Медали": badge_types.data.objects,
            "Должность": position_types.data.objects,
            "Взыскание": penalty_types.data.objects,
            "Вид имущество": property_types.data.objects,
            "Вид спорта": sport_types.data.objects,
            "Статус": status_types.data.objects,
            "Специальность": specialty_types.data.objects,
            "Академическая степень": academic_degree_types.data.objects,
            "Ученое звание степени": academic_title_types.data.objects,
            "Страна": country_types.data.objects,
            "Поставщики курсов": course_types.data.objects,
            "Степень": institution_degree_types.data.objects,
            "Учебные заведения": institution_types.data.objects,
            "Языки": language_types.data.objects,
            "Наука": science_types.data.objects,
            "Национальность": nationality_types.data,
            "Mесто рождения": birthPlace_types.data,
            "Гражданство": citizenship_types.data,
            "Наименование болезни": illness_types.data,
            "Освобождение": liberation_types.data.objects,
            "Правонарушение": violation_types.data,
            "Город": city_types.data,
            "Область": region_types.data,
            "Военные учебные заведения": military_institution_types.data.objects,
            "Наименование спортивного навыка": sport_degree_type.data.objects,
            "Тип вооружения": weapon_types.data.objects,
            "Модели вооружения": weapon_models.data,
            "Тип одежды": clothing_types.data.objects,
            "Модели одежды": clothing_models.data,
            "Тип иного": other_types.data.objects,
            "Модели иного": other_models.data,
        };

        return (
            optionMap[choose]?.map((item) => ({
                value: item.id,
                label: <LocalizationText text={item} />,
            })) || []
        );
    };

    useEffect(() => {
        form.setFieldsValue({
            chooseRecord: record.name,
        });
    }, [isOpen, record]);

    return (
        <Modal
            title={<IntlMessage id={"admin.panel.modal.combine.title"} />}
            open={isOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
            cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
        >
            <Form form={form} layout={"vertical"}>
                <Form.Item
                    name="chooseRecord"
                    label={<IntlMessage id={"admin.panel.choose.record"} />}
                    rules={[
                        {
                            required: true,
                            message: <IntlMessage id={"candidates.title.must"} />,
                        },
                    ]}
                >
                    <Input disabled={true} />
                </Form.Item>

                <Form.Item
                    name="chooseRecordToCombine"
                    label={<IntlMessage id={"admin.panel.choose.record.combine"} />}
                    rules={[
                        {
                            required: true,
                            message: <IntlMessage id={"candidates.title.must"} />,
                        },
                    ]}
                >
                    <Select mode={"multiple"} options={handleOption()} />
                </Form.Item>

                <Form.Item
                    name="chooseRecordPriority"
                    label={<IntlMessage id={"admin.panel.choose.record.combine.priority"} />}
                    rules={[
                        {
                            required: true,
                            message: <IntlMessage id={"candidates.title.must"} />,
                        },
                    ]}
                >
                    <Select options={handleOption()} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalCombine;
