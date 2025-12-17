const workerService = require("../services/workerService");

exports.getRoleStats = async (req, res, next) => {
    try {
        const stats = await workerService.getWorkersCountByRole();
        res.json(stats);
    } catch (error) {
        next(error);
    }
};

exports.getWorkerClientPairs = async (req, res, next) => {
    try {
        const pairs = await workerService.getWorkerClientPairs();
        res.json(pairs);
    } catch (error) {
        next(error);
    }
};