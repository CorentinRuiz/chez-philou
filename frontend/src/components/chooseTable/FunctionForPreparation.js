export const getPreparationNotTakenForService = (tablePreparations) => {
    return tablePreparations.filter(preparation => preparation.takenForServiceAt == null);
}

export const getPreparationStatus = (table) => {
    const preparation = getPreparationNotTakenForService(table.tableOrderInfos.preparations)[0];
    if (isPreparationCompleted(table)) return getOnlyTimeFromDate(new Date(preparation.completedAt));
    else return `~ ${getOnlyTimeFromDate(new Date(preparation.shouldBeReadyAt))}`;
}


export const isPreparationCompleted = (table) => {
    const preparation = getPreparationNotTakenForService(table.tableOrderInfos.preparations)[0];
    const completedAt = preparation.completedAt;
    return completedAt !== null;
}

export const getOnlyTimeFromDate = (date) => {
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'});
}