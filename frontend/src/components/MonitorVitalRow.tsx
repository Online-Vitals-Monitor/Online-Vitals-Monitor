import React, { useEffect, useRef, useMemo, useCallback } from "react";


//Interface for a vital single row 
interface MontiorVitalRowProps {
    label: string; 
    unit: string;
    value: number | string;
    color: string;
    isLast?: Boolean;
    children?: React.ReactNode; //Waveform is optional for a vital 
}

const MonitorVitalRow: React.FC<MontiorVitalRowProps> = ({
    label, 
    unit, 
    value, 
    color, 
    isLast,
    children
}) => {
    return (
        <div style={{
            flex: 1,
            minHeight: 0,
            borderBottom: isLast ? 'none' : '1px solid #333',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
        }}>
            {/* LEFT: Numerics Panel */}
            <div
                className='d-flex flex-column justify-content-center ps4'
                style={{
                    width: '200px',
                    minWidth: '200px',
                    borderRight: '1px solid #333',
                    height: '100%'
                }}
            >
                <div style={{ color: color, fontSize: '1.2rem', fontWeight: 'bold'}}>
                    {label} <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>{unit}</span>
                </div>

                <div style={{
                    color: color,
                    fontSize: '5rem',
                    lineHeight: '1',
                    fontWeight: 'bold',
                    marginTop: '5px'
                }}>
                    {value}
                </div>
            </div>

            {/* Right: Waveform area (If it exists) */}
            <div className="flex-grow-1 h-100 position-relative d-flex align-items-center" 
                    style={{ overflow: "hidden" }}>
                {children}
            </div>
        </div>
    )
}

export default MonitorVitalRow;