import {Paper, Stack, Typography} from "@mui/material";
import "../styles/paperGradientAnimation.css"
import {PREPARATION_IN_PROGRESS, READY_TO_SERVE} from "./TableStateConstants";
import {useEffect, useState} from "react";

export const PaperGradientAnimation = ({tableInfos}) => {
    const [timeRemaining, setTimeRemaining] = useState(-1);

    const state = tableInfos?.state ?? 0;

    const setTimeRemainingInMinutesFromNow = () => {
        const preparations = tableInfos?.tableOrderInfos.preparations;
        if(preparations === undefined) return;

        const maxDate = preparations
            .filter(preparation => preparation.takenForServiceAt === null)
            .map(preparation => new Date(preparation.shouldBeReadyAt))
            .reduce((max, date) => Math.max(max, new Date(date)), -Infinity);

        let tmp = maxDate - new Date();

        tmp = Math.floor(tmp / 1000);
        let sec = tmp % 60;

        // tmp = Math.floor((tmp - sec) / 60);
        // const min = tmp % 60;
        setTimeRemaining(sec);
        const interval = setInterval(() => {
            setTimeRemaining(--sec);
            if(sec < 0) clearInterval(interval);
        }, 1000)
        return sec;
    }

    useEffect(() => {
        setTimeRemainingInMinutesFromNow();
    }, []);

    // setTimeRemainingInMinutesFromNow();

    const messageDisplayStyle = {
        width: '70%',
        paddingInline: '30px',
        paddingBlock: '60px',
    }

    const getIdName = () => {
        if (state === PREPARATION_IN_PROGRESS) return "paper-gradient-animation-inprogress";
        else if (state === READY_TO_SERVE) return "paper-gradient-animation-ready";
    }

    const getSubtitle = () => {
        if (state === PREPARATION_IN_PROGRESS) {
            if (timeRemaining > 0) return `Temps restant : ~${timeRemaining} sec`;
            else return 'La commande sera prête sous peu...'
        }
        if (state === READY_TO_SERVE) return "Le serveur est en route"
        else return "Veuillez vous rapprocher d'un serveur";
    }

    const getTitle = () => {
        if (state === PREPARATION_IN_PROGRESS) return "En cours de préparation..."
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