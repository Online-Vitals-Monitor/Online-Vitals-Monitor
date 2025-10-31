import React from 'react';
// import { useState } from 'react'; // disabled for CI to pass
import { Button, Box, Typography, Slider } from '@mui/material';
// import { Container, Paper, TextField, IconButton } from '@mui/material'; // disabled for CI to pass
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
// import { red } from '@mui/material/colors';  // disabled for CI to pass

/*Interface to pass in props for react-slider from @mui material ui 
 https://mui.com/material-ui/react-slider/*/
interface vitalSliderProps {
    title: string;
    step: number;               //value to decrease/increase slider by each step
    min: number;                //min number range for slider
    max: number;                //max number range for slider
    currentVal: number;         //current value
    onChange: (value: number) => void;
                                //parent callback when slider changes
}

const VitalSlider: React.FC<vitalSliderProps> = ({
    title,
    step,
    min,
    max,
    currentVal,
    onChange,
}) => {
    
    /* event handler for buttons */

    //increment the button
    const handleIncrement = () => {
        //increase value by step and clamp it by max
        onChange(Math.min(currentVal + step, max));
    }
    
    //decrement the button
    const handleDecrement = () => {
        //decrease value by step and clamp it by min
        onChange(Math.max(currentVal - step, min));
    }

    
    /* return */
    return(
        <Box sx={{ width: 300, mb: 4}}>

            <Typography variant="h6" gutterBottom>
                {title}: {currentVal}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center '}}>
                
                <Button 
                    variant="contained"
                    color="error"          
                    onClick={handleDecrement}
                    sx={{ minHeight: 50, minWidth: 55, p: 0 }}
                >
                    <RemoveIcon />
                </Button>

                <Slider
                    aria-label={title}
                    value={currentVal}                               
                    onChange={(_, newValue) => onChange(newValue as number)}  //set the react state value
                    valueLabelDisplay="auto"
                    step={step}
                    min={min}
                    max={max}
                    sx={{mx:2}}
                />
           
                <Button 
                    variant="contained"
                    color="error"          
                    onClick={handleIncrement}
                    sx={{ minHeight: 50, minWidth: 55, p: 0 }}
                >
                    <AddIcon />
                </Button>

            </Box>
        </Box>
    );
}   

export default VitalSlider