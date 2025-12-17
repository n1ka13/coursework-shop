const { PrismaClient } = require('@prisma/client');
const path = require('path');

if (process.env.NODE_ENV === 'test') {
    require('dotenv').config({ path: path.resolve(__dirname, '../.env.test') });
} else {
    require('dotenv').config();
}

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

module.exports = prisma;