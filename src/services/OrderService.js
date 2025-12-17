const MyError = require("../../middleware/myError");
const prisma = require("../prisma");
const crud = require("../repositories/crud");
const analyticsRepo = require("../repositories/analytics");

exports.createOrderWithTransaction = async ({
  clientId,
  addressId,
  workerId,
  discount = 0,
  items
}) => {
  try {
    return await prisma.$transaction(async (tx) => {

      let totalPrice = 0;

      for (const item of items) {
        const product = await crud.getOne(
          "product",
          { product_id: item.productId },
          tx
        );

        if (!product) {
          throw new MyError(`Товар з ID ${item.productId} не знайдено`, 404);
        }

        if (product.quantity < item.quantity) {
          throw new InsufficientStockError(
            `Недостатньо товару ${product.product_name}`
          );
        }

        await crud.update(
          "product",
          { product_id: item.productId },
          {
            quantity: product.quantity - item.quantity,
            stock_status:
              product.quantity - item.quantity > 0
                ? "in_stock"
                : "out_of_stock",
          },
          tx
        );

        totalPrice += product.price * item.quantity;
      }

      if (discount > 0) {
        totalPrice = Math.round(totalPrice * (1 - discount / 100));
      }

      const order = await crud.create(
  "orders",
  {
    client_id: clientId,
    address_id: addressId,
    worker_id: workerId,
    order_price: totalPrice,
    discount,
    status: "confirmed",
    order_item: {
      create: items.map(item => ({
        product_id: item.productId,
        quantity: item.quantity
      }))
    }
  },
  tx
);

await crud.create(
  "payment",
  {
    order_id: order.order_id,
    payment_method: "online",
    payment_status: "paid",
    price: totalPrice
  },
  tx
);

return await tx.orders.findUnique({
  where: { order_id: order.order_id },
  include: {
    order_item: true,
    payment: true
  }
});

    });
  } catch (error) {
    if (error instanceof InsufficientStockError) throw error;
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