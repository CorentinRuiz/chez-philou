const express = require("express");
const router = express.Router();
const {getMenus} = require("../api/menus");

router.get("/:type", async (req, res) => {
    getMenus().then((response) => {
        if (Array.isArray(response.data)) {
            const transformedData = transformAndFilterData(response.data, req.params.type);
            res.status(200).json(transformedData);
        } else {
            res.status(500).json({ error: 'La réponse du backend n\'est pas au format attendu.' });
        }
    }).catch((reason) => {
        console.error('Erreur lors de la requête au backend:', reason);
        res.status(502).json({ error: 'Une erreur s\'est produite lors de la requête au backend.' });
    });
});

module.exports = router;

function transformAndFilterData(data, category) {
    return data.filter(item => item.category === category)
        .map(item => ({
        "_id": item._id,
        "fullName": item.fullName,
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