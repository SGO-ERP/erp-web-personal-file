import React from 'react';

function Circle(props) {
    const { color, size } = props;
    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: color,
                marginRight: '13px',
            }}
        />
    );
}

function RatingBar(props) {
    const { rating } = props;

    const circles = Array.from({ length: 5 }).map((_, index) => {
        const circleColor = index < rating ? '#366EF6' : '#E6EBF1';
        return <Circle key={index} color={circleColor} size="10px" />;
    });

    return <div style={{ display: 'flex' }}>{circles}</div>;
}

export default RatingBar;
