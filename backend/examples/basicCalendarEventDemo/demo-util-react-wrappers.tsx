import React, { ReactElement } from 'react'

export function templateReactWrapper_demo1(reactElement: ReactElement) {
    return (
        <div
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                position: 'relative',
                filter: 'grayscale(100%)',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    // alignItems: 'center',
                    // justifyContent: 'center',
                    // textAlign: 'center',
                    fontSize: 20,
                    fontWeight: 700,
                    fontFamily: 'Inter',
                    background: 'white',
                    color: 'black',
                    width: '100%',

                    padding: '5px 5px',
                    lineHeight: 1.4,
                    // whiteSpace: 'pre-wrap',
                }}
            >
                {reactElement}
            </div>
        </div>
    );
}