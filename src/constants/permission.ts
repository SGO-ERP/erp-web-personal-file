export const PERMISSION = {
    STAFF_LIST_EDITOR: 1, // Редактирование штатного расписания
    PERSONAL_PROFILE_EDITOR: 2, // Редактирование личных дел
    VIEW_ALL_EMPLOYEES: 3, // Просмотр сотрудников
    VACANCY_MANAGEMENT: 4, // Управление вакансими
    VIEW_STAFF_LIST: 5, // Просмотр штатного расписания
    ADMIN_PANEL: 7, // Доступ к админ панели
    BSP_EDITOR: 8, // Редактирование БСП
    SURVEY_EDITOR: 9, // Редактирование Опросов
    PSYCH_CHARACTERISTIC_EDITOR: 10, // Редактирование псих. характеристики в личном деле
    POLIGRAPH_EDITOR: 11, // Редактирование результата полиографа в личном деле
    VIEW_ALL_EMPLOYEES_BY_DEPARTMENT: 12, // Просмотр сотрудников по подразделению
    VIEW_SERVICE_CHARACTERISTICS: 13, // Просмотр служебной характеристики
    VIEW_POLIGRAPH: 14, // Просмотр полиграфа
    VIEW_SPEC_INSPECTIONS: 15, // Просмотр спец. проверок
    VIEW_ATTESTATION: 16, // Просмотр аттестаций
    VIEW_UD: 17, // Просмотр данных по удостоверению личности
    VIEW_DISP_UCHET: 18, // Просмотр диспансерского учета
    VIEW_LEAVES: 19, // Просмотр освобождений
    VIEW_MEDICAL_LISTS: 20, // Просмотр больничных листов
    VIEW_VIOLATIONS: 21, // Просмотр правонарушений
    VIEW_PSYCH_CHARACTERISTICS: 22, // Просмотр псих. характеристики
    VIEW_FAMILY: 23, // Просмотр семьи
    VIEW_FAMILY_ADDITIONAL: 24, // Просмотр семьи (доп. сведения)
} as const;