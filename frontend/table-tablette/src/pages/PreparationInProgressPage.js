import PreparationCommandVideo from '../ressources/preparation_commande.mp4';
import WaiterComingGif from '../ressources/waiter-coming.gif';
import {Stack} from "@mui/material";
import {PaperGradientAnimation} from "../components/PaperGradientAnimation";
import {useEffect} from "react";

export const PreparationInProgressPage = ({tableInfos}) => {
    const timeRemaining = 10;

    const backgroundVideoStyle = {
        position: 'fixed',
        zIndex: 0
    }

    const textInFrontOfVideoStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1,
        width: '100%',
        height: '100%',
        textAlign: 'center'
    }

    useEffect(() => {
        console.log(tableInfos);
    }, [tableInfos])

    const DisplayCorrectAnimation = () => {
        if (timeRemaining > 0) return (
            <video autoPlay loop muted id='video' style={{opacity: '0.7', width: '100%', height: '100%'}}>
                <source src={PreparationCommandVideo} type='video/mp4'/>
            </video>
        )
        else return (
            <img src={WaiterComingGif} alt="Waiter coming" style={{opacity: '0.7', width: '100%', height: '100%'}}/>
        )
    }

    return (
        <div>
            <div style={backgroundVideoStyle}>
                <DisplayCorrectAnimation/>
            </div>

            <Stack style={textInFrontOfVideoStyle} alignItems="center" justifyContent="center">
                <PaperGradientAnimation timeRemainingInMinutes={timeRemaining}/>
            </Stack>
        </div>
    );
}