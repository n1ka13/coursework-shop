const MyError = require("../../middleware/myError");
const prisma = require("../prisma");
const crud = require("../repositories/crud");
const analyticsRepo = require("../repositories/analytics");

exports.createOrderWithTransaction = async ({ product_id, quantity, client_id, address_id, worker_id, discount = 0 }) => {
    try {
        return await prisma.$transaction(async (tx) => {
            const product = await crud.getOne("product", { product_id: product_id }, tx);
            
            if (!product) {
                throw new MyError(`Товар з ID ${product_id} не знайдено`, 404);
            }

            if (product.quantity < quantity) {
                throw new MyError(`Недостатньо товару ${product.product_name}. В наявності: ${product.quantity}`, 400);
            }

            const new_qty = product.quantity - quantity;
            await crud.update("product", 
                { product_id: product_id }, 
                { 
                    quantity: new_qty,
                    stock_status: new_qty > 0 ? 'in_stock' : 'out_of_stock'
                }, 
                tx
            );

            const base_price = product.price * quantity;
            const order_price = discount > 0 ? Math.round(base_price * (1 - discount / 100)) : base_price;

            const new_order = await crud.create("orders", {
                client_id: client_id,
                address_id: address_id,
                worker_id: worker_id,
                order_price: order_price,
                status: 'confirmed',
                discount: discount,
                order_item: {
                    create: [{
                        product_id: product_id,
                        quantity: quantity
                    }]
                }
            }, tx);

            await crud.create("payment", {
                order_id: new_order.order_id,
                payment_method: 'online', 
                payment_status: 'paid',
                price: order_price
            }, tx);

            return new_order;
        });
    } catch (error) {
        if (error instanceof MyError) throw error;
        throw new MyError("Помилка транзакції: " + error.message, 500);
    }
};

exports.getOrderDateLimits = async () => {
    const result = await analyticsRepo.getFirstAndLastOrderDate();
    if (!result || result.length === 0) {
        throw new MyError("Дати замовлень не знайдені", 404);
    }
    return result[0];
};

exports.getRevenueStats = async () => {
    const result = await analyticsRepo.calculateRevenueByPaymentMethod();
    if (!result || result.length === 0) {
        throw new MyError("Аналітика виручки порожня", 404);
    }
    return result.map(row => ({
        method: row.payment_method,
        revenue: parseFloat(row.revenue).toFixed(2)
    }));
};