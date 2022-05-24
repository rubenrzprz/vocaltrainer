const { requireAuth } = require('../utils');

module.exports = app => {
    const publications = require('../controllers/publication.controller');
    let router = require("express").Router();
    router.post("/", requireAuth, publications.create);
    router.get("/", requireAuth, publications.findAll);
    router.get("/user/:id", requireAuth, publications.findAllUser);
    router.get("/:id", requireAuth, publications.findById);
    router.put("/:id", requireAuth, publications.update);
    router.delete("/:id", requireAuth, publications.delete);
    router.post("/:id", requireAuth, publications.addRating);
    router.get("/type/:type", requireAuth, publications.findByType);
    router.get("/name/:name", requireAuth, publications.findByName);
    router.get("/lastUpdate/:unit/:period", requireAuth, publications.findByLastUpdate);
    app.use('/api/publications', router);
};