module.exports = app => {
    const auth = require('../controllers/authentication.controller');
    app.post('/api/login', auth.login);
    app.post('/api/signup', auth.signup);
};