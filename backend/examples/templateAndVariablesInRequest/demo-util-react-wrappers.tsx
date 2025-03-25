import React, { ReactElement } from 'react'

export function templateReactWrapper_demo2(reactElement: ReactElement) {
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
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    fontSize: 60,
                    fontWeight: 700,
                    fontFamily: 'Inter',
                    background: 'white',
                    color: 'black',
                    width: '100%',
                    height: '100%',
                    padding: '20px 50px',
                    lineHeight: 1.4,
                    whiteSpace: 'pre-wrap',
                }}
            >
                {reactElement}
            </div>
        </div>
    );
}