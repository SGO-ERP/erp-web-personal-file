export const setCorrectDate = (date: string | null): string | null => {
    if (!date) return date;

    const newDate: Date = new Date(date);

    newDate.setHours(6);
    newDate.setMinutes(0);
    newDate.setSeconds(0);

    const formattedDate: string = `${newDate.getFullYear()}-${(newDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${newDate.getDate().toString().padStart(2, "0")}T${newDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${newDate.getMinutes().toString().padStart(2, "0")}:${newDate
        .getSeconds()
        .toString()
        .padStart(2, "0")}.001+0001`;

    return formattedDate;
};
