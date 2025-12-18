#  Coursework Shop API

Бекенд-система для управління інтернет-магазином, що забезпечує функціонал обробки замовлень, управління каталогом товарів, клієнтами та аналітикою продажів. Система реалізує складну бізнес-логіку з використанням транзакцій та аналітичні звіти за допомогою SQL функцій.

---

# Технологічний стек
Мова програмування: Node.js (версія current).

Бібліотека ORM: Prisma ORM.

Фреймворк: Express.js.

Фреймворк тестування: Jest, Supertest.

База даних: PostgreSQL 15.

Контейнеризація: Docker, Docker Compose

---

# Інструкції з налаштування

### Клонуйте репозиторій:

```bash
git clone https://github.com/n1ka13/coursework-shop.git
cd coursework-shop
```

### Запустіть сервіси через Docker:

```bash
docker-compose up -d
```

Це запустить базу даних PostgreSQL на порті 5432.

### Встановіть залежності:

```bash
npm install
```

### Налаштуйте базу даних: 
Створіть файл .env та вкажіть DATABASE_URL. Потім запустіть міграції:

```bash
DATABASE_URL="postgresql://admin:password123@localhost:5432/shop_database?schema=public"
```

Створіть також .env.test

```bash
DATABASE_URL="postgresql://admin:password123@localhost:5432/shop_test_db?schema=public"
```

### Запуск бази даних і додатку

```bash
docker-compose up --build
```

Додаток доступний буде за посиланням:

```
http://localhost:3000
```

### Запуск тестів

```bash
npm test
```

### Запустити конкретний тестовий файл

```bash
npx jest tests/file.test.js
```
### Переглянути приклади в терміналі

Запускаємо базу даних та додаток

```bash
docker-compose up --build
```

Створюємо таблиці в базі даних

```bash
npx prisma migrate dev --name init
```

Заповнюємо базу даних
```
node seed.js
```

Перевіряємо через curl

```
curl -X GET http://localhost:3000/api/orders/analytics/revenue-dynamics
```
```
curl -X GET http://localhost:3000/api/products/analytics/categories
```
```
curl -X GET http://localhost:3000/api/products/analytics/premium
```
або переглядаємо таблиці через Prisma Studio

```
npx prisma studio
```

#  Огляд структури проєкту
- prisma/ — Схема бази даних (schema.prisma) та історія міграцій.

- src/controllers/ — Обробка HTTP-запитів та взаємодія з клієнтом.

- src/services/ — Реалізація бізнес-логіки та транзакцій.

- src/repositories/ — Шар прямого доступу до бази даних (CRUD та аналітичні SQL запити).

- src/routes/ — Опис API-ендпоїнтів системи.

- src/tests/ — Інтеграційні та модульні тести для перевірки стабільності.

- middleware/ — Централізована обробка помилок та кастомні класи помилок (myError.js).