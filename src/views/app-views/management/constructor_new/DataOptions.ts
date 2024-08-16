export const dataTaken = [
    {
        value: 'manual',
        label: 'Ручной',
    },
    {
        value: 'auto',
        label: 'Авто',
    },
    {
        value: 'dropdown',
        label: 'Справочник',
    },
    {
        value: 'document_params',
        label: 'Параметры документа (авто)',
    },
];

export const dataTakenKZ = [
    {
        value: 'manual',
        label: 'Қолмен бақылау',
    },
    {
        value: 'auto',
        label: 'Авто',
    },
    {
        value: 'dropdown',
        label: 'Анықтамалық',
    },
    {
        value: 'document_params',
        label: 'Құжат параметлерi (авто)',
    },
];

export const auto_option = (isKkLanguage) => [
    {
        value: 'name',
        label: isKkLanguage ? 'Тақырып атауы' : 'Имя субъекта',
    },
    {
        value: 'surname',
        label: isKkLanguage ? 'Пәннің аты-жөні' : 'Фамилия субъекта',
    },
    {
        value: 'father_name',
        label: isKkLanguage ? 'Субъектінің әкесінің аты' : 'Отчество субъекта',
    },
    {
        value: 'rank',
        label: isKkLanguage ? 'Пән дәрежесі' : 'Звание субъекта',
    },
    {
        value: 'position',
        label: isKkLanguage ? 'Субъекттің Қызмет атауы' : 'Должность субъекта',
    },
    {
        value: 'officer_number',
        label: isKkLanguage ? 'Субъект қызметкерінің нөмірі' : 'Офицерский номер субъекта',
    },
    {
        value: 'date-of-living',
        label: isKkLanguage ? 'Tуған күні' : 'Дата рождения',
    },
    {
        value: 'length-of-service-year',
        label: isKkLanguage ? 'Қызмет өтілі (жыл)' : 'Выслуга лет (годы)',
    },
    {
        value: 'length-of-service-month',
        label: isKkLanguage ? 'Қызмет өтілі (айлар)' : 'Выслуга лет (месяца)',
    },
    {
        value: 'length-of-service-day',
        label: isKkLanguage ? 'Қызмет өтілі (күндер)' : 'Выслуга лет (дни)',
    },
    {
        value: 'length-of-work-year',
        label: isKkLanguage ? 'Нақты жұмыс өтілі (жыл)' : 'Стаж работы фактический (года)',
    },
    {
        value: 'length-of-work-month',
        label: isKkLanguage ? 'Нақты жұмыс өтілі (айлар)' : 'Стаж работы фактический (месяца)',
    },
    {
        value: 'length-of-work-day',
        label: isKkLanguage ? 'Нақты жұмыс өтілі (күндер)' : 'Стаж работы фактический (дни)',
    },
    {
        value: 'total-of-service-year',
        label: isKkLanguage
            ? 'Еңбек өтілі және еңбек өтілі (жылдар)'
            : 'Стаж работы в сумме с выслугой лет (годы)',
    },
    {
        value: 'total-of-service-month',
        label: isKkLanguage
            ? 'Еңбек өтілі және еңбек өтілі (айлар)'
            : 'Стаж работы в сумме с выслугой лет (месяца)',
    },
    {
        value: 'total-of-service-day',
        label: isKkLanguage
            ? 'Еңбек өтілі және еңбек өтілі (күндер)'
            : 'Стаж работы в сумме с выслугой лет (дни)',
    },
    {
        value: 'family_member',
        label: isKkLanguage ? 'Отбасы деректері' : 'Данные о семье',
    },
];

export const cases = (isKkLanguage) => [
    {
        value: 0,
        label: isKkLanguage ? 'Атау септік' : 'Именительный падеж',
    },
    {
        value: 1,
        label: isKkLanguage ? 'Ілік септік' : 'Родительный падеж',
    },
    {
        value: 2,
        label: isKkLanguage ? 'Барыс септік' : 'Дательный падеж',
    },
    {
        value: 3,
        label: isKkLanguage ? 'Табыс септік' : 'Винительный падеж',
    },
    {
        value: 4,
        label: isKkLanguage ? 'Жатыс септік' : 'Предложный падеж',
    },
    {
        value: 5,
        label: isKkLanguage ? 'Шығыс септік' : 'Исходный падеж',
    },
    {
        value: 6,
        label: isKkLanguage ? 'Көмектес септік' : 'Творительный падеж',
    },
];

export const dictionary = (isKkLanguage) => [
    {
        value: 'rank',
        label: isKkLanguage ? 'Жаңа тақырып атауы' : 'Новое звание субъекта',
    },
    {
        value: 'badges',
        label: isKkLanguage ? 'Презентация үшін медаль' : 'Медаль для вручения',
    },
    {
        value: 'staff_unit',
        label: isKkLanguage ? 'Жаңа қызмет атауы' : 'Новая должность субъекта',
    },
    {
        value: 'statuses',
        label: isKkLanguage ? 'Мәртебелер' : 'Статусы',
    },
    {
        value: 'status_leave',
        label: isKkLanguage ? 'Мерекелік күйлер' : 'Статусы для отпуска',
    },
    {
        value: 'secondments',
        label: isKkLanguage ? 'Қызметке жіберу' : ' Прикомандирования',
    },
    {
        value: 'state_body',
        label: isKkLanguage ? 'Іссапарға жіберу' : 'Откомандирования',
    },
    {
        value: 'penalties',
        label: isKkLanguage ? 'Жинақ формасы' : 'Форма взыскания',
    },
    {
        value: 'contracts',
        label: isKkLanguage ? 'Келісімшарт' : 'Контракт',
    },
];

export const inputFormat = (isKkLanguage) => [
    {
        value: 'string',
        label: isKkLanguage ? 'Жол' : 'Строка',
    },
    {
        value: 'number',
        label: isKkLanguage ? 'Сан' : 'Цифра',
    },
    {
        value: 'date',
        label: isKkLanguage ? 'Күн' : 'Дата',
    },
];

export const styleUnser = {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(114, 132, 154, 0.4)',
    color: 'white',
    fontSize: 11,
    display: 'flex',
    justifyContent: 'center',
};

export const field_default = (isKkLanguage) => [
    {
        value: 'signed_at',
        label: isKkLanguage ? 'Қол қойылған күні' : 'Дата подписания',
    },
    {
        value: 'reg_number',
        label: isKkLanguage ? 'Тіркеу нөмірі' : 'Регистрационный номер',
    },
    {
        value: 'approving_name',
        label: isKkLanguage ? 'Бекітушінің аты-жөні' : 'ФИО утверждающего',
    },
    {
        value: 'approving_rank',
        label: isKkLanguage ? 'Бекітуші атауы' : 'Звание утверждающего',
    },
];
