import { AppBar, Button, Toolbar, Typography } from "@mui/material";

const HomeBar = () => (
    <header>
    <AppBar position="relative">
        <Toolbar>
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            cineMOOD
        </Typography>
        <Button
            variant="text"
            sx={{ color: "white" }}
            onClick={handleLogOutClick}
        >
            Log out
        </Button>
        </Toolbar>
    </AppBar>
    </header>
)

export default HomeBar;