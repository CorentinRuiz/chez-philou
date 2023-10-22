import {Paper, Stack, Typography} from "@mui/material";
import "../styles/paperGradientAnimation.css"

export const PaperGradientAnimation = ({timeRemainingInMinutes}) => {
    const messageDisplayStyle = {
        width: '70%',
        paddingInline: '30px',
        paddingBlock: '60px',
    }

    const getIdName = () => {
        if(timeRemainingInMinutes > 0) return "paper-gradient-animation-inprogress";
        else return "paper-gradient-animation-ready";
    }

    const getSubtitle = () => {
        if(timeRemainingInMinutes > 0) return `Temps restant : ${timeRemainingInMinutes} min`;
        else return "Le serveur est en route"
    }

    const getTitle = () => {
        if(timeRemainingInMinutes > 0) return "En cours de préparation...";
        else return "Commande prête !";
    }

    return (
        <Paper elevation={0} style={messageDisplayStyle} id={getIdName()}>
            <Stack spacing={5}>
                <Typography variant="h2">{getTitle()}</Typography>
                <Typography variant="h4">{getSubtitle()}</Typography>
            </Stack>
        </Paper>
    );
}