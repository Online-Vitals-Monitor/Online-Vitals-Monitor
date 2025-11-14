import * as React from 'react';
import { AppBar, Box, Toolbar, Typography, Dialog, DialogTitle, DialogContent, Container, Button, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

//routes object: Add pages/routes here if needed
const routes = [
    {page: 'Monitor',        path: '/'      },
    {page: 'Control Vitals', path:'/values' },
];

//array storing possible vital types: Added new vitals here if needed
 const vitalLabels = [
    { value: 'heartRate',    label: 'Heart Rate'               },
    { value: 'respRate',     label: 'Respiratory Rate'         },
    { value: 'o2Saturation', label: 'Oxygen Saturation'        },
    { value: 'systolicBP',   label: 'Systolic Blood Pressure'  },
    { value: 'diastolicBP',  label: 'Diastolic Blood Pressure' },
    { value: 'eTCO2',        label: 'End-Tidal Carbon Dioxide' },
];

//navbar based off of: https://mui.com/material-ui/react-app-bar/
const Navbar: React.FC = () => {

    const [openSettings, setOpenSettings] = React.useState(false);

    //Selected vitals from menu: use this later to determine which vitals to render on control/monitor view?
    const [selectedVitals, setSelectedVitals] = React.useState<string[]>(['heartRate', 'respRate']); 


    //open handler for the settings dialog
    const handleOpenSettings = () => {
        setOpenSettings(true);
    };

    //close handler for the settings dialog
    const handleCloseSettings = () => {
        setOpenSettings(false);
    };
    
    return (
        <AppBar 
            position="fixed"
            elevation={1}
            sx={{
                backgroundColor: 'white',
                color: 'magenta',
                borderBottom: '2px solid grey', 
            }}
            >
            <Container maxWidth="xl">
                <Toolbar 
                    disableGutters 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        }}
                >

                    {/*we will put the logo here when we find one*/}
                    <Typography
                        variant='h6'
                        noWrap
                        component={Link}
                        to='/'
                        sx={{
                            mr: 2,
                            fontFamily: 'monospace',
                            letterSpacing: '.2rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            flexShrink: 0,
                        }}>
                        BJCLMK Monitor
                    </Typography>
            

                    <Box sx={{ 
                        ml: 'auto', 
                        display: 'flex'
                        }}
                    >
                        {routes.map((route) => (
                            <Button
                                key={route.page}
                                component={Link}
                                to={route.path}
                                sx={{ my: 2, color: 'red', display: 'block' }}
                            >
                                {route.page}
                            </Button>
                        ))}

                        {/*settings menu*/}
                        <IconButton
                            onClick={handleOpenSettings}
                            sx={{ ml: 2, color: 'red' }}
                        >
                            <MenuIcon />
                        </IconButton>
                        
                        <Dialog
                            open={openSettings}
                            onClose={handleCloseSettings}
                            fullWidth
                            maxWidth='md'
                        >
                            <DialogTitle sx={{ fontWeight:'bold', color:'red' }}>
                                Settings
                            </DialogTitle>
                            <DialogContent sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                                mt: 2
                            }}>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant='h6' sx={{ mb:1 }}>Visibility</Typography>
                                    <Typography variant='body1' sx={{ mb:1 }}>Select vitals to display:</Typography>

                                    <ToggleButtonGroup
                                        value={selectedVitals}
                                        onChange={(event, newVitals) => setSelectedVitals(newVitals)}
                                        aria-label="vital visibility"
                                        size="small"
                                    >
                                        {vitalLabels.map((vital) => (
                                            <ToggleButton key={vital.value} value={vital.value} aria-label={vital.label}>
                                                {vital.label}
                                            </ToggleButton>
                                        ))}
                                    </ToggleButtonGroup>
                                </Box>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant='h6' sx={{ mb:1 }}>Size</Typography>
                                    <Typography variant='body1' sx={{ mb:1 }}>Adjust vital size here: (Add later)</Typography>
                                </Box>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant='h6' sx={{ mb:1 }}>Arrangement</Typography>
                                    <Typography variant='body1' sx={{ mb:1 }}>Rerrange the vitals on hte monitor view: (Add later)</Typography>
                                </Box>
                                <Button
                                    variant='contained'
                                    color="error"
                                    onClick={handleCloseSettings}
                                >
                                    Close
                                </Button>
                            </DialogContent>
                        </Dialog>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );

}

export default Navbar;