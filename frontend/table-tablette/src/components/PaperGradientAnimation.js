import {Paper, Stack, Typography} from "@mui/material";
import "../styles/paperGradientAnimation.css"
import {PREPARATION_IN_PROGRESS, READY_TO_SERVE} from "./TableStateConstants";
import {useEffect, useState} from "react";
import {getMeanCookingTimeOfSeveralItems} from "../api/kitchenInterface";
import {getPastOrders} from "../api/orders";

export const PaperGradientAnimation = ({tableInfos}) => {
    const [timeRemaining, setTimeRemaining] = useState(-1);

    const state = tableInfos?.state ?? 0;

    const setWaitingTimeOfAllBasket = async () => {
        if (tableInfos === null) {
            setTimeRemaining(-1);
            return;
        }

        const pastOrders = (await getPastOrders(tableInfos.tableOrderInfos._id)).data;
        getMeanCookingTimeOfSeveralItems(pastOrders[pastOrders.length - 1].preparedItems).then((res) => {
            let cookingTime = res.data.cookingTime;
            setTimeRemaining(cookingTime);
            const interval = setInterval(() => {
                setTimeRemaining(--cookingTime);
                if (cookingTime < 0) clearInterval(interval);
            }, 1000)
        });
    };

    useEffect(() => {
        setWaitingTimeOfAllBasket();
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
            if (timeRemaining > 0) return `Temps restant : ~${timeRemaining} seconde${timeRemaining > 1 ? 's' : ''}`;
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