const MyError = require("./services/myError");

const errorHandler = (err, req, res, next) => {
    if (err instanceof MyError) {
        return res.status(err.status).json({ 
            error: err.message 
        });
    }

    if (err.code) {
        console.error("Database Error Code:", err.code);
        return res.status(400).json({ error: "Database operation failed", code: err.code });
    }

    console.error("Unhandled Error:", err);
    res.status(500).json({ 
        error: "Internal Server Error",
        details: err.message 
    });
};

module.exports = errorHandler;