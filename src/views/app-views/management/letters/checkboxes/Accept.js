import { BlueCheckBox } from './BlueCheckbox';

export const Accept = ({ childrenChecked, onChange, hasText }) => {
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ paddingRight: '5px' }}>
                <BlueCheckBox />
                {/* <BlueCheckBox checked={childrenChecked} onChange={onChange} /> */}
            </div>
            {hasText ? 'Принять' : ''}
        </div>
    );
};
