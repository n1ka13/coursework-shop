import prisma from '../prisma.js';
import { Prisma } from '@prisma/client'; 

export const countWorkersByRole = async () =>
    await prisma.$queryRaw(Prisma.sql`
        SELECT 
            worker_role,
            COUNT(*) as total_workers
        FROM worker
        GROUP BY 
            worker_role;
    `);

export const calculateRevenueByPaymentMethod = async () =>
    await prisma.$queryRaw(Prisma.sql`
        SELECT 
            payment_method, 
            SUM(price) as revenue
        FROM payment
        GROUP BY 
            payment_method;
    `);

export const countProductsByCategory = async () =>
    await prisma.$queryRaw(Prisma.sql`
        SELECT 
            c.category_name, 
            COUNT(p.product_id) AS total_products
        FROM category c
        JOIN product p ON c.category_id = p.category_id
        GROUP BY 
            c.category_name
        HAVING 
            COUNT(p.product_id) > 0;
    `);

export const getNeverOrderedProducts = async () =>
    await prisma.$queryRaw(Prisma.sql`
        SELECT 
            p.product_name, 
            p.price
        FROM product p
        LEFT JOIN order_item oi ON p.product_id = oi.product_id
        WHERE 
            oi.order_item_id IS NULL;
    `);

export const getAveragePriceByCategory = async () =>
    await prisma.$queryRaw(Prisma.sql`
        SELECT 
            c.category_name, 
            AVG(p.price) AS average_price
        FROM product p 
        JOIN category c ON p.category_id = c.category_id
        GROUP BY 
            c.category_name;
    `);

export const getFirstAndLastOrderDate = async () =>
    await prisma.$queryRaw(Prisma.sql`
        SELECT
            MIN(order_date) AS first_order_date,
            MAX(order_date) AS last_order_date
        FROM orders;
    `);

export const getClientsAndTheirOrders = async () =>
    await prisma.$queryRaw(Prisma.sql`
        SELECT 
            c.client_name,
            c.last_name, 
            o.order_id, 
            o.status
        FROM client c
        LEFT JOIN orders o ON c.client_id = o.client_id;
    `);

export const getProductsAboveAveragePrice = async () =>
    await prisma.$queryRaw(Prisma.sql`
        SELECT 
            product_name, 
            price
        FROM product 
        WHERE 
            price > (SELECT AVG(price) FROM product);
    `);

export const countOrdersPerClient = async () =>
    await prisma.$queryRaw(Prisma.sql`
        SELECT 
            client_name, 
            last_name, 
            (SELECT COUNT(*) FROM orders WHERE orders.client_id = client.client_id) AS orders_count
        FROM client;
    `);

export const getProductsFromElectronics = async () =>
    await prisma.$queryRaw(Prisma.sql`
        SELECT 
            product_name
        FROM product
        WHERE 
            category_id IN (SELECT category_id FROM category WHERE category_name = 'Electronics');
    `);

export const getWorkerClientCrossJoin = async () =>
    await prisma.$queryRaw(Prisma.sql`
        SELECT 
            w.last_name AS worker_name, 
            c.client_name
        FROM worker w
        CROSS JOIN client c;
    `);