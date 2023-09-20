import PropTypes from "prop-types";
import {Paper, styled} from "@mui/material";

const PaperButtonMUI = (props) => {
    const {color, title, description} = props;

    const PaperItemMUI = styled(Paper)(({ theme, backgroundColor }) => ({
        ...theme.typography.body2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        padding: '1px',
        background: backgroundColor
    }));

    return <PaperItemMUI backgroundColor={color}>
        <div>
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
    </PaperItemMUI>
}

PaperButtonMUI.propTypes = {
    color: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string
}

export default PaperButtonMUI;