const { requireAuth, requireAdmin } = require('../utils');

module.exports = app => {
  const exerciseLists = require('../controllers/exerciseList.controller');
  let router = require("express").Router();
  router.post("/", requireAuth, exerciseLists.create);
  router.get("/", requireAuth, exerciseLists.findAll);
  router.delete("/:listId/:exerciseId", requireAuth, exerciseLists.delete);
  router.get("/list/:id", requireAuth, exerciseLists.findInList);
  router.get("/exercise/:id", requireAuth, exerciseLists.findLists);
  router.put("/:listId", requireAuth, exerciseLists.updateList);
  app.use('/api/exerciseLists', router);
};