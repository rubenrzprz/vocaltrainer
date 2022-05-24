const { requireAuth, requireAdmin } = require('../utils');

module.exports = app => {
  const comments = require('../controllers/comment.controller');
  let router = require("express").Router();
  // Create a new Tutorial
  router.post("/", comments.create);
  // Retrieve all Tutorials
  router.get("/", comments.findAll);
  // Retrieve a single Tutorial with id
  router.get("/:id", comments.findOne);
  // Update a Tutorial with id
  router.put("/:id", comments.update);
  // Delete a Tutorial with id
  router.delete("/:id", comments.delete);
  app.use('/api/comments', router);
};