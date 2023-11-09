import {AppBar, Toolbar, Typography} from "@mui/material";
import {LinkOutlined} from "@ant-design/icons";
import {Badge} from "antd";
import {useState} from "react";

export const TopAppBar = ({linkedTable, tableNumber}) => {
    const [clickCount, setClickCount] = useState(0);

    const handleClick = () => {
        setClickCount(prevCount => prevCount + 1);

        // Supprime le numéro de table stocké dans le localStorage pour pouvoir le modifier
        if (clickCount + 1 === 5) {
            localStorage.removeItem("tableNumber");
            window.location.reload();
        }
    }

    return (
        <AppBar color="default" elevation={0}
                style={{background: "#f7f7f7", borderBottom: 'solid 0.1px rgba(0, 0, 0, 0.5)'}}>
            <Toolbar>
                {linkedTable && (
                    <Typography variant="h6" component="div" sx={{flexGrow: 1, position: "fixed", left: 15, top: 15, color: "#c99ce1"}}>
                        <LinkOutlined/> - <Badge style={{backgroundColor: "#c99ce1"}} count={linkedTable}/>
                    </Typography>
                    )}
                <Typography variant="h4" textAlign="center" component="div" sx={{flexGrow: 1}} onClick={handleClick}>
                    Table n°{tableNumber}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}