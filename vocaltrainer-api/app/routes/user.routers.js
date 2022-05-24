const { requireAuth, requireAdmin } = require('../utils');

module.exports = app => {
  const users = require('../controllers/user.controller');
  let router = require("express").Router();
  router.get("/", requireAuth, requireAdmin, users.findAll);
  router.get("/:id", users.findOne);
  router.put("/:id", requireAuth, users.update);
  router.delete("/:id", requireAuth, requireAdmin, users.delete);
  router.get("/name/:name", requireAuth, users.findByName);
  app.use('/api/users', router);
};