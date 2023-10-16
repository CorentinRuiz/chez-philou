import {getTextOfState, getColorOfState} from "./TableButtonState";
import PaperButtonMUI from "../templates/PaperButtonMUI";
import PropTypes from "prop-types";

const TableButton = (props) => {
    const {tableNumber, state, onClick} = props;

    const borderRadius = {
        bl: "15px",
        br: "15px",
        tl: "15px",
        tr: "15px"
    }

    return <PaperButtonMUI borderRadius={borderRadius} onClick={onClick} color={getColorOfState(state)} title={`Table ${tableNumber}`} description={getTextOfState(state)}/>
}

TableButton.propTypes = {
    tableNumber: PropTypes.number,
    state: PropTypes.number,
    onClick: PropTypes.func
}

export default TableButton;