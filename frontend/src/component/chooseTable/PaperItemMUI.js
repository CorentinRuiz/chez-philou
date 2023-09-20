import {Paper, styled} from "@mui/material";
import PropTypes from "prop-types";

const PaperItemMUI = styled(Paper)(({ theme, backgroundColor }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    padding: '1px',
    background: backgroundColor
}));


PaperItemMUI.propTypes = {
    backgroundColor: PropTypes.string,
}

export default PaperItemMUI;