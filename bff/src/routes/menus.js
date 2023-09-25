const express = require("express");
const router = express.Router();
const {getMenus} = require("../api/menus");

router.get("/:type", async (req, res) => {
    getMenus().then((response) => {
        if (Array.isArray(response.data)) {
            const transformedData = transformAndFilterData(response.data, req.params.type.toUpperCase());
            res.status(200).json(transformedData);
        } else {
            res.status(500).json({ error: 'The response from the backend is not in the expected format.' });
        }
    }).catch((reason) => {
        console.error('Error while sending a request to backend:', reason);
        res.status(502).json({ error: 'Error while sending a request to backend.' });
    });
});

module.exports = router;

function transformAndFilterData(data, category) {
    return data.filter(item => item.category === category)
        .map(item => ({
        "_id": item._id,
        "shortName": item.shortName,
        "price": item.price,
        "color": getColorForCategory(item.category)
    }));
}

function getColorForCategory(category) {
    switch (category) {
        case 'STARTER':
            return '#F9D9C9';
        case 'MAIN':
            return '#DDD6FC';
        case 'DESSERT':
            return '#D1E3F4';
        case 'BEVERAGE':
            return '#C5FBF0';
        default:
            return '#DDD6FC';
    }
}