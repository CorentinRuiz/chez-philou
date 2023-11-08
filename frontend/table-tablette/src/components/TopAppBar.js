import {AppBar, Toolbar, Typography} from "@mui/material";

export const TopAppBar = ({tableNumber}) => {
    return (
        <AppBar color="default" elevation={0} style={{background: "#f7f7f7", borderBottom: 'solid 0.1px rgba(0, 0, 0, 0.5)'}}>
            <Toolbar>
                <Typography variant="h4" textAlign="center" component="div" sx={{ flexGrow: 1 }}>
                    Table n°{tableNumber}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}