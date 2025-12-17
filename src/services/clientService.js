const MyError = require("../../middleware/myError");
const crud = require("../repositories/crud");
const analyticsRepo = require("../repositories/AnalyticsRepository");

exports.createClient = async (data) => {
    const client = await crud.create("client", data);
    if (!client) throw new MyError("Failed to create client", 500);
    return client;
};

exports.getClientOrderStats = async () => {
    const result = await analyticsRepo.getClientsAndTheirOrders();
    if (!result || result.length === 0) throw new MyError("Client order stats not found", 404);
    return result;
};

exports.getOrdersCountPerClient = async () => {
    const result = await analyticsRepo.countOrdersPerClient();
    if (!result || result.length === 0) throw new MyError("Orders per client analytics not found", 404);
    return result.map(row => ({
        clientName: row.client_name,
        lastName: row.last_name,
        ordersCount: parseInt(row.orders_count, 10)
    }));
};