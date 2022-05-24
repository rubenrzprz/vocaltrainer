const db = require("../models");
const Comment = db.comments;
const Op = db.Sequelize.Op;

/**
 * Method that adds a comment
 * @param {*} req request
 * @param {*} res response
 */
exports.create = (req, res) => {
    console.log(req.body);
    if (!req.body.userId || !req.body.content || !req.body.publicationId) {
        res.status(400).send({
            message: 'Cannot create comment without: userId, content or publicationId'
        });
        return;
    }
    const comment = {
        userId: req.body.userId,
        publicationId: req.body.publicationId,
        content: req.body.content,
    }
    Comment.create(comment)
        .then(data => {
            res.send(data)
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the comment'
            })
        })
};

/**
 * Method that finds all comments
 * @param {*} req request
 * @param {*} res response
 */
exports.findAll = (req, res) => {
    Comment.findAll().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving comments'
        })
    })
};

/**
 * Method that find a comment by its id
 * @param {*} req request
 * @param {*} res response
 */
exports.findOne = (req, res) => {
    const commentId = req.params.id;
    Comment.findByPk(commentId)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find comment with id=${commentId}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving comment with id=" + commentId
            });
        });
};

/**
 * Method that update a comment
 * @param {*} req request
 * @param {*} res response
 */
exports.update = (req, res) => {
    const commentId = req.params.id;
    Comment.update(req.body, {
        where: { commentId: commentId }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Comment was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update comment with id=${commentId}. Maybe comment was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating comment with id=" + commentId
            });
        });
};

/**
 * Method that deletes a comment
 * @param {*} req request
 * @param {*} res response
 */
exports.delete = (req, res) => {
    const commentId = req.params.id;
    Comment.destroy({
        where: { commentId: commentId }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Comment deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete comment with id=${commentId}. Maybe comment was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete comment with id=" + commentId
            });
        });
};