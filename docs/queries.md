# 1.Питання: яка динаміка щоденного доходу та як зростає накопичувальна виручка з часом?

ʼʼʼ
SELECT order_date, SUM(order_price) as daily_revenue,
       SUM(SUM(order_price)) OVER (ORDER BY order_date) as cumulative_revenue
FROM orders GROUP BY order_date ORDER BY order_date;
ʼʼʼ

GROUP BY order_date: Згруповує всі замовлення за конкретною датою, щоб ми могли обчислити daily_revenue (суму продажів за цей день).

SUM(order_price) as daily_revenue: Стандартна агрегатна функція, яка підраховує виручку для кожної групи (дня).

SUM(SUM(order_price)) OVER (ORDER BY order_date): Бере результат агрегації дня (SUM(order_price)) і додає його до накопичувальної суми всіх попередніх днів у порядку дати.

Бізнес-цінність: Дозволяє бачити не просто поточні продажі, а загальний темп зростання доходів компанії з часом.

# 2. Товари, які ніколи не замовлялися

ʼʼʼ
SELECT 
    p.product_name, 
    p.price
FROM product p
LEFT JOIN order_item oi ON p.product_id = oi.product_id
WHERE 
    oi.order_item_id IS NULL
    AND p."deletedAt" IS NULL;
ʼʼʼ

LEFT JOIN: Об'єднує таблицю продуктів (product) з позиціями замовлень (order_item) так, що навіть якщо продукту немає в жодному замовленні, він все одно залишиться в результаті (але поля з order_item будуть порожніми — NULL).

WHERE oi.order_item_id IS NULL: Ключовий фільтр, який залишає лише ті продукти, для яких не знайдено жодного збігу в таблиці замовлень.

AND p."deletedAt" IS NULL: Виключає з результату товари, які були видалені (Soft Delete).

Бізнес-цінність: Допомагає виявити товари-залишки, які займають місце на складі, але не приносять прибутку.

# 3. Преміальні товари

ʼʼʼ
SELECT 
    product_name, 
    price
FROM product 
WHERE 
    price > (SELECT AVG(price) FROM product);
ʼʼʼ

(SELECT AVG(price) FROM product): Вкладений підзапит, який спочатку обчислює середню ціну абсолютно всіх товарів у базі.

WHERE price > ...: Потім основний запит порівнює ціну кожного конкретного товару з цим отриманим середнім числом.

Бізнес-цінність: Автоматичне сегментування товарів за ціновою категорією без необхідності вручну прописувати порогові значення ціни.

# 4.Аналіз наповненості категорій

ʼʼʼ
SELECT 
    c.category_name, 
    COUNT(p.product_id) AS total_products
FROM category c
JOIN product p ON c.category_id = p.category_id
GROUP BY 
    c.category_name
HAVING 
    COUNT(p.product_id) > 0;
ʼʼʼ
JOIN: Об’єднує категорії з продуктами.

GROUP BY c.category_name: Групує дані для підрахунку кількості товарів у кожній категорії.

HAVING COUNT(p.product_id) > 0: На відміну від WHERE, HAVING фільтрує вже агреговані дані. Тут він гарантує, що в звіт не потраплять порожні категорії, де немає жодного товару.

Бізнес-цінність: Виявлення найактивніших розділів магазину та приховування порожніх категорій зі звітності.
