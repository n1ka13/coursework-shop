require('dotenv').config({ path: './.env.test' });
import { createOrderWithTransaction, InsufficientStockError } from '../../services/OrderService.js';
import prisma from '../../prisma.js';

async function cleanDatabase() {
    await prisma.payment.deleteMany({});
    await prisma.order_item.deleteMany({});
    await prisma.orders.deleteMany({});
    await prisma.address.deleteMany({});
    await prisma.client.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.worker.deleteMany({});
}

async function setupTestData() {
    await cleanDatabase(); 
    
    const cat = await prisma.category.create({ data: { category_name: 'Tech', description: 'Tech goods' } });

    const product1 = await prisma.product.create({ 
        data: { 
            product_name: 'Laptop X', 
            price: 1000, 
            quantity: 10,
            description: 'Powerful laptop', 
            stock_status: 'in_stock', 
            category_id: cat.category_id,
        },
    });
    const product2 = await prisma.product.create({ 
        data: { 
            product_name: 'Mouse Y', 
            price: 50, 
            quantity: 5,
            description: 'Wireless mouse', 
            stock_status: 'in_stock', 
            category_id: cat.category_id,
        },
    });

    const client = await prisma.client.create({ data: { client_name: 'Test', last_name: 'User', email: 'test@example.com' } });
    const address = await prisma.address.create({ data: { country: 'UA', city: 'Kyiv', street: 'Test St', postal_code: '01001', client_id: client.client_id } });
    const worker = await prisma.worker.create({ data: { worker_role: 'operator', first_name: 'Oper', last_name: 'A', phone_number: '+380123456789' } });
    
    return { product1, product2, client, address, worker };
}

let testData;

beforeEach(async () => {
    testData = await setupTestData();
});

afterAll(async () => {
    await cleanDatabase();
    await prisma.$disconnect();
});

describe('Сценарій 1: Комплексне створення замовлення', () => {
    
    test('1. Успішне створення: замовлення, товарні позиції, оновлення запасів та оплата', async () => {
        
        const initialStock1 = testData.product1.quantity;
        const initialStock2 = testData.product2.quantity;

        const orderDetails = {
            clientId: testData.client.client_id,
            addressId: testData.address.address_id,
            workerId: testData.worker.worker_id,
            discount: 10,
            items: [
                { productId: testData.product1.product_id, quantity: 3 },
                { productId: testData.product2.product_id, quantity: 1 } 
            ],
        };
        const expectedTotal = Math.round(3050 * 0.9);

        const order = await createOrderWithTransaction(orderDetails);

        expect(order).toBeDefined();
        expect(order.order_price).toBe(expectedTotal);
        expect(order.status).toBe('confirmed');
        expect(order.order_item).toHaveLength(2); 
        expect(order.payment).toHaveLength(1); 

        const updatedProduct1 = await prisma.product.findUnique({ where: { product_id: testData.product1.product_id } });
        const updatedProduct2 = await prisma.product.findUnique({ where: { product_id: testData.product2.product_id } });

        expect(updatedProduct1.quantity).toBe(initialStock1 - 3);
        expect(updatedProduct2.quantity).toBe(initialStock2 - 1);
        
        expect(updatedProduct1.deletedAt).toBeNull(); 
    });

    test('2. Сценарій збою: ROLLBACK при недостатньому запасі (InsufficientStockError)', async () => {
        
        const initialOrderCount = await prisma.orders.count();
        const initialStock1 = testData.product1.quantity;

        const orderDetails = {
            clientId: testData.client.client_id,
            addressId: testData.address.address_id,
            workerId: testData.worker.worker_id,
            items: [
                { productId: testData.product1.product_id, quantity: 11 } 
            ],
        };

        await expect(createOrderWithTransaction(orderDetails)).rejects.toThrow(InsufficientStockError);
        const finalOrderCount = await prisma.orders.count();
        expect(finalOrderCount).toBe(initialOrderCount); 

        const finalProduct1 = await prisma.product.findUnique({ where: { product_id: testData.product1.product_id } });
        expect(finalProduct1.quantity).toBe(initialStock1);
    });

});