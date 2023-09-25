import PropTypes from "prop-types";
import {Paper, styled} from "@mui/material";

const PaperButtonMUI = (props) => {
    const {color, title, description, onClick, borderRadius,elevation} = props;

    const PaperItemMUI = styled(Paper)(({theme, backgroundcolor, borderradius}) => ({
        ...theme.typography.body2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        padding: '1px',
        background: backgroundcolor,
        borderBottomLeftRadius: borderradius.bl,
        borderBottomRightRadius: borderradius.br,
        borderTopLeftRadius: borderradius.tl,
        borderTopRightRadius: borderradius.tr,
    }));

    return <PaperItemMUI elevation={elevation} borderradius={borderRadius} backgroundcolor={color} onClick={ e=> onClick(e)}>
        <div>
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
    </PaperItemMUI>
}

PaperButtonMUI.propTypes = {
    color: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    onClick: PropTypes.func,
    borderRadius: PropTypes.any,
}

export default PaperButtonMUI;