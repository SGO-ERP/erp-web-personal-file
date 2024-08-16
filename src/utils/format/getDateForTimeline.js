import moment from "moment";

const getDateForTimeLine = (date) => {
    if (!date) {
        moment(Date.now()).format("DD.MM.YYYY");
    }

    return moment(date).format("DD.MM.YYYY");
};

export default getDateForTimeLine;
