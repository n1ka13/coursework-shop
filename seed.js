const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding process with realistic Sumy data...");

  await prisma.client.createMany({
    data: [
      { client_name: "Олександр", last_name: "Коваленко", email: "olex.koval@example.com", phone_number: "+380501112233" },
      { client_name: "Марина", last_name: "Лисенко", email: "m.lysenko@example.com", phone_number: "+380674445566" },
      { client_name: "Сергій", last_name: "Бондаренко", email: "s.bond@example.com", phone_number: "+380937778899" },
      { client_name: "Олена", last_name: "Ткаченко", email: "elena.tk@example.com", phone_number: "+380500001122" },
      { client_name: "Дмитро", last_name: "Кравченко", email: "d.krav@example.com", phone_number: "+380661234567" },
    ],
  });

  await prisma.address.createMany({
    data: [
      { country: "Ukraine", city: "Sumy", street: "Соборна 12", postal_code: "40000", client_id: 1 },
      { country: "Ukraine", city: "Sumy", street: "Прокоф'єва 14", postal_code: "40002", client_id: 2 },
      { country: "Ukraine", city: "Sumy", street: "Харківська 3", postal_code: "40007", client_id: 3 },
      { country: "Ukraine", city: "Sumy", street: "Героїв Сумщини 10", postal_code: "40000", client_id: 4 },
      { country: "Ukraine", city: "Sumy", street: "Петропавлівська 82", postal_code: "40001", client_id: 5 },
    ],
  });

  await prisma.category.createMany({
    data: [
      { category_name: "Electronics", description: "Смартфони, ноутбуки та аксесуари" },
      { category_name: "Clothing", description: "Одяг та взуття" },
      { category_name: "Home", description: "Побутова техніка" },
      { category_name: "Sports", description: "Спорт та відпочинок" },
    ],
  });

  await prisma.worker.createMany({
    data: [
      { worker_role: "admin", first_name: "Андрій", last_name: "Мельник", phone_number: "+380509990011" },
      { worker_role: "manager", first_name: "Тетяна", last_name: "Шевченко", phone_number: "+380671112233" },
      { worker_role: "operator", first_name: "Олег", last_name: "Сидоренко", phone_number: "+380935556677" },
      { worker_role: "courier", first_name: "Микола", last_name: "Василенко", phone_number: "+380503334455" },
    ],
  });

  await prisma.product.createMany({
    data: [
      {
        product_name: "Смартфон Samsung Galaxy A54",
        price: 14500,
        quantity: 15,
        description: "Надійний смартфон з чудовим екраном",
        stock_status: "in_stock",
        category_id: 1,
      },
      {
        product_name: "Ноутбук ASUS Vivobook 15",
        price: 22000,
        quantity: 8,
        description: "Легкий ноутбук для навчання та роботи",
        stock_status: "in_stock",
        category_id: 1,
      },
      {
        product_name: "Навушники Apple AirPods Pro 2",
        price: 9500,
        quantity: 20,
        description: "Найкраще шумозаглушення для музики",
        stock_status: "in_stock",
        category_id: 1,
      },
      {
        product_name: "Фітнес-браслет Xiaomi Mi Band 8",
        price: 1800,
        quantity: 50,
        description: "Відстеження кроків та серцебиття",
        stock_status: "in_stock",
        category_id: 1,
      },
      {
        product_name: "Електронна книга PocketBook 629",
        price: 5200,
        quantity: 0,
        description: "Комфортне читання як зі звичайного паперу",
        stock_status: "out_of_stock",
        category_id: 1,
      },
    ],
  });

  await prisma.orders.createMany({
    data: [
      { order_date: new Date("2025-12-01"), order_price: 14500, status: "confirmed", discount: 0, client_id: 1, address_id: 1, worker_id: 3 },
      { order_date: new Date("2025-12-10"), order_price: 1800, status: "delivered", discount: 10, client_id: 2, address_id: 2, worker_id: 3 },
      { order_date: new Date("2025-12-15"), order_price: 9500, status: "processing", discount: 0, client_id: 3, address_id: 3, worker_id: 3 },
    ],
  });

  await prisma.payment.createMany({
    data: [
      { payment_method: "online", payment_status: "paid", price: 14500, order_id: 1 },
      { payment_method: "by_card", payment_status: "paid", price: 1620, order_id: 2 },
      { payment_method: "by_cash_on_delivery", payment_status: "not_paid", price: 9500, order_id: 3 },
    ],
  });

  await prisma.order_item.createMany({
    data: [
      { quantity: 1, order_id: 1, product_id: 1 },
      { quantity: 1, order_id: 2, product_id: 4 },
      { quantity: 1, order_id: 3, product_id: 3 },
    ],
  });

  console.log("Database successfully seeded with gadgets and proper surnames.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });