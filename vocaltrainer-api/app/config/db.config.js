/**
 * Configuration of the database for Sequelize
 */
module.exports = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    pool: {
        min: 0,
        max: 10,
        acquire: 30000,
        idle: 10000
    }
}