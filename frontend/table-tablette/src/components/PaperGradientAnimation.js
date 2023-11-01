import {Paper, Stack, Typography} from "@mui/material";
import "../styles/paperGradientAnimation.css"
import {PREPARATION_IN_PROGRESS, READY_TO_SERVE} from "./TableStateConstants";

export const PaperGradientAnimation = ({tableInfos}) => {
    const state = tableInfos?.state ?? 0;
    const timeRemainingInMinutes = 10;
    // TODO afficher le bon temps restant

    const messageDisplayStyle = {
        width: '70%',
        paddingInline: '30px',
        paddingBlock: '60px',
    }

    const getIdName = () => {
        if(state === PREPARATION_IN_PROGRESS) return "paper-gradient-animation-inprogress";
        else if (state === READY_TO_SERVE) return "paper-gradient-animation-ready";
    }

    const getSubtitle = () => {
        if(state === PREPARATION_IN_PROGRESS) {
            if(timeRemainingInMinutes > 0) return `Temps restant : ${timeRemainingInMinutes} min`;
            else return 'La commande sera prête sous peu...'
        }
        if(state === READY_TO_SERVE) return "Le serveur est en route"
        else return "Veuillez vous rapprocher d'un serveur";
    }

    const getTitle = () => {
        if(state === PREPARATION_IN_PROGRESS) return "En cours de préparation..."
        else if (state === READY_TO_SERVE) return "Commande prête !"
        else return 'État de la commande inconnu...'
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