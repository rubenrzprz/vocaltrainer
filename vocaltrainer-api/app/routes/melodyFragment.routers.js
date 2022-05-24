const { requireAuth, requireAdmin } = require('../utils');

module.exports = app => {
  const melodyFragment = require('../controllers/melodyFragment.controller');
  let router = require("express").Router();
  router.post("/", requireAuth, melodyFragment.create);
  router.post("/fullExercise", requireAuth, melodyFragment.createFullMelody);
  router.get("/", requireAuth, melodyFragment.findAll);
  router.get("/:id", requireAuth, melodyFragment.findInMelody);
  router.put("/:melodyId", requireAuth, melodyFragment.update);
  router.delete("/:melodyId/:position", requireAuth, melodyFragment.delete);
  app.use('/api/melodyFragments', router);
};