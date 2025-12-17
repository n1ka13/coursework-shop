const MyError = require("./myError");
const crud = require("../repositories/crud");
const analyticsRepo = require("../repositories/AnalyticsRepository");

exports.getAllWorkers = async () => {
    const workers = await crud.getAll("worker");
    if (!workers) throw new MyError("Workers not found", 404);
    return workers;
};

exports.getWorkersCountByRole = async () => {
    const result = await analyticsRepo.countWorkersByRole();
    if (!result || result.length === 0) throw new MyError("Worker analytics not found", 404);
    return result.map(row => ({
        role: row.worker_role,
        totalWorkers: parseInt(row.total_workers, 10)
    }));
};

exports.getWorkerClientPairs = async () => {
    const result = await analyticsRepo.getWorkerClientCrossJoin();
    if (!result || result.length === 0) throw new MyError("No worker-client pairs found", 404);
    return result;
};