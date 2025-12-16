const dotenv = require('dotenv');
const { env } = require('process'); 

const isTest = env.NODE_ENV === 'test';
const envFile = isTest ? '.env.test' : '.env';

dotenv.config({ path: envFile });