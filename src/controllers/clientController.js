const clientService = require("../services/clientService");

exports.getClientStats = async (req, res, next) => {
    try {
        const stats = await clientService.getClientOrderStats();
        res.json(stats);
    } catch (error) {
        next(error);
    }
};

exports.getOrdersCount = async (req, res, next) => {
    try {
        const counts = await clientService.getOrdersCountPerClient();
        res.json(counts);
    } catch (error) {
        next(error);
    }
};