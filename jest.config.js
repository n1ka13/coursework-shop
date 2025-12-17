require('dotenv').config({ path: '.env.test' });

module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/src/tests/**/*.js'],
  setupFiles: ["<rootDir>/src/env.js"], 
  forceExit: true,
};