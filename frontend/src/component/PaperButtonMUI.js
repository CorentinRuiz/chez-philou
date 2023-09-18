import PaperItemMUI from "./takeOrder/PaperItemMUI";
import PropTypes from "prop-types";

const PaperButtonMUI = (props) => {
    const {color, title, description} = props;

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