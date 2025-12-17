const orderService = require("../services/OrderService");
const MyError = require("../services/myError");

exports.createOrder = async (req, res) => {
    try {
        const { productId, quantity, clientId, addressId, workerId } = req.body;

        if (!productId || !quantity || !clientId || !addressId || !workerId) {
            throw new MyError("Missing required fields: productId, quantity, clientId, addressId, workerId", 400);
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
        if (error instanceof MyError) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

exports.getOrderDates = async (req, res) => {
    try {
        const dates = await orderService.getOrderDateLimits();
        res.json(dates);
    } catch (error) {
        if (error instanceof MyError) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getRevenueAnalytics = async (req, res) => {
    try {
        const stats = await orderService.getRevenueStats();
        res.json(stats);
    } catch (error) {
        if (error instanceof MyError) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
};