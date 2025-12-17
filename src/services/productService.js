const MyError = require("./myError");
const crud = require("../repositories/crud");
const analyticsRepo = require("../repositories/AnalyticsRepository");

exports.getProduct = async (id) => {
    const product = await crud.getOne("product", { product_id: Number(id) });
    if (!product) throw new MyError("Product not found", 404);
    return product;
};
exports.getProductsCountByCategory = async () => {
    const result = await analyticsRepo.countProductsByCategory();
    if (!result || result.length === 0) throw new MyError("Category analytics not found", 404);
    return result.map(row => ({
        categoryName: row.category_name,
        totalProducts: parseInt(row.total_products, 10)
    }));
};

exports.getNeverOrderedProducts = async () => {
    const result = await analyticsRepo.getNeverOrderedProducts();
    if (!result || result.length === 0) throw new MyError("No inactive products found", 404);
    return result;
};

exports.getAvgPriceByCategory = async () => {
    const result = await analyticsRepo.getAveragePriceByCategory();
    if (!result || result.length === 0) throw new MyError("Price analytics not found", 404);
    return result.map(row => ({
        categoryName: row.category_name,
        averagePrice: parseFloat(row.average_price).toFixed(2)
    }));
};

exports.getPremiumProducts = async () => {
    const result = await analyticsRepo.getProductsAboveAveragePrice();
    if (!result || result.length === 0) throw new MyError("No premium products found", 404);
    return result;
};

exports.getElectronics = async () => {
    const result = await analyticsRepo.getProductsFromElectronics();
    if (!result || result.length === 0) throw new MyError("No electronics found", 404);
    return result;
};