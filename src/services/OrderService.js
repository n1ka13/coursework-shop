import prisma from '../prisma.js';

export class InsufficientStockError extends Error {
    constructor(productName, available, requested) {
        super(`Недостатньо запасу для товару ${productName}. Доступно: ${available}, Запитано: ${requested}`);
        this.name = 'InsufficientStockError';
        this.available = available;
        this.requested = requested;
    }
}
export async function createOrderWithTransaction(orderData) {
    const { clientId, addressId, workerId, items, discount = 0 } = orderData;
    
    return prisma.$transaction(async (tx) => {
        let totalOrderPrice = 0;
        
        for (const item of items) {
            const product = await tx.product.findUnique({
                where: { product_id: item.productId },
            });

            if (!product) {
                throw new Error(`Товар з ID ${item.productId} не знайдено.`);
            }
            if (product.quantity < item.quantity) {
                throw new InsufficientStockError(product.product_name, product.quantity, item.quantity);
            }
            
            totalOrderPrice += product.price * item.quantity;
        }

        const finalPrice = Math.round(totalOrderPrice * (1 - discount / 100));

        const newOrder = await tx.orders.create({
            data: {
                client_id: clientId,
                address_id: addressId,
                worker_id: workerId,
                order_price: finalPrice, 
                status: 'confirmed', 
                discount: discount,
            },
        });
        
        for (const item of items) {
            await tx.order_item.create({
                data: {
                    order_id: newOrder.order_id,
                    product_id: item.productId,
                    quantity: item.quantity,
                },
            });

            await tx.product.update({
                where: { product_id: item.productId },
                data: {
                    quantity: {
                        decrement: item.quantity,
                    },
                },
            });
        }
        
         await tx.payment.create({
             data: {
                 order_id: newOrder.order_id,
                 payment_method: 'online', 
                 payment_status: 'paid', 
                 price: finalPrice,
                 payment_date: new Date(),
             },
         });

        return tx.orders.findUnique({
            where: { order_id: newOrder.order_id },
            include: { 
                order_item: { include: { product: true }},
                payment: true,
                client: true
            },
        });
    }); 
}