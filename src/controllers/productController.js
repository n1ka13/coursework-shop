const productService = require("../services/productService");

exports.getCategoryStats = async (req, res, next) => {
    try {
        const stats = await productService.getProductsCountByCategory();
        res.json(stats);
    } catch (error) {
        next(error);
    }
};

exports.getNeverOrdered = async (req, res, next) => {
    try {
        const products = await productService.getNeverOrderedProducts();
        res.json(products);
    } catch (error) {
        next(error);
    }
};

exports.getAvgPrices = async (req, res, next) => {
    try {
        const stats = await productService.getAvgPriceByCategory();
        res.json(stats);
    } catch (error) {
        next(error);
    }
};

exports.getPremiumProducts = async (req, res, next) => {
    try {
        const products = await productService.getPremiumProducts();
        res.json(products);
    } catch (error) {
        next(error);
    }
};