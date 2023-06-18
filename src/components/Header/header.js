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
import { supabase } from "../../supabase.js";
import { Link, useNavigate, useLocation } from "react-router-dom";

const pages = [
  { label: "Popular", path: "/movies/popular" },
  { label: "Top Rated", path: "/movies/top_rated" },
  { label: "Upcoming", path: "/movies/upcoming" },
];

const settings = ["Profile", "Logout"];

function ResponsiveAppBar() {
  const { setSearchText } = useContext(SearchContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [localSearchText, setLocalSearchText] = useState(""); // Add a local state for the input

  // Clear search bar when navigating to another page

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const prevPath = useRef(location.pathname); // Store previous path

  useEffect(() => {
    if (prevPath.current === "/search" && location.pathname !== "/search") {
      setLocalSearchText('');
    }
    prevPath.current = location.pathname;
  }, [location.pathname]);

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

  const handleLogOutClick = async () => {
    await supabase.auth.signOut();
    navigate("/"); // Redirect to the login page
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchText(e.target.elements.search.value); // assuming the input name is 'search'
    navigate("/search");
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#EBCBC1" }}>
      <Toolbar>
        <Container maxWidth="xl">
          <Box display="flex" alignItems="center">
            <Link to="/home" style={{ textDecoration: "none" }}>
              <Box component="img" sx={{ height: 50 }} alt="Logo" src={logo} />
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
                      style={{ textDecoration: "none", color: "black" }}
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
                  type="text"
                  placeholder="search movie name..."
                  name="search"
                  value={localSearchText}
                  onChange={(e) => setLocalSearchText(e.target.value)}
                  style={{ width: "200px", height: "30px" }}
                />
                <button
                  className="search-button"
                  type="submit" // make the button of type submit to trigger the form onSubmit event
                  style={{ width: "50px", height: "40px" }}
                >
                  &#128269;
                </button>
              </form>
            </Box>
            <Box style={{ marginLeft: "7px" }}>
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
            key={setting}
            onClick={
              setting === "Logout" ? handleLogOutClick : handleCloseUserMenu
            }
          >
            <Typography textAlign="center">{setting}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
}

export default ResponsiveAppBar;
