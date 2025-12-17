require('./env.js'); 
const express = require('express');
const prisma = require('./prisma.js');
const dotenv = require('dotenv');

const orderRoutes = require('./routes/orderRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const workerRoutes = require('./routes/workerRoutes.js');
const clientRoutes = require('./routes/clientRoutes.js');

const errorHandler = require('./middleware/errorHandler.js');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 

app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/clients', clientRoutes);

app.use(errorHandler);

async function startServer() {
    try {
        await prisma.$connect();
        console.log('Successfully connected to the database.');

        if (process.env.NODE_ENV !== 'test') {
            app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
            });
        }
    } catch (e) {
        console.error('Failed to connect to the database or start server:', e);
        process.exit(1);
    }
}

startServer();

module.exports = app;