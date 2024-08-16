export const RedCheckBox = ({ checked, onChange, checkboxRedId }) => {
    return (
        <label>
            <input
                type="checkbox"
                onChange={(e) => {
                    // onChange(false, checkboxRedId);
                }}
            />
            <svg
                className={`checkbox ${checked ? 'checkbox--active' : ''}`}
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
            >
                <path
                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                    strokeWidth="2"
                    stroke={checked ? '#fff' : 'none'} // only show the checkmark when `isCheck` is `true`
                />
            </svg>
        </label>
    );
};
