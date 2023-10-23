import {Paper, Stack, Typography} from "@mui/material";

export const WelcomingPage = () => {
    const centerElement = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        textAlign: 'center'
    }

    return (
        <Paper elevation={5}>
            <Stack direction="column" alignItems="center" justifyContent="center" style={centerElement} spacing={4}>
                <Typography variant="h3">
                    Bienvenue dans le restaurant <strong>Chez Philou</strong> !
                </Typography>
                <Typography variant="h5">
                    Un serveur s'occupera de vous sous peu...
                </Typography>
            </Stack>
        </Paper>
    )
}