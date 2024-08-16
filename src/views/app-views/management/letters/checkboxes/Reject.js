export const Reject = ({ childrenChecked, onChange, hasText }) => {
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ paddingRight: '5px' }}></div>
            {hasText ? 'Отказать' : ''}
        </div>
    );
};
