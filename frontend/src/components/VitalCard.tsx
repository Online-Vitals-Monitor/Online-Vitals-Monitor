import React from 'react';

type VitalProps = {
    title: string;
    value: number | string;
    unit?: string;              //units like bpm, %, or heart rate
    className?: string;         //layout classes
};

const VitalCard: React.FC<VitalProps> = ({
        title,
        value,
        unit,
        className = ''
    }) => 
{
    return (
        <div className={`vital-card ${className}`}>
            <div className='card text-center'>
                <div className='card-body'>
                    <h5 className='card-title'>{title}</h5>
                    <p className='card-text display-4'>
                        {value} {unit ? <small className='ms-1'>{unit}</small> : null}
                    </p>
                </div>
            </div>
        </div>        
    );
}

export default VitalCard;