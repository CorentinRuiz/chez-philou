const axios = require("axios")

const axiosInstance = axios.create({
    baseURL: "http://localhost:9500"
});

module.exports = {
    axiosInstance
};
