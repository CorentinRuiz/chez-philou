import {AppBar, Toolbar, Typography} from "@mui/material";

export const TopAppBar = () => {
    return (
        <AppBar color="default">
            <Toolbar>
                <Typography variant="h4" textAlign="center" component="div" sx={{ flexGrow: 1 }}>
                    Table n°1
                </Typography>
            </Toolbar>
        </AppBar>
    );
}