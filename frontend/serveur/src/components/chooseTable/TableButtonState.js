const allStates = {
    0: {
        text: 'Table available',
        color: '#EAF1F8'
    },
    1: {
        text: 'Table open',
        color: '#d5f0ff'
    },
    2: {
        text: 'In preparation...',
        color: '#FADEB8'
    },
    3: {
        text: 'Ready to serve',
        color: '#D3FFD1'
    },
    4: {
        text: 'Blocked',
        color: '#737373'
    },
    5: {
        text: 'Table delivered',
        color: '#a9d0ea'
    },
    6: {
        text: 'Table linked to ',
        color: '#d5bbe5'
    }
}

export const getTextOfState = (state, linkedTable) => {
    if (allStates[state] === undefined)
        return 'Unknown';
    return allStates[state].text + (linkedTable ?? '');
}

export const getColorOfState = (state) => {
    if (allStates[state] === undefined)
        return '#FFFFFF';
    return allStates[state].color;
}