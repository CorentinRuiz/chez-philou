import {Paper, Stack, Typography} from "@mui/material";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";

export const ServedPage = () => {
    const navigate = useNavigate();

    const messageDisplayStyle = {
        width: '70%',
        paddingInline: '30px',
        paddingBlock: '60px',
    }

    const textInFrontStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1,
        width: '100%',
        height: '100%',
        textAlign: 'center'
    }

    return (
        <Stack style={textInFrontStyle} alignItems="center" justifyContent="center">
            <Paper elevation={0} style={messageDisplayStyle} id="paper-gradient-animation-served">
                <Stack spacing={5}>
                    <Typography variant="h2">Bon appétit !</Typography>
                    <Stack spacing={5} alignItems="center" justifyContent="center" direction="row">
                       <Button type="primary" shape="round" size="large" onClick={() => navigate('/menu', {state: {from: '/served'}})}>Afficher le menu</Button>
                       <Button type="default" shape="round" size="large">Afficher l'addition</Button>
                        {/*TODO permettre d'afficher l'addition*/}
                    </Stack>
                </Stack>
            </Paper>
        </Stack>
    )
}