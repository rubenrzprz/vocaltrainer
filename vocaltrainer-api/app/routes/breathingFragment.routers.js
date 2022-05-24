const { requireAuth, requireAdmin } = require('../utils');

module.exports = app => {
  const breathingFragment = require('../controllers/breathingFragment.controller');
  let router = require("express").Router();
  router.post("/", requireAuth, breathingFragment.create);
  router.get("/", requireAuth, breathingFragment.findAll);
  router.post("/fullExercise", requireAuth, breathingFragment.createFullExercise);
  router.get("/:id", requireAuth, breathingFragment.findInBreathing);
  router.put("/:breathingId", requireAuth, breathingFragment.update);
  router.delete("/:breathingId/:position", requireAuth, breathingFragment.delete);
  app.use('/api/breathingFragments', router);
};