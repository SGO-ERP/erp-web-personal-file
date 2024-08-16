function TextComponent({
    text,
    defaultMessage = localStorage.getItem('lan') === 'kk' ? 'Деректер жоқ' : 'Данные отсутствует',
}) {
    return text === null || text === undefined ? defaultMessage : text;
}

export default TextComponent;
