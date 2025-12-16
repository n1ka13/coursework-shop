import './env.js'; 
import express from 'express';
import prisma from './prisma.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 

app.use('/api', orderRoutes);

async function startServer() {
    try {
        await prisma.$connect();
        console.log('Successfully connected to the database.');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (e) {
        console.error('Failed to connect to the database or start server:', e);
        process.exit(1);
    }
}

startServer();