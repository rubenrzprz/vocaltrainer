const dbConfig = require('../config/db.config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require('./user.model.js')(sequelize, Sequelize);
db.profiles = require('./profile.model.js')(sequelize, Sequelize);
db.publications = require('./publication.model.js')(sequelize, Sequelize);
db.comments = require('./comment.model.js')(sequelize, Sequelize);
db.exercise_lists = require('./exerciseList.model.js')(sequelize, Sequelize);
db.melody_fragments = require('./melodyFragment.model.js')(sequelize, Sequelize);
db.breathing_fragments = require('./breathingFragment.model.js')(sequelize, Sequelize);
module.exports = db;