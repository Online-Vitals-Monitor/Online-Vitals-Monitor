import * as React from 'react';
import { AppBar, Box, Toolbar, Typography, Menu, Container, Button, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';

//routes object: Add pages/routes here if needed
const routes = [
    {page: 'Monitor', path: '/'},
    {page: 'Control Vitals', path:'/values'},
];

//navbar based off of: https://mui.com/material-ui/react-app-bar/
const Navbar: React.FC = () => {
    const [anchorElNav] = React.useState<null | HTMLElement>(null);

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
                <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between'}}>

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
                    }}>
                    BJCLMK Monitor
                </Typography>
            
                <Box sx={{ ml: 'auto', display: { xs: 'none', md: 'flex', gap: 4} }}>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        open={Boolean(anchorElNav)}
                        sx={{ display: { xs: 'block', md: 'none' } }}
                    >
                    {routes.map((route) => (
                        <MenuItem key={route.page}>
                            <Typography
                                component={Link}
                                to={route.path}
                                sx={{ color: 'inherit', textDecoration: 'none' }}
                            >
                                {route.page}
                            </Typography>
                        </MenuItem>
                    ))}
                    </Menu>
                </Box>

                <Box sx={{ ml: 'auto', display: { xs: 'none', md: 'flex' }}}>
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
                </Box>

                </Toolbar>
            </Container>
        </AppBar>
    );

}

export default Navbar;