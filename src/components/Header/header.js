import React, { useState, useContext, useEffect, useRef } from "react";
import { SearchContext } from "../../context/SearchContext";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../images/logo.png";
import { getSupabaseInstance } from "../../supabase.js";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./header.css"
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from "../../context/AuthProvider.jsx";
import Notifications from "./notifications";
import { ProfileImageContext } from "../../context/ProfileImageProvider";

const pages = [
  { label: "Popular", path: "/movies/popular" },
  { label: "Top Rated", path: "/movies/top_rated" },
  { label: "Upcoming", path: "/movies/upcoming" },
];

function ResponsiveAppBar() {
  const { setSearchText } = useContext(SearchContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [localSearchText, setLocalSearchText] = useState(""); // Add a local state for the input
  const auth = useAuth();
  const [display, setDisplay] = useState(null);
  const { profileImageUrl, setProfileImageUrl } = useContext(ProfileImageContext);

  const settings = [
    {label: "Profile", path: `/profile/${auth.user.id}`},
    {label: "Friends", path: "/friends"},
    {label: "Logout", path: "/login"},
];

  // Clear search bar when navigating to another page

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const prevPath = useRef(location.pathname); // Store previous path

  useEffect(() => {
    if (prevPath.current === "/search" && location.pathname !== "/search") {
      setLocalSearchText("");
    }
    prevPath.current = location.pathname;
  }, [location.pathname]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  useEffect(() => {
    fetchProfilePicture();
  }, [profileImageUrl]);

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogOutClick = async () => {
    await getSupabaseInstance().auth.signOut();
    navigate("/login"); // Redirect to the login page
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchText(e.target.elements.search.value); // assuming the input name is 'search'
    navigate("/search");
  };

  const fetchProfilePicture = async () => {
    const { data, error } = await getSupabaseInstance()
        .from('user')
        .select('avatar_url')
        .eq('id', auth.user.id)
        .single();
    if (error) {
        console.error('Error fetching profile picture:', error);
        return null;
    }
    const pictureUrl = data.avatar_url;
    setProfileImageUrl(pictureUrl);
    setDisplay(pictureUrl);
};

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#EBCBC1" }}>
      <Toolbar>
        <Container maxWidth="xl">
          <Box display="flex" alignItems="center">
            <Link to="/home" style={{ textDecoration: "none", marginTop: "-5px" }}>
              <Box component="img" sx={{ height: 50 }} alt="Home" src={logo} />
            </Link>
            <Box flexGrow={1} display="flex" justifyContent="left">
              <Box display={{ xs: "flex", md: "none" }}>
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
              <Box display={{ xs: "none", md: "flex" }}>
                {pages.map((page) => (
                  <Button
                    key={page.label}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "black", display: "block" }}
                  >
                    <Link
                      to={page.path}
                      style={{ textDecoration: "none", color: "black", textTransform: "none", fontSize: "1rem", fontFamily: "'Be Vietnam Pro', sans-serif"}}
                    >
                      {page.label}
                    </Link>
                  </Button>
                ))}
              </Box>
              <form
                onSubmit={handleSearch}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "10px",
                }}
              >
                <input
                  className="search"
                  type="text"
                  placeholder="search movie name..."
                  name="search"
                  value={localSearchText}
                  onChange={(e) => setLocalSearchText(e.target.value)}
                  style={{ transition: "width 0.3s" }}
                />
                <IconButton
                className="search-button"
                role="search-button"
                type="submit"
                style={{ width: "40px", height: "40px" }}>
                    <SearchIcon />
                </IconButton>
              </form>
            </Box>
            <Box style={{ marginLeft: "7px" }}>
              <Notifications />
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0}}>
                    {display ? <img
                    src={
                    display 
                    }
                    alt=""
                    width="50"
                    height="50"
                    className="img-preview"
                /> : <Avatar sx={{ width: 50, height: 50 }} />}
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
          vertical: "bottom",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        sx={{
          display: { xs: "block", md: "none" },
        }}
      >
        {pages.map((page) => (
          <MenuItem key={page.label} onClick={handleCloseNavMenu}>
            <Link
              to={page.path}
              style={{ textDecoration: "none", color: "black" }}
            >
              <Typography textAlign="center">{page.label}</Typography>
            </Link>
          </MenuItem>
        ))}
      </Menu>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem
            key={setting.label}
            onClick={
              setting.label === "Logout" ? handleLogOutClick : handleCloseUserMenu
            }
          >
            <Link
              to={setting.path}
              style={{ textDecoration: "none", color: "black" }}
            >
              <Typography textAlign="center">{setting.label}</Typography>
            </Link> 
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
}

export default ResponsiveAppBar;
