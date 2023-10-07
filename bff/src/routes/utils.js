const logger = require('../logger')

const handleError = (error, res) => {
    if (error.response) {
        logger.error('Error from backend:', error.response.data);
        res.status(500).send(error.response.data);
    } else {
        logger.error('Unexpected error:', error.message);
        res.status(500).send("Unexpected error in bff.");
    }
}

module.exports = {
    handleError
}
