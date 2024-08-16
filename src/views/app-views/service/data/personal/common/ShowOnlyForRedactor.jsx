import { useSelector } from 'react-redux';

const ShowOnlyForRedactor = (props) => {
    const { forRedactor, forEveryone } = props;
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);

    return (
        <>
            {modeRedactor && forRedactor}
            {!modeRedactor && forEveryone}
        </>
    );
};

export default ShowOnlyForRedactor;
