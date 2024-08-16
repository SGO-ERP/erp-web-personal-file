export const BlueCheckBox = ({ checked, onChange, checkboxIndex }) => {
    return (
        <label>
            <input
                type="checkbox"
                onChange={(e) => {
                    onChange(true, checkboxIndex);
                }}
            />
            <svg
                className={`checkbox ${checked ? 'blue-checkbox--active' : ''}  `}
                aria-hidden="true"
                viewBox="0 0 15 11"
                fill="none"
            >
                <path
                    d="M1 4.5L5 9L14 1"
                    strokeWidth="2"
                    stroke={checked ? '#fff' : 'none'} // only show the checkmark when `isCheck` is `true`
                />
            </svg>
        </label>
    );
};
