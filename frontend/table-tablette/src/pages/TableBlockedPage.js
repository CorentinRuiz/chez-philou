import {Paper, Stack, Typography} from "@mui/material";

export const TableBlockedPage = () => {
    const centerElement = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        textAlign: 'center',
        backgroundColor: "#484848",
        color: "#ffffff"
    }

    return (
        <Paper elevation={5}>
            <Stack direction="column" alignItems="center" justifyContent="center" style={centerElement} spacing={4}>
                <Typography variant="h3">
                    Table <b>bloquée</b>
                </Typography>
                <Typography variant="h5">
                    Veuillez vous rediriger vers une autre table
                </Typography>
            </Stack>
        </Paper>
    )
}