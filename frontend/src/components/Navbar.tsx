import * as React from 'react';
import { AppBar, Box, Toolbar, Typography, Dialog, DialogTitle, DialogContent, Container, Button, MenuItem, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

//routes object: Add pages/routes here if needed
const routes = [
    {page: 'Monitor', path: '/'},
    {page: 'Control Vitals', path:'/values'},
];

//navbar based off of: https://mui.com/material-ui/react-app-bar/
const Navbar: React.FC = () => {

    const [openSettings, setOpenSettings] = React.useState(false);
    const [anchorElNav] = React.useState<null | HTMLElement>(null);
    const [selectedVitals, setSelectedVitals] = React.useState<string[]>(['heartRate', 'bloodPressure']);


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
                color: 'red',
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
                                        <ToggleButton value="heartRate" aria-label="heart rate">Heart Rate</ToggleButton>
                                        <ToggleButton value="bloodPressure" aria-label="blood pressure">Blood Pressure</ToggleButton>
                                        <ToggleButton value="oxygenLevel" aria-label="oxygen level">Oxygen Level</ToggleButton>
                                        <ToggleButton value="temperature" aria-label="temperature">Temperature</ToggleButton>
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