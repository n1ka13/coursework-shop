const MyError = require("../../middleware/myError");
const prisma = require("../prisma/client");
const crud = require("../repositories/crud");
const analyticsRepo = require("../repositories/AnalyticsRepository");

exports.createOrderWithTransaction = async (productId, quantity, clientId, addressId, workerId) => {
    try {
        return await prisma.$transaction(async (tx) => {
            const product = await crud.getOne("product", { product_id: productId }, tx);
            
            if (!product) {
                throw new MyError("Product not found", 404);
            }

            if (product.quantity < quantity) {
                throw new MyError(`Insufficient stock for product ${product.product_name}. Available: ${product.quantity}`, 400);
            }

            const newQty = product.quantity - quantity;
            await crud.update("product", 
                { product_id: productId }, 
                { 
                    quantity: newQty,
                    stock_status: newQty > 0 ? 'in stock' : 'out of stock'
                }, 
                tx
            );

            const orderPrice = product.price * quantity;
            const newOrder = await crud.create("orders", {
                client_id: clientId,
                address_id: addressId,
                worker_id: workerId,
                order_price: orderPrice,
                status: 'processing',
                order_item: {
                    create: [{
                        product_id: productId,
                        quantity: quantity
                    }]
                }
            }, tx);

            await crud.create("payment", {
            order_id: newOrder.order_id,
            payment_method: 'online', 
            payment_status: 'not_paid',
            price: orderPrice
}, tx);

            return newOrder;
        });
    } catch (error) {
        if (error instanceof MyError) throw error;
        throw new MyError("Transaction failed: " + error.message, 500);
    }
};

exports.getOrderDateLimits = async () => {
    const result = await analyticsRepo.getFirstAndLastOrderDate();
    if (!result || result.length === 0) {
        throw new MyError("Order dates not found", 404);
    }
    return result[0];
};

exports.getRevenueStats = async () => {
    const result = await analyticsRepo.calculateRevenueByPaymentMethod();
    if (!result || result.length === 0) {
        throw new MyError("Revenue analytics not found", 404);
    }
    return result.map(row => ({
        method: row.payment_method,
        revenue: parseFloat(row.revenue).toFixed(2)
    }));
};