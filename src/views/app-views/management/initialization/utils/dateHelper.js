export function formatDate(dateStr, textLanguage) {
    const months = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря",
    ];

    const monthKz = [
        "қаңтар",
        "ақпан",
        "наурыз",
        "сәуір",
        "мамыр",
        "маусым",
        "шілде",
        "тамыз",
        "қыркүйек",
        "қазан",
        "қараша",
        "желтоқсан",
    ];

    const date = new Date(dateStr);

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return `${day} ${!textLanguage ? months[month] : monthKz[month]} ${year}`;
}
