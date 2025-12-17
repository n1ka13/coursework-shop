require('dotenv').config({ path: './.env.test' });
import { getProduct } from '../../services/productService.js';
import prisma from '../../prisma.js';

describe('Тестування отримання товару', () => {

    beforeAll(async () => {
        await prisma.product.deleteMany({});
        await prisma.category.deleteMany({});
    });

    test('Має повернути правильний товар за його ID', async () => {
        const category = await prisma.category.create({
            data: { category_name: 'Електроніка',
                category_name: 'Електроніка',
                description: 'Опис для тесту',
             }
        });

        const createdProduct = await prisma.product.create({
            data: {
                product_name: 'Смартфон',
                price: 500,
                category_id: category.category_id,
                quantity: 10,
                stock_status: 'in_stock',
                description: 'Сучасний смартфон з великим екраном'
            }
        });

        const result = await getProduct(createdProduct.product_id);

        expect(result).toBeDefined();

        expect(result.product_id).toBe(createdProduct.product_id);

        expect(result.product_name).toBe('Смартфон');

        expect(result.price).toBe(500);
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });
});