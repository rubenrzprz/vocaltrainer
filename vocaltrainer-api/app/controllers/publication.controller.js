const db = require("../models");
const Publication = db.publications;
const Op = db.Sequelize.Op;

/**
 * Method that adds a publication
 * @param {*} req request
 * @param {*} res response
 */
exports.create = (req, res) => {
    console.log(req.body);
    if (!req.body.name || !req.body.type) {
        res.status(400).send({
            message: 'Cannot create publication without a name and a type'
        });
        return;
    }
    const publication = {
        userId: req.user.userId,
        name: req.body.name,
        description: req.body.description,
        type: req.body.type
    }
    Publication.create(publication)
        .then(data => {
            res.send(data)
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the publication'
            })
        })
};
/**
 * Method that finds all publications
 * @param {*} req request
 * @param {*} res response
 */
exports.findAll = (req, res) => {
    Publication.findAll().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving publications'
        })
    })
};
/**
 * Method that finds a publication by id
 * @param {*} req request
 * @param {*} res response
 */
exports.findById = (req, res) => {
    const publicationId = req.params.id;
    Publication.findByPk(publicationId)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find publication with id=${publicationId}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving publication with id=" + publicationId
            });
        });
};
/**
 * Method that finds all publications from a user
 * @param {*} req request
 * @param {*} res response
 */
exports.findAllUser = (req, res) => {
    const userId = req.params.id;
    Publication.findAll({
        where: { userId: userId }
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find publications for user with id=${userId}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving publications for user with id=" + userId
            });
        });
}

/**
 * Method that updates a publication
 * @param {*} req request
 * @param {*} res response
 */
exports.update = (req, res) => {
    const publicationId = req.params.id;
    Publication.update(req.body, {
        where: { publicationId }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Publication was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update publication with id=${publicationId}. Maybe publication was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating publication with id=" + publicationId
            });
        });
};

/**
 * Method that deletes a publication
 * @param {*} req request
 * @param {*} res response
 */
exports.delete = (req, res) => {
    const publicationId = req.params.id;
    Publication.destroy({
        where: { publicationId: publicationId }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Publication deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete publication with id=${publicationId}. Maybe publication was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete publication with id=" + publicationId
            });
        });
};

/**
 * Method that updates the ranking of a publication
 * @param {*} req request
 * @param {*} res response
 */
exports.addRating = (req, res) => {
    const publicationId = req.params.id;
    const { rating } = req.body;

    Publication.sequelize.query('CALL pr_publication_rating (:id, :rating)', { replacements: { id: publicationId, rating: rating } })
        .then(() => {
            res.send({
                message: 'Rating added successfully'
            })
        }).catch(err => {
            res.status(500).send({
                message: 'Could not add rating'
            })
        })
}
/**
 * Method that finds publications by type
 * @param {*} req request
 * @param {*} res response
 */
exports.findByType = (req, res) => {
    const { type } = req.params;
    if (type === 'all') return this.findAll(req, res);
    Publication.findAll({
        where: { type }
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find publications with type=${type}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving publications with type=" + type
            });
        });
}
/**
 * Method that finds publications by name
 * @param {*} req request
 * @param {*} res response
 */
exports.findByName = (req, res) => {
    const { name } = req.params;
    Publication.findAll({
        where: { 
            name: {
                [Op.startsWith]: name
            }
        }
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find publications with name=${name}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving publications with name=" + name
            });
        });
}
/**
 * Method that finds publications by last time updated
 * @param {*} req request
 * @param {*} res response
 */
exports.findByLastUpdate = (req, res) => {
    const { unit, period } = req.params;
    if (unit === 'all' || period === 'all') return this.findAll(req, res);
    const today = new Date();
    const [year, month, day] = [today.getFullYear(), today.getMonth(), today.getDate()];
    let goalDateObj = {
        year,
        month,
        day
    }
    goalDateObj[unit] -= period;
    const goalDate = new Date(goalDateObj.year, goalDateObj.month, goalDateObj.day);
    Publication.findAll({
        where: {
            updatedAt: {
                [Op.gte]: goalDate
            }
        }
    }).then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find publications from ${period} ${unit} ago.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: `Error retrieving publications from ${period} ${unit} ago.`
        });
    });
}