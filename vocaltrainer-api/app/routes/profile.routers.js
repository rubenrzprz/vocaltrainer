const { requireAuth, requireAdmin } = require('../utils');

module.exports = app => {
  const profiles = require('../controllers/profile.controller');
  let router = require("express").Router();
  router.get("/", requireAuth, requireAdmin, profiles.findAll);
  router.get("/:id", requireAuth, profiles.findOne);
  router.put("/:id", requireAuth, profiles.update);
  router.delete("/:id", requireAuth, requireAdmin, profiles.delete);
  app.use('/api/profiles', router);
};