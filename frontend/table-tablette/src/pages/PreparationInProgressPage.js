import PreparationCommandVideo from '../ressources/videos/preparation_commande.mp4';
import WaiterComingGif from '../ressources/videos/waiter-coming.gif';
import {Stack} from "@mui/material";
import {PaperGradientAnimation} from "../components/PaperGradientAnimation";
import {PREPARATION_IN_PROGRESS, READY_TO_SERVE} from "../components/TableStateConstants";

export const PreparationInProgressPage = ({tableInfos}) => {
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

    const DisplayCorrectAnimation = () => {
        if(tableInfos === null) return;
        else if (tableInfos.state === PREPARATION_IN_PROGRESS) return (
            <video autoPlay loop muted id='video' style={{opacity: '0.7', width: '100%', height: '100%'}}>
                <source src={PreparationCommandVideo} type='video/mp4'/>
            </video>
        )
        else if (tableInfos.state === READY_TO_SERVE) return (
            <img src={WaiterComingGif} alt="Waiter coming" style={{opacity: '0.7', width: '100%', height: '100%'}}/>
        )
    }

    return (
        <div>
            <div style={backgroundVideoStyle}>
                <DisplayCorrectAnimation/>
            </div>

            <Stack style={textInFrontOfVideoStyle} alignItems="center" justifyContent="center">
                <PaperGradientAnimation tableInfos={tableInfos}/>
            </Stack>
        </div>
    );
}