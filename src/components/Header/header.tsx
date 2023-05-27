import React, { useState, MouseEvent, useEffect } from "react";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Avatar, Button, Tooltip, MenuItem, Link, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../../images/logo.png';
import { supabase } from '../Login.js';

const pages = [
    { label: 'Popular', path: '/movies/popular' },
    { label: 'Top Rated', path: '/movies/top_rated' },
    { label: 'Upcoming', path: '/movies/upcoming' },
];

const settings = ['Profile', 'Logout'];

function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [loading, setLoading] = useState(true); // Loading state

    const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogOutClick = () => {
        supabase.auth.signOut();
    };

    useEffect(() => {
        setLoading(false); // Set loading to false after the component has mounted
    }, []);

    if (loading) {
        return (
            <AppBar 
                position="fixed" // Fixed position to keep it at the top
                sx={{ bgcolor: '#C06C84', height: '60px' }}
            >
                <Toolbar disableGutters />
            </AppBar>
        );
    }

    return (
        <AppBar 
            position="sticky" 
            sx={{ bgcolor: '#C06C84', height: '60px' }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Link href="/">
                        <Box
                            component="img"
                            sx={{ height: 50 }}
                            alt="Logo"
                            src={logo}
                        />
                    </Link>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                                    <Link href={page.path} color="inherit" underline="none">
                                        <Typography textAlign="center">{page.label}</Typography>
                                    </Link>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.label}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                <Link href={page.path} color="inherit" underline="none">
                                    {page.label}
                                </Link>
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={setting === 'Logout' ? handleLogOutClick : handleCloseUserMenu}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;
