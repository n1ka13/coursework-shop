const orderService = require("../services/OrderService");

exports.createOrder = async (req, res, next) => {
    try {
        const { productId, quantity, clientId, addressId, workerId } = req.body;

        if (!productId || !quantity || !clientId || !addressId || !workerId) {
            const MyError = require("../middleware/myError"); // Імпорт для створення помилки
            throw new MyError("Missing required fields", 400);
        }

        const newOrder = await orderService.createOrderWithTransaction(
            Number(productId),
            Number(quantity),
            Number(clientId),
            Number(addressId),
            Number(workerId)
        );

        res.status(201).json({
            message: "Order created successfully",
            data: newOrder
        });
    } catch (error) {
        next(error);
    }
};

exports.getOrderDates = async (req, res, next) => {
    try {
        const dates = await orderService.getOrderDateLimits();
        res.json(dates);
    } catch (error) {
        next(error);
    }
};

exports.getRevenueAnalytics = async (req, res, next) => {
    try {
        const stats = await orderService.getRevenueStats();
        res.json(stats);
    } catch (error) {
        next(error);
    }
};

exports.getRevenueDynamics = async (req, res, next) => {
    try {
        const dynamics = await orderService.getRevenueDynamics();
        res.status(200).json(dynamics);
    } catch (error) {
        next(error);
    }
};