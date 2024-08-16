import moment from "moment";

export const disabledDate = (current) => {
    // Disable future dates
    return current && current > moment().endOf("day");
};
export const disabledDateAfter = (current) => {
    // Disable dates after today
    return current && current < moment().startOf("day");
};
export const isTillTomorrow = (current) => {
    return current && current > moment().add(1, 'day').startOf('day');
}