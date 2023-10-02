import {PREPARATION_IN_PROGRESS, READY_TO_SERVE, TABLE_AVAILABLE, TABLE_BLOCKED, TABLE_OPEN} from "./Constants";
import PropTypes from "prop-types";
import {displayUnknownModal, lockTableModal, openNewTable, unlockTableModal, preparationInProgressModal, orderReadyModal} from "./ModalDisplay";

export const handleClickOnTableItem = (table, onModalResponse, lock = false) => {
    if (table) {
        if(lock) {
            lockTableModal(table, onModalResponse);
            return;
        }
        switch (table.state) {
            case TABLE_OPEN:
                onModalResponse(table, "reopen");
                break;
            case TABLE_AVAILABLE:
                openNewTable(table, onModalResponse);
                break;
            case TABLE_BLOCKED:
                unlockTableModal(table, onModalResponse);
                break;
            case PREPARATION_IN_PROGRESS:
                preparationInProgressModal(table);
                break;
            case READY_TO_SERVE:
                orderReadyModal(table, onModalResponse);
                break;
            default:
                displayUnknownModal();
        }
    }
}

handleClickOnTableItem.propTypes = {
    table: PropTypes.any,
    onModalResponse: PropTypes.func
}

export default handleClickOnTableItem;