import React, { useState } from "react";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Avatar, Button, Tooltip, MenuItem, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../../images/logo.png';
import { supabase } from '../../supabase.js';
import { Link, useNavigate } from "react-router-dom";

const pages = [
    { label: 'Popular', path: '/movies/popular' },
    { label: 'Top Rated', path: '/movies/top_rated' },
    { label: 'Upcoming', path: '/movies/upcoming' },
    { label: 'Search', path: '/search' },
];

const settings = ['Profile', 'Logout'];

function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const navigate = useNavigate();

    const handleLogOutClick = async () => {
      await supabase.auth.signOut();
      navigate("/"); // Redirect to the login page
    };

    return (
        <AppBar 
            position="sticky" 
            sx={{ bgcolor: '#EBCBC1' }}
        >
            <Toolbar>
                <Container maxWidth="xl">
                    <Box display="flex" alignItems="center">
                        <Link to="/movies/popular" style={{ textDecoration: 'none' }}>
                            <Box
                                component="img"
                                sx={{ height: 50 }}
                                alt="Logo"
                                src={logo}
                            />
                        </Link>
                        <Box flexGrow={1} display="flex" justifyContent="left">
                            <Box display={{ xs: 'flex', md: 'none' }}>
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
                            </Box>
                            <Box display={{ xs: 'none', md: 'flex' }}>
                                {pages.map((page) => (
                                    <Button
                                        key={page.label}
                                        onClick={handleCloseNavMenu}
                                        sx={{ my: 2, color: 'black', display: 'block' }}
                                    >
                                        <Link to={page.path} style={{ textDecoration: 'none', color: 'black' }}>
                                            {page.label}
                                        </Link>
                                    </Button>
                                ))}
                            </Box>
                        </Box>
                        <Box>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </Container>
            </Toolbar>
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
                        <Link to={page.path} style={{ textDecoration: 'none', color:'black' }}>
                            <Typography textAlign="center">{page.label}</Typography>
                        </Link>
                    </MenuItem>
                ))}
            </Menu>
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
        </AppBar>
    );
}

export default ResponsiveAppBar;
