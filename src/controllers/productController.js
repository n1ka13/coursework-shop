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

exports.softDeleteProduct = async (req, res, next) => {
    try {
        const result = await productService.softDeleteProduct(req.params.id);
        res.status(200).json({ message: "Товар успішно деактивовано", result });
    } catch (error) {
        next(error);
    }
};

exports.restoreProduct = async (req, res, next) => {
    try {
        const result = await productService.restoreProduct(req.params.id);
        res.status(200).json({ message: "Товар успішно відновлено", result });
    } catch (error) {
        next(error);
    }
};